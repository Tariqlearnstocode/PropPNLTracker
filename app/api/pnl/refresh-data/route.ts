import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import { decryptToken } from '@/utils/teller-token-encryption';
import https from 'https';

const TELLER_API_URL = 'https://api.teller.io';
const SYNC_OVERLAP_DAYS = 7; // Same as fetch-data endpoint

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

/**
 * Check if user already refreshed today
 */
function hasRefreshedToday(lastRefreshAttempt: string | null): boolean {
  if (!lastRefreshAttempt) return false;
  
  const lastRefresh = new Date(lastRefreshAttempt);
  const now = new Date();
  
  // Check if last refresh was today (same day)
  return (
    lastRefresh.getUTCFullYear() === now.getUTCFullYear() &&
    lastRefresh.getUTCMonth() === now.getUTCMonth() &&
    lastRefresh.getUTCDate() === now.getUTCDate()
  );
}

/**
 * POST /api/pnl/refresh-data
 * 
 * Daily refresh endpoint for subscription users
 * Validates daily rate limit (once per day per account)
 * Fetches new transactions and merges with existing data
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { account_id } = await request.json();

    // Get connected accounts for this user that can refresh daily
    const { data: connectedAccounts, error: accountsError } = await supabaseAdmin
      .from('connected_accounts')
      .select('account_id, encrypted_access_token, last_refresh_attempt, last_synced_at, can_refresh_daily')
      .eq('user_id', user.id)
      .eq('can_refresh_daily', true);

    if (accountsError) {
      console.error('Error fetching connected accounts:', accountsError);
      return NextResponse.json(
        { error: 'Failed to fetch connected accounts' },
        { status: 500 }
      );
    }

    if (!connectedAccounts || connectedAccounts.length === 0) {
      return NextResponse.json(
        { error: 'No accounts available for daily refresh' },
        { status: 404 }
      );
    }

    // Filter to specific account if provided, otherwise refresh all
    const accountsToRefresh = account_id
      ? connectedAccounts.filter(ca => ca.account_id === account_id)
      : connectedAccounts;

    if (accountsToRefresh.length === 0) {
      return NextResponse.json(
        { error: 'Account not found or not available for refresh' },
        { status: 404 }
      );
    }

    // Check daily rate limit for each account
    for (const account of accountsToRefresh) {
      if (hasRefreshedToday(account.last_refresh_attempt)) {
        const lastRefresh = new Date(account.last_refresh_attempt!);
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: `You can refresh your data once per day. Last refreshed: ${lastRefresh.toLocaleString()}`,
            lastRefreshAttempt: account.last_refresh_attempt,
          },
          { status: 429 }
        );
      }

      if (!account.encrypted_access_token) {
        return NextResponse.json(
          { error: 'Access token not found for account', account_id: account.account_id },
          { status: 400 }
        );
      }
    }

    const refreshResults = await Promise.all(
      accountsToRefresh.map(async (connectedAccount) => {
        try {
          // Decrypt access token
          let accessToken: string;
          try {
            accessToken = decryptToken(connectedAccount.encrypted_access_token!);
          } catch (error: any) {
            console.error(`Error decrypting token for account ${connectedAccount.account_id}:`, error);
            return {
              account_id: connectedAccount.account_id,
              success: false,
              error: 'Failed to decrypt access token',
            };
          }

          const authHeader = createAuthHeader(accessToken);
          const headers = { Authorization: authHeader };

          // Fetch account details
          const accountsRes = await tellerFetch(`${TELLER_API_URL}/accounts`, { headers });
          if (!accountsRes.ok) {
            return {
              account_id: connectedAccount.account_id,
              success: false,
              error: 'Failed to fetch account from Teller',
            };
          }

          const accounts = await accountsRes.json();
          const account = accounts.find((acc: any) => acc.id === connectedAccount.account_id);
          if (!account) {
            return {
              account_id: connectedAccount.account_id,
              success: false,
              error: 'Account not found in Teller',
            };
          }

          // Fetch balances
          let balances = null;
          try {
            const balanceRes = await tellerFetch(
              `${TELLER_API_URL}/accounts/${account.id}/balances`,
              { headers }
            );
            if (balanceRes.ok) {
              balances = await balanceRes.json();
            }
          } catch {
            // Balances optional, continue
          }

          const accountWithBalances = { ...account, balances };

          // Determine start date (merge mode: last_synced_at - SYNC_OVERLAP_DAYS)
          const endDate = new Date().toISOString().split('T')[0];
          let startDate: string;
          if (connectedAccount.last_synced_at) {
            const lastSynced = new Date(connectedAccount.last_synced_at);
            lastSynced.setDate(lastSynced.getDate() - SYNC_OVERLAP_DAYS);
            startDate = lastSynced.toISOString().split('T')[0];
          } else {
            // Fallback: last 12 months
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
            startDate = twelveMonthsAgo.toISOString().split('T')[0];
          }

          // Fetch new transactions
          const txnRes = await tellerFetch(
            `${TELLER_API_URL}/accounts/${account.id}/transactions?start_date=${startDate}&end_date=${endDate}`,
            { headers }
          );

          if (!txnRes.ok) {
            return {
              account_id: connectedAccount.account_id,
              success: false,
              error: 'Failed to fetch transactions',
            };
          }

          const newTransactions = await txnRes.json();

          // Get existing report
          const { data: existingReport } = await supabaseAdmin
            .from('pnl_reports')
            .select('id, report_token, raw_teller_data, manual_assignments')
            .eq('user_id', user.id)
            .eq('account_id', account.id)
            .single();

          if (!existingReport) {
            return {
              account_id: connectedAccount.account_id,
              success: false,
              error: 'Report not found',
            };
          }

          // Merge transactions with existing data
          const existingData = existingReport.raw_teller_data as any;
          const existingTransactions = existingData.transactions || [];

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

          // Prepare merged raw data
          const mergedRawData = {
            ...existingData,
            accounts: [accountWithBalances],
            transactions: mergedTransactions,
            fetched_at: new Date().toISOString(),
            date_range: {
              start: existingData.date_range?.start || startDate,
              end: endDate,
            },
            provider: 'teller' as const,
          };

          // Preserve manual assignments
          const finalManualAssignments = existingReport.manual_assignments || {};

          // Calculate PNL report with merged data
          const pnlReport = calculatePNLReport(mergedRawData, finalManualAssignments);

          // Update report
          const reportData = {
            raw_teller_data: mergedRawData,
            pnl_data: pnlReport,
            manual_assignments: finalManualAssignments,
            status: 'completed',
            updated_at: new Date().toISOString(),
          };

          const { data: updatedReport, error: updateError } = await supabaseAdmin
            .from('pnl_reports')
            .update(reportData)
            .eq('id', existingReport.id)
            .select('report_token')
            .single();

          if (updateError) {
            throw updateError;
          }

          // Update connected_accounts: set last_refresh_attempt and last_synced_at
          const { error: accountUpdateError } = await supabaseAdmin
            .from('connected_accounts')
            .update({
              last_refresh_attempt: new Date().toISOString(),
              last_synced_at: new Date().toISOString(),
              needs_refresh: false, // Clear refresh flag
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('account_id', account.id);

          if (accountUpdateError) {
            console.error('Error updating connected account:', accountUpdateError);
          }

          console.log(`Refreshed account ${account.id}: ${existingTransactions.length} existing + ${newTransactions.length} new = ${mergedTransactions.length} total transactions`);

          return {
            account_id: connectedAccount.account_id,
            report_token: updatedReport.report_token,
            success: true,
            transactions_merged: mergedTransactions.length,
            new_transactions: newTransactions.length,
          };
        } catch (error: any) {
          console.error(`Error refreshing account ${connectedAccount.account_id}:`, error);
          return {
            account_id: connectedAccount.account_id,
            success: false,
            error: error.message || 'Failed to refresh account',
          };
        }
      })
    );

    const successCount = refreshResults.filter(r => r.success).length;

    return NextResponse.json({
      success: successCount > 0,
      refreshed: successCount,
      total: accountsToRefresh.length,
      results: refreshResults,
    });
  } catch (error: any) {
    console.error('Error refreshing PNL data:', error);
    return NextResponse.json(
      { error: 'Failed to refresh PNL data', details: error?.message },
      { status: 500 }
    );
  }
}
