import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { checkRateLimit } from '@/utils/rate-limit';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import https from 'https';

const TELLER_API_URL = 'https://api.teller.io';

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

    // 3. Fetch transactions for each account (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const startDate = twelveMonthsAgo.toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    let allTransactions: any[] = [];

    for (const account of accounts) {
      try {
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

    // 4. Prepare raw data
    const rawTellerData = {
      accounts: accountsWithBalances,
      transactions: allTransactions,
      fetched_at: new Date().toISOString(),
      date_range: { start: startDate, end: endDate },
      provider: 'teller' as const,
    };

    // 5. Calculate PNL report
    const pnlReport = calculatePNLReport(rawTellerData);

    // 6. Store in database (for each account, create a report)
    const reportResults = await Promise.all(
      accounts.map(async (account: any) => {
        try {
          // Check if report already exists for this account
          const { data: existingReport } = await supabaseAdmin
            .from('pnl_reports')
            .select('id, report_token')
            .eq('user_id', user.id)
            .eq('account_id', account.id)
            .single();

          const reportData = {
            user_id: user.id,
            account_id: account.id,
            raw_teller_data: rawTellerData,
            pnl_data: pnlReport,
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
          const { error: accountError } = await supabaseAdmin
            .from('connected_accounts')
            .upsert({
              user_id: user.id,
              account_id: account.id,
              account_name: account.name,
              account_type: account.type,
              last_synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, {
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

    // 7. Delete account connections (Teller charges per active enrollment)
    // Note: For subscriptions with weekly updates, we might want to keep connections
    // For now, we'll disconnect to save costs
    console.log(`Disconnecting ${accounts.length} account(s) from Teller...`);
    
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
      pnl_report: pnlReport,
    });
  } catch (error: any) {
    console.error('Error fetching PNL data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PNL data', details: error?.message },
      { status: 500 }
    );
  }
}
