import { supabaseAdmin } from '@/utils/supabase/admin';
import { calculatePNLReport, type RawFinancialData } from '@/lib/pnl-calculations';
import { decryptToken } from '@/utils/teller-token-encryption';
import https from 'https';

const TELLER_API_URL = 'https://api.teller.io';
const SYNC_OVERLAP_DAYS = 7;

export interface RefreshResult {
  account_id: string;
  success: boolean;
  error?: string;
  report_token?: string;
  transactions_merged?: number;
  new_transactions?: number;
}

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

  if (!cert || !key) {
    return fetch(url, options);
  }

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
 * Refresh a single account's transaction data from Teller,
 * merge with existing report, and recalculate PNL.
 *
 * Used by both the manual refresh endpoint and the Teller webhook handler.
 */
export async function refreshAccountData(params: {
  userId: string;
  accountId: string;
  encryptedAccessToken: string;
  lastSyncedAt: string | null;
}): Promise<RefreshResult> {
  const { userId, accountId, encryptedAccessToken, lastSyncedAt } = params;

  // Decrypt access token
  let accessToken: string;
  try {
    accessToken = decryptToken(encryptedAccessToken);
  } catch {
    return { account_id: accountId, success: false, error: 'Failed to decrypt access token' };
  }

  const authHeader = createAuthHeader(accessToken);
  const headers = { Authorization: authHeader };

  // Fetch account details from Teller
  const accountsRes = await tellerFetch(`${TELLER_API_URL}/accounts`, { headers });
  if (!accountsRes.ok) {
    return { account_id: accountId, success: false, error: 'Failed to fetch account from Teller' };
  }

  const accounts = await accountsRes.json();
  const account = accounts.find((acc: Record<string, unknown>) => acc.id === accountId);
  if (!account) {
    return { account_id: accountId, success: false, error: 'Account not found in Teller' };
  }

  // Fetch balances (optional)
  let balances = null;
  try {
    const balanceRes = await tellerFetch(`${TELLER_API_URL}/accounts/${account.id}/balances`, { headers });
    if (balanceRes.ok) {
      balances = await balanceRes.json();
    }
  } catch {
    // Balances optional
  }

  const accountWithBalances = { ...account, balances };

  // Determine date range
  const endDate = new Date().toISOString().split('T')[0];
  let startDate: string;
  if (lastSyncedAt) {
    const lastSynced = new Date(lastSyncedAt);
    lastSynced.setDate(lastSynced.getDate() - SYNC_OVERLAP_DAYS);
    startDate = lastSynced.toISOString().split('T')[0];
  } else {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    startDate = twelveMonthsAgo.toISOString().split('T')[0];
  }

  // Fetch new transactions
  const txnRes = await tellerFetch(
    `${TELLER_API_URL}/accounts/${account.id}/transactions?start_date=${startDate}&end_date=${endDate}`,
    { headers },
  );
  if (!txnRes.ok) {
    return { account_id: accountId, success: false, error: 'Failed to fetch transactions' };
  }

  const newTransactions = await txnRes.json();

  // Get user's report
  const { data: existingReport } = await supabaseAdmin
    .from('pnl_reports')
    .select('id, report_token, raw_teller_data, manual_assignments')
    .eq('user_id', userId)
    .single();

  if (!existingReport) {
    return { account_id: accountId, success: false, error: 'Report not found' };
  }

  // Merge transactions
  const existingData = existingReport.raw_teller_data as RawFinancialData;
  const existingTransactions = existingData.transactions || [];

  const transactionMap = new Map<string, Record<string, unknown>>();
  existingTransactions.forEach((txn) => transactionMap.set(txn.id as string, txn));
  newTransactions.forEach((txn: Record<string, unknown>) => transactionMap.set(txn.id as string, txn));
  const mergedTransactions = Array.from(transactionMap.values());
  mergedTransactions.sort((a, b) => {
    const dateA = new Date(String(a.date || a.created_at || 0)).getTime();
    const dateB = new Date(String(b.date || b.created_at || 0)).getTime();
    return dateB - dateA;
  });

  // Merge accounts
  const existingAccounts = existingData.accounts || [];
  const accountMap = new Map<string, Record<string, unknown>>();
  existingAccounts.forEach((acc) => accountMap.set(acc.id as string, acc));
  accountMap.set(accountWithBalances.id, accountWithBalances);
  const mergedAccounts = Array.from(accountMap.values());

  const mergedRawData = {
    ...existingData,
    accounts: mergedAccounts,
    transactions: mergedTransactions,
    fetched_at: new Date().toISOString(),
    date_range: {
      start: existingData.date_range?.start || startDate,
      end: endDate,
    },
    provider: 'teller' as const,
  };

  // Recalculate PNL
  const finalManualAssignments = existingReport.manual_assignments || {};
  const pnlReport = calculatePNLReport(mergedRawData, finalManualAssignments);

  // Update report
  const { data: updatedReport, error: updateError } = await supabaseAdmin
    .from('pnl_reports')
    .update({
      raw_teller_data: mergedRawData,
      pnl_data: pnlReport,
      manual_assignments: finalManualAssignments,
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingReport.id)
    .select('report_token')
    .single();

  if (updateError) {
    throw updateError;
  }

  // Update connected_accounts timestamps
  await supabaseAdmin
    .from('connected_accounts')
    .update({
      last_refresh_attempt: new Date().toISOString(),
      last_synced_at: new Date().toISOString(),
      needs_refresh: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('account_id', accountId);

  console.log(`Refreshed account ${accountId}: ${existingTransactions.length} existing + ${newTransactions.length} new = ${mergedTransactions.length} total transactions`);

  return {
    account_id: accountId,
    success: true,
    report_token: updatedReport.report_token,
    transactions_merged: mergedTransactions.length,
    new_transactions: newTransactions.length,
  };
}
