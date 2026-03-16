import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getActiveSubscription } from '@/lib/stripe/helpers';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for lifetime access first (stored in stripe_subscriptions with status 'lifetime')
    const { data: lifetimeRecord } = await supabase
      // TODO: Replace cast with generated Supabase types for stripe_subscriptions table
      .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'lifetime')
      .limit(1)
      .single() as { data: Record<string, unknown> | null };

    if (lifetimeRecord) {
      return NextResponse.json({
        hasSubscription: true,
        plan: 'lifetime',
        status: 'lifetime',
        isLifetime: true,
      });
    }

    // Check for one-time payment access (stored in stripe_subscriptions with status 'one_time')
    const { data: oneTimeRecord } = await supabase
      .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'one_time')
      .limit(1)
      .single() as { data: Record<string, unknown> | null };

    if (oneTimeRecord) {
      return NextResponse.json({
        hasSubscription: true,
        plan: 'one_time',
        status: 'one_time',
      });
    }

    // Get active subscription from database (monthly plan)
    const subscription = await getActiveSubscription(user.id);

    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        plan: 'none',
        status: null,
      });
    }

    return NextResponse.json({
      hasSubscription: true,
      plan: subscription.plan_tier || 'monthly',
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
