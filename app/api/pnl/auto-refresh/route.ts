import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { getActiveSubscription } from '@/lib/stripe/helpers';

// ============ CONFIGURATION ============
// Auto-refresh frequency - should match the constant in fetch-data/route.ts
// Change this to 'weekly' or 'monthly' as needed
const AUTO_REFRESH_FREQUENCY: 'weekly' | 'monthly' = 'monthly';
// ========================================

/**
 * POST /api/pnl/auto-refresh
 * 
 * Auto-refresh endpoint for subscription users
 * Should be called by a cron job (Vercel Cron, external service, etc.)
 * 
 * IMPORTANT: This endpoint requires access tokens to call Teller API.
 * Options for handling this:
 * 1. Store encrypted access tokens in database (requires secure key management)
 * 2. Use Teller's refresh token mechanism if available
 * 3. Keep Teller connections active for subscription users (don't disconnect)
 * 4. Require users to manually reconnect when auto-refresh is needed
 * 
 * For now, this is a skeleton that identifies users who need refresh.
 * Full implementation will require one of the above access token strategies.
 * 
 * Security: When CRON_SECRET is set, requests must include Authorization: Bearer <CRON_SECRET>.
 */
export async function POST(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Get all users with active subscriptions
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('stripe_subscriptions')
      .select('user_id')
      .eq('status', 'active');

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active subscriptions found',
        refreshed: 0,
      });
    }

    const userIds = subscriptions.map((s: any) => s.user_id);
    console.log(`Found ${userIds.length} users with active subscriptions`);

    // Get connected accounts for these users
    const { data: connectedAccounts, error: accountsError } = await supabaseAdmin
      .from('connected_accounts')
      .select('user_id, account_id, last_synced_at')
      .in('user_id', userIds);

    if (accountsError) {
      console.error('Error fetching connected accounts:', accountsError);
      return NextResponse.json(
        { error: 'Failed to fetch connected accounts' },
        { status: 500 }
      );
    }

    if (!connectedAccounts || connectedAccounts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No connected accounts found',
        refreshed: 0,
      });
    }

    // Determine which accounts need refresh based on frequency
    const now = new Date();
    const refreshThreshold = AUTO_REFRESH_FREQUENCY === 'weekly'
      ? 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      : 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    const accountsNeedingRefresh = connectedAccounts.filter((ca: any) => {
      if (!ca.last_synced_at) return true; // Never synced
      const lastSynced = new Date(ca.last_synced_at).getTime();
      const timeSinceSync = now.getTime() - lastSynced;
      return timeSinceSync >= refreshThreshold;
    });

    console.log(`${accountsNeedingRefresh.length} accounts need refresh`);

    // TODO: Implement actual refresh logic
    // This requires access tokens to call Teller API
    // Options:
    // 1. Store encrypted access tokens in database
    // 2. Use Teller refresh tokens
    // 3. Keep connections active (don't disconnect for subscription users)
    // 4. Send notification to user to reconnect
    
    // For now, return the accounts that need refresh
    return NextResponse.json({
      success: true,
      message: 'Auto-refresh check completed',
      total_subscriptions: userIds.length,
      total_connected_accounts: connectedAccounts.length,
      accounts_needing_refresh: accountsNeedingRefresh.length,
      accounts: accountsNeedingRefresh.map((ca: any) => ({
        user_id: ca.user_id,
        account_id: ca.account_id,
        last_synced_at: ca.last_synced_at,
      })),
      note: 'Full auto-refresh implementation requires access token strategy (see code comments)',
    });
  } catch (error: any) {
    console.error('Error in auto-refresh:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
