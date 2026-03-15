import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { checkRateLimit } from '@/utils/rate-limit';
import { calculatePNLReport, type RawFinancialData } from '@/lib/pnl-calculations';
import { getActiveSubscription } from '@/lib/stripe/helpers';
import { encryptToken } from '@/utils/teller-token-encryption';
import https from 'https';
import { z } from 'zod';

const TELLER_API_URL = 'https://api.teller.io';

interface TellerAccount {
  id: string;
  name?: string;
  type?: string;
  enrollment_id?: string;
  [key: string]: unknown;
}

// ============ CONFIGURATION ============
// Auto-refresh frequency for subscription users
// Change this to 'weekly' or 'monthly' as needed
const AUTO_REFRESH_FREQUENCY: 'weekly' | 'monthly' = 'monthly';

// Transaction sync overlap (days)
// Teller recommends 7-10 days to capture transactions that shift dates when moving from pending to posted
// See: https://teller.io/docs/api/account/transactions#list-transactions
const SYNC_OVERLAP_DAYS = 7; // Change to 1-10 as needed (Teller recommends 7-10)
// ========================================

/**
 * Teller API requires Basic Auth with access_token as username and empty password
 */
function createAuthHeader(accessToken: string): string {
  const credentials = Buffer.from(`${accessToken}:`).toString('base64');
  return `Basic ${credentials}`;
}

/**
 * Make a request to Teller API with mTLS support for development/production
 */
async function tellerFetch(url: string, options: { method?: string; headers: Record<string, string> }): Promise<Response> {
  const cert = process.env.TELLER_CERTIFICATE;
  const key = process.env.TELLER_PRIVATE_KEY;

  // If no certificates, use regular fetch (sandbox mode)
  if (!cert || !key) {
    return fetch(url, options);
  }

  // Use https.request for mTLS support
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const reqOptions: https.RequestOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers,
      cert: cert.replace(/\\n/g, '\n'),
      key: key.replace(/\\n/g, '\n'),
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          ok: res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false,
          status: res.statusCode || 500,
          json: async () => JSON.parse(data),
          text: async () => data,
        } as Response);
      });
    });

    req.on('error', reject);
    req.end();
  });
}

