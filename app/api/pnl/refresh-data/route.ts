import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { refreshAccountData } from '@/lib/teller-refresh';
import { z } from 'zod';

/**
 * Check if user already refreshed today
 */
function hasRefreshedToday(lastRefreshAttempt: string | null): boolean {
  if (!lastRefreshAttempt) return false;

  const lastRefresh = new Date(lastRefreshAttempt);
  const now = new Date();

  return (
    lastRefresh.getUTCFullYear() === now.getUTCFullYear() &&
    lastRefresh.getUTCMonth() === now.getUTCMonth() &&
    lastRefresh.getUTCDate() === now.getUTCDate()
  );
}

/**
 * POST /api/pnl/refresh-data
 *
 * Manual daily refresh endpoint for subscription users.
 * Rate limited to once per day per account.
 */
const refreshBodySchema = z.object({
  account_id: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: z.infer<typeof refreshBodySchema>;
    try {
      body = refreshBodySchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request body', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const { account_id } = body;

    // Get connected accounts for this user that can refresh daily
    const { data: connectedAccounts, error: accountsError } = await supabaseAdmin
      .from('connected_accounts')
      .select('account_id, encrypted_access_token, last_refresh_attempt, last_synced_at, can_refresh_daily')
      .eq('user_id', user.id)
      .eq('can_refresh_daily', true);

    if (accountsError) {
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
    }

    // Filter out accounts without stored tokens (connected before token storage was added)
    const accountsWithTokens = accountsToRefresh.filter(a => a.encrypted_access_token);
    if (accountsWithTokens.length === 0) {
      return NextResponse.json(
        { error: 'No stored access tokens. Please reconnect your bank account to enable refresh.' },
        { status: 400 }
      );
    }

    const refreshResults = await Promise.all(
      accountsWithTokens.map(async (connectedAccount) => {
        try {
          return await refreshAccountData({
            userId: user.id,
            accountId: connectedAccount.account_id,
            encryptedAccessToken: connectedAccount.encrypted_access_token!,
            lastSyncedAt: connectedAccount.last_synced_at,
          });
        } catch (error: unknown) {
          return {
            account_id: connectedAccount.account_id,
            success: false,
            error: error instanceof Error ? error.message : 'Failed to refresh account',
          };
        }
      })
    );

    const successCount = refreshResults.filter(r => r.success).length;

    return NextResponse.json({
      success: successCount > 0,
      refreshed: successCount,
      total: accountsWithTokens.length,
      results: refreshResults,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to refresh PNL data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
