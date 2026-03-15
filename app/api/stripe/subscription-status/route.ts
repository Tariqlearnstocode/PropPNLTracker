import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getActiveSubscription, getCurrentPeriodUsage } from '@/lib/stripe/helpers';
import { stripe } from '@/lib/stripe/client';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
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
        canCreateVerification: true,
        limitReached: false,
        requiresPayment: false,
        limit: null,
        currentUsage: 0,
        isLifetime: true,
      });
    }

    // Get active subscription from database (monthly plan)
    const subscription = await getActiveSubscription(user.id);

    if (!subscription) {
      // Check for completed one-time payment
      const { data: availablePayment } = await supabase
        // TODO: Replace cast with generated Supabase types for one_time_payments table
        .from('one_time_payments' as unknown as 'one_time_payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .is('verification_id', null)
        .limit(1)
        .single() as { data: { id: string } | null };

      // Get total verifications created (for display)
      const { count: totalVerifications } = await supabase
        .from('income_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      return NextResponse.json({
        hasSubscription: false,
        plan: 'none',
        status: null,
        canCreateVerification: !!availablePayment,
        requiresPayment: !availablePayment,
        paymentAmount: 3999, // $39.99
        totalVerifications: totalVerifications || 0,
        hasAvailablePayment: !!availablePayment,
      });
    }

    // Get detailed subscription info from Stripe (monthly plan)
    let stripeSubscription: Stripe.Subscription | null = null;
    let currentUsage = 0;

    try {
      stripeSubscription = await stripe!.subscriptions.retrieve(
        subscription.stripe_subscription_id as string
      );

      // Get current period usage from meter
      currentUsage = await getCurrentPeriodUsage(
        user.id,
        subscription.stripe_subscription_id as string
      );
    } catch {
    }

    return NextResponse.json({
      hasSubscription: true,
      plan: subscription.plan_tier || 'monthly',
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canCreateVerification: true,
      limitReached: false,
      requiresPayment: false,
      currentUsage,
      usageInfo: {
        totalUsage: currentUsage,
        periodStart: subscription.current_period_start,
        periodEnd: subscription.current_period_end,
      },
      stripeSubscription: stripeSubscription
        ? {
            id: stripeSubscription.id,
            status: stripeSubscription.status,
            // TODO: current_period_start/end exist at runtime but not in this Stripe types version
            current_period_start: (stripeSubscription as unknown as Record<string, number>).current_period_start,
            current_period_end: (stripeSubscription as unknown as Record<string, number>).current_period_end,
          }
        : null,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