const fetchDataSchema = z.object({
  access_token: z.string().min(1),
  account_id: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: z.infer<typeof fetchDataSchema>;
    try {
      body = fetchDataSchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request body', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const { access_token, account_id } = body;

    // Rate limiting: 5 Teller API calls per hour per user
    const rateLimit = checkRateLimit(`pnl-fetch:${user.id}`, 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: 'Too many data fetch requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          }
        }
      );
    }

    const authHeader = createAuthHeader(access_token);
    const headers = { Authorization: authHeader };

    // 1. Fetch all accounts (or specific account if account_id provided)
    const accountsRes = await tellerFetch(`${TELLER_API_URL}/accounts`, { headers });

    if (!accountsRes.ok) {
      const errData = await accountsRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to fetch accounts', details: errData },
        { status: accountsRes.status }
      );
    }

    let accounts = await accountsRes.json();
    
    // Filter to specific account if provided
    if (account_id) {
      accounts = accounts.filter((acc: TellerAccount) => acc.id === account_id);
    }

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: 'No accounts found' },
        { status: 404 }
      );
    }

    // 2. Fetch balances for each account
    const accountsWithBalances = await Promise.all(
      accounts.map(async (account: TellerAccount) => {
        try {
          const balanceRes = await tellerFetch(
            `${TELLER_API_URL}/accounts/${account.id}/balances`,
            { headers }
          );
          const balances = balanceRes.ok ? await balanceRes.json() : null;
          return { ...account, balances };
        } catch {
          return { ...account, balances: null };
        }
      })
    );

    // 3. Check if user has active subscription
    const subscription = await getActiveSubscription(user.id);
    const hasSubscription = !!subscription;

    // 4. Get last_synced_at for all accounts (for merge mode)
    const accountIds = accounts.map((acc: TellerAccount) => acc.id);
    const { data: connectedAccounts } = await supabaseAdmin
      .from('connected_accounts')
      .select('account_id, last_synced_at')
      .eq('user_id', user.id)
      .in('account_id', accountIds);

    const lastSyncedMap = new Map<string, string>();
    connectedAccounts?.forEach((ca: { account_id: string; last_synced_at: string | null }) => {
      if (ca.last_synced_at) {
        lastSyncedMap.set(ca.account_id, ca.last_synced_at);
      }
    });

    // 5. Fetch transactions for each account
    // For subscription users with existing reports: fetch from last_synced_at - 1 day (merge mode)
    // For new reports or non-subscription users: fetch last 12 months (full fetch)
    let allTransactions: Record<string, unknown>[] = [];
    const endDate = new Date().toISOString().split('T')[0];
    const defaultStartDate = (() => {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      return twelveMonthsAgo.toISOString().split('T')[0];
    })();

    for (const account of accounts) {
      try {
        // Determine start date for this account
        let startDate: string;
        if (hasSubscription && lastSyncedMap.has(account.id)) {
          // Merge mode: fetch from last_synced_at - SYNC_OVERLAP_DAYS
          // Teller recommends 7-10 days overlap to capture transactions that shift dates when posting
          const lastSynced = new Date(lastSyncedMap.get(account.id)!);
          lastSynced.setDate(lastSynced.getDate() - SYNC_OVERLAP_DAYS);
          startDate = lastSynced.toISOString().split('T')[0];
        } else {
          // Full fetch mode: last 12 months
          startDate = defaultStartDate;
        }

        const txnRes = await tellerFetch(
          `${TELLER_API_URL}/accounts/${account.id}/transactions?start_date=${startDate}&end_date=${endDate}`,
          { headers }
        );
        if (txnRes.ok) {
          const transactions = await txnRes.json();
          allTransactions = allTransactions.concat(transactions);
        }
      } catch {
      }
    }

    // Use earliest start date for the overall date range
    const overallStartDate = hasSubscription && lastSyncedMap.size > 0
      ? (() => {
          const dates = Array.from(lastSyncedMap.values()).map(d => {
            const date = new Date(d);
            date.setDate(date.getDate() - SYNC_OVERLAP_DAYS);
            return date;
          });
          const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
          return earliest.toISOString().split('T')[0];
        })()
      : defaultStartDate;

    // 6. Prepare raw data
    const rawTellerData = {
      accounts: accountsWithBalances,
      transactions: allTransactions,
      fetched_at: new Date().toISOString(),
      date_range: { start: overallStartDate, end: endDate },
      provider: 'teller' as const,
    };

    // 7. One report per user: get or create single report, then upsert connected_accounts
    const { data: existingReport } = await supabaseAdmin
      .from('pnl_reports')
      .select('id, report_token, raw_teller_data, manual_assignments')
      .eq('user_id', user.id)
      .single();

    let finalRawData = rawTellerData;
    const finalManualAssignments: Record<string, string> = (existingReport?.manual_assignments as Record<string, string>) || {};

    if (existingReport?.raw_teller_data) {
      const existingData = existingReport.raw_teller_data as RawFinancialData;
      const existingTransactions = existingData.transactions || [];
      const newTransactions = rawTellerData.transactions || [];

      const transactionMap = new Map<string, Record<string, unknown>>();
      existingTransactions.forEach((txn) => transactionMap.set(txn.id as string, txn));
      newTransactions.forEach((txn) => transactionMap.set(txn.id as string, txn));
      const mergedTransactions = Array.from(transactionMap.values());
      mergedTransactions.sort((a, b) => {
        const dateA = new Date(String(a.date || a.created_at || 0)).getTime();
        const dateB = new Date(String(b.date || b.created_at || 0)).getTime();
        return dateB - dateA;
      });

      const existingAccounts = existingData.accounts || [];
      const accountMap = new Map<string, Record<string, unknown>>();
      existingAccounts.forEach((acc) => accountMap.set(acc.id as string, acc));
      (rawTellerData.accounts || []).forEach((acc) => accountMap.set(acc.id as string, acc));
      const mergedAccounts = Array.from(accountMap.values());

      finalRawData = {
        ...rawTellerData,
        accounts: mergedAccounts,
        transactions: mergedTransactions,
        date_range: {
          start: existingData.date_range?.start || overallStartDate,
          end: endDate,
        },
      };
    }

    const pnlReport = calculatePNLReport(finalRawData, finalManualAssignments);
    const reportPayload = {
      user_id: user.id,
      account_id: null,
      raw_teller_data: finalRawData,
      pnl_data: pnlReport,
      manual_assignments: finalManualAssignments,
      status: 'completed',
      updated_at: new Date().toISOString(),
    };

    let reportToken: string;
    if (existingReport) {
      const { data, error } = await supabaseAdmin
        .from('pnl_reports')
        .update(reportPayload)
        .eq('id', existingReport.id)
        .select('report_token')
        .single();
      if (error) throw error;
      reportToken = data.report_token;
    } else {
      const { data, error } = await supabaseAdmin
        .from('pnl_reports')
        .insert(reportPayload)
        .select('report_token')
        .single();
      if (error) throw error;
      reportToken = data.report_token;
    }

    for (const account of accounts) {
      const accountUpdateData: Record<string, unknown> = {
        user_id: user.id,
        account_id: account.id,
        account_name: account.name,
        account_type: account.type,
        enrollment_id: account.enrollment_id || null,
        enrollment_status: 'connected',
        last_synced_at: new Date().toISOString(),
        needs_refresh: false,
        updated_at: new Date().toISOString(),
      };
      if (access_token) {
        try {
          accountUpdateData.encrypted_access_token = encryptToken(access_token);
          accountUpdateData.token_encrypted_at = new Date().toISOString();
          accountUpdateData.can_refresh_daily = true;
        } catch {
        }
      }
      const { error: accountError } = await supabaseAdmin
        .from('connected_accounts')
        .upsert(accountUpdateData, { onConflict: 'user_id,account_id' });
    }

    return NextResponse.json({
      success: true,
      report_count: 1,
      total_accounts: accounts.length,
      reportToken,
      accounts: accounts.map((acc: TellerAccount) => ({
        account_id: acc.id,
        report_token: reportToken,
        success: true,
      })),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch PNL data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
