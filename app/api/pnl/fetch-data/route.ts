import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { checkRateLimit } from '@/utils/rate-limit';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import { getActiveSubscription } from '@/lib/stripe/helpers';
import { encryptToken } from '@/utils/teller-token-encryption';
import https from 'https';

const TELLER_API_URL = 'https://api.teller.io';

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { access_token, account_id } = await request.json();

    if (!access_token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

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
      console.error('Failed to fetch accounts:', errData);
      return NextResponse.json(
        { error: 'Failed to fetch accounts', details: errData },
        { status: accountsRes.status }
      );
    }

    let accounts = await accountsRes.json();
    
    // Filter to specific account if provided
    if (account_id) {
      accounts = accounts.filter((acc: any) => acc.id === account_id);
    }

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: 'No accounts found' },
        { status: 404 }
      );
    }

    // 2. Fetch balances for each account
    const accountsWithBalances = await Promise.all(
      accounts.map(async (account: any) => {
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
    const accountIds = accounts.map((acc: any) => acc.id);
    const { data: connectedAccounts } = await supabaseAdmin
      .from('connected_accounts')
      .select('account_id, last_synced_at')
      .eq('user_id', user.id)
      .in('account_id', accountIds);

    const lastSyncedMap = new Map<string, string>();
    connectedAccounts?.forEach((ca: any) => {
      if (ca.last_synced_at) {
        lastSyncedMap.set(ca.account_id, ca.last_synced_at);
      }
    });

    // 5. Fetch transactions for each account
    // For subscription users with existing reports: fetch from last_synced_at - 1 day (merge mode)
    // For new reports or non-subscription users: fetch last 12 months (full fetch)
    let allTransactions: any[] = [];
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
          console.log(`Account ${account.id}: merge mode, fetching from ${startDate} (${SYNC_OVERLAP_DAYS} day overlap)`);
        } else {
          // Full fetch mode: last 12 months
          startDate = defaultStartDate;
          console.log(`Account ${account.id}: full fetch, fetching from ${startDate}`);
        }

        const txnRes = await tellerFetch(
          `${TELLER_API_URL}/accounts/${account.id}/transactions?start_date=${startDate}&end_date=${endDate}`,
          { headers }
        );
        if (txnRes.ok) {
          const transactions = await txnRes.json();
          allTransactions = allTransactions.concat(transactions);
        }
      } catch (err) {
        console.error(`Failed to fetch transactions for account ${account.id}:`, err);
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

    // 7. Store in database (for each account, create or update report)
    const reportResults = await Promise.all(
      accounts.map(async (account: any) => {
        try {
          // Check if report already exists for this account
          const { data: existingReport } = await supabaseAdmin
            .from('pnl_reports')
            .select('id, report_token, raw_teller_data, manual_assignments')
            .eq('user_id', user.id)
            .eq('account_id', account.id)
            .single();

          let finalRawData = rawTellerData;
          let finalManualAssignments = existingReport?.manual_assignments || {};

          // If subscription user with existing report: merge transactions
          if (hasSubscription && existingReport && existingReport.raw_teller_data) {
            const existingData = existingReport.raw_teller_data as any;
            const existingTransactions = existingData.transactions || [];
            const newTransactions = rawTellerData.transactions || [];

            // Merge transactions: combine old + new, dedupe by transaction ID
            const transactionMap = new Map<string, any>();
            
            // Add existing transactions first
            existingTransactions.forEach((txn: any) => {
              transactionMap.set(txn.id, txn);
            });
            
            // Add/update with new transactions (newer data takes precedence)
            newTransactions.forEach((txn: any) => {
              transactionMap.set(txn.id, txn);
            });

            // Convert back to array
            const mergedTransactions = Array.from(transactionMap.values());
            
            // Sort by date (newest first)
            mergedTransactions.sort((a, b) => {
              const dateA = new Date(a.date || a.created_at || 0).getTime();
              const dateB = new Date(b.date || b.created_at || 0).getTime();
              return dateB - dateA;
            });

            finalRawData = {
              ...rawTellerData,
              transactions: mergedTransactions,
              // Update date range to reflect full dataset
              date_range: {
                start: existingData.date_range?.start || overallStartDate,
                end: endDate,
              },
            };

            console.log(`Merged ${existingTransactions.length} existing + ${newTransactions.length} new = ${mergedTransactions.length} total transactions`);
          }

          // Calculate PNL report with merged data and preserved manual assignments
          const pnlReport = calculatePNLReport(finalRawData, finalManualAssignments);

          const reportData = {
            user_id: user.id,
            account_id: account.id,
            raw_teller_data: finalRawData,
            pnl_data: pnlReport,
            manual_assignments: finalManualAssignments, // Explicitly preserve
            status: 'completed',
            updated_at: new Date().toISOString(),
          };

          let reportId: string;
          let reportToken: string;
          if (existingReport) {
            // Update existing report
            const { data, error } = await supabaseAdmin
              .from('pnl_reports')
              .update(reportData)
              .eq('id', existingReport.id)
              .select('id, report_token')
              .single();
            
            if (error) throw error;
            reportId = data.id;
            reportToken = data.report_token;
          } else {
            // Create new report
            const { data, error } = await supabaseAdmin
              .from('pnl_reports')
              .insert(reportData)
              .select('id, report_token')
              .single();
            
            if (error) throw error;
            reportId = data.id;
            reportToken = data.report_token;
          }

          // Store/update connected account
          // Clear needs_refresh flag after successful sync
          // For subscription users: encrypt and store access token for daily refresh
          const accountUpdateData: any = {
            user_id: user.id,
            account_id: account.id,
            account_name: account.name,
            account_type: account.type,
            enrollment_id: account.enrollment_id || null, // Store enrollment_id if available
            enrollment_status: 'connected',
            last_synced_at: new Date().toISOString(),
            needs_refresh: false, // Clear refresh flag after successful sync
            updated_at: new Date().toISOString(),
          };

          // If subscription user: encrypt and store access token, enable daily refresh
          if (hasSubscription && access_token) {
            try {
              accountUpdateData.encrypted_access_token = encryptToken(access_token);
              accountUpdateData.token_encrypted_at = new Date().toISOString();
              accountUpdateData.can_refresh_daily = true;
            } catch (error: any) {
              console.error(`Error encrypting token for account ${account.id}:`, error);
              // Continue without storing token if encryption fails
            }
          }

          const { error: accountError } = await supabaseAdmin
            .from('connected_accounts')
            .upsert(accountUpdateData, {
              onConflict: 'user_id,account_id',
            });

          if (accountError) {
            console.error('Error storing connected account:', accountError);
          }

          return { 
            account_id: account.id, 
            report_id: reportId, 
            report_token: reportToken,
            success: true 
          };
        } catch (error: any) {
          console.error(`Error storing report for account ${account.id}:`, error);
          return { account_id: account.id, success: false, error: error.message };
        }
      })
    );

    const successCount = reportResults.filter(r => r.success).length;

    // 8. Delete account connections (Teller charges per active enrollment)
    // For subscription users: Keep enrollments active for daily refresh
    // For one-time users: Disconnect after fetch to minimize costs
    if (!hasSubscription) {
      console.log(`Disconnecting ${accounts.length} account(s) from Teller (one-time user)...`);
      
      const disconnectResults = await Promise.all(
        accounts.map(async (account: any) => {
          try {
            const deleteRes = await tellerFetch(`${TELLER_API_URL}/accounts/${account.id}`, {
              method: 'DELETE',
              headers,
            });
            if (deleteRes.ok) {
              return { id: account.id, success: true };
            } else {
              return { id: account.id, success: false };
            }
          } catch (err: any) {
            console.error(`Error disconnecting account ${account.id}:`, err?.message);
            return { id: account.id, success: false, error: err?.message };
          }
        })
      );
      
      const disconnectedCount = disconnectResults.filter(r => r.success).length;
      console.log(`Disconnected ${disconnectedCount}/${accounts.length} account(s)`);
    } else {
      console.log(`Keeping ${accounts.length} enrollment(s) active for subscription user (daily refresh enabled)`);
    }

    // Return success with the first report token for redirect
    // Since users typically connect one account at a time, we return the first report token
    const firstReport = reportResults.find((r: any) => r.success && r.report_token);
    
    return NextResponse.json({ 
      success: true,
      report_count: successCount,
      total_accounts: accounts.length,
      reportToken: firstReport?.report_token || null, // Return first report token for redirect
      accounts: reportResults.map((r: any) => ({
        account_id: r.account_id,
        report_id: r.report_id,
        report_token: r.report_token,
        success: r.success,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching PNL data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PNL data', details: error?.message },
      { status: 500 }
    );
  }
}
