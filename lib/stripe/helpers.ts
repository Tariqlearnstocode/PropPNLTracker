import { stripe, isStripeConfigured } from './client';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { getMeterId } from './meter';
import Stripe from 'stripe';

/**
 * Get or create a Stripe customer for a user
 * Checks subscription table first, then users table, then creates new customer
 */
export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string | null) {
  // If Stripe is not configured, return null
  if (!isStripeConfigured() || !stripe) {
    return null;
  }

  const supabase = await createClient();

  // First, check if user has a subscription (subscription table is source of truth)
  const { data: subscription } = await supabase
    // TODO: Replace cast with generated Supabase types for stripe_subscriptions table
    .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() as { data: { stripe_customer_id: string } | null; error: Error | null };

  if (subscription?.stripe_customer_id) {
    // Verify customer still exists in Stripe
    try {
      const customer = await stripe!.customers.retrieve(
        subscription.stripe_customer_id
      );
      if (!customer.deleted) {
        return subscription.stripe_customer_id;
      }
    } catch {
      // Customer doesn't exist in Stripe, will create new one below
    }
  }

  // Fallback: Check users table for stripe_customer_id (for pay-as-you-go users)
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    // TODO: Replace cast with generated Supabase types for users table
    .maybeSingle() as { data: { stripe_customer_id: string | null } | null; error: { code: string; message: string } | null };

  if (userError && userError.code !== 'PGRST116') {
    // PGRST116 is "no rows returned" which is expected
  }

  if (user?.stripe_customer_id) {
    // Verify customer still exists in Stripe
    try {
      const customer = await stripe!.customers.retrieve(
        user.stripe_customer_id
      );
      if (!customer.deleted) {
        return user.stripe_customer_id;
      }
    } catch {
      // Customer doesn't exist in Stripe, create new one
    }
  }

  // No existing customer found - create new one
  const customerData: Stripe.CustomerCreateParams = {
    email,
    metadata: {
      user_id: userId,
    },
  };

  // Add name if provided
  if (name) {
    customerData.name = name;
  }

  const customer = await stripe!.customers.create(customerData);

  // Store in database (users table)
  // Use admin client to bypass RLS for updating stripe_customer_id
  const { error: updateError } = await supabaseAdmin
    .from('users')
    // TODO: Replace cast with generated Supabase types
    .update({ stripe_customer_id: customer.id } as unknown as Record<string, unknown>)
    .eq('id', userId);

  if (updateError) {
    throw new Error(`Failed to save Stripe customer to database: ${updateError.message}`);
  }

  return customer.id;
}

/**
 * Get user's active subscription
 */
export async function getActiveSubscription(userId: string) {
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from('stripe_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    // TODO: Replace cast with generated Supabase types for stripe_subscriptions table
    .single() as { data: Record<string, unknown> | null };

  return subscription;
}

/**
 * Get current period usage count from meter
 * Returns the number of verifications used in the current billing period
 */
export async function getCurrentPeriodUsage(
  userId: string,
  subscriptionId: string
): Promise<number> {
  try {
    const supabase = await createClient();
    const meterId = await getMeterId();

    // Get subscription from database (has period dates synced from Stripe webhooks)
    const { data: dbSubscription } = await supabase
      // TODO: Replace cast with generated Supabase types for stripe_subscriptions table
      .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
      .select('current_period_start, current_period_end')
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', userId)
      .single() as { data: { current_period_start: string | null; current_period_end: string | null } | null };

    let periodStart: Date;
    let periodEnd: Date;

    // Use database dates if available (preferred - more reliable)
    if (dbSubscription?.current_period_start && dbSubscription?.current_period_end) {
      periodStart = new Date(dbSubscription.current_period_start);
      periodEnd = new Date(dbSubscription.current_period_end);
    } else {
      // Fallback: fetch from Stripe API if database doesn't have dates
      if (!stripe) {
        return 0;
      }
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      // TODO: current_period_start/end exist at runtime but not in this Stripe types version
      const subRecord = stripeSubscription as unknown as Record<string, number>;
      const periodStartTimestamp = subRecord.current_period_start;
      const periodEndTimestamp = subRecord.current_period_end;

      if (!periodStartTimestamp || !periodEndTimestamp) {
        return 0;
      }

      periodStart = new Date(periodStartTimestamp * 1000);
      periodEnd = new Date(periodEndTimestamp * 1000);
    }

    // Validate dates are valid
    if (isNaN(periodStart.getTime()) || isNaN(periodEnd.getTime())) {
      return 0;
    }

    // Query meter events for this user in current period
    const { data: events } = await supabase
      // TODO: Replace cast with generated Supabase types for meter_events table
      .from('meter_events' as unknown as 'meter_events')
      .select('value')
      .eq('user_id', userId)
      .eq('meter_id', meterId)
      .gte('created_at', periodStart.toISOString())
      .lt('created_at', periodEnd.toISOString()) as { data: Array<{ value: number | null }> | null };

    // Sum up the values
    const totalUsage = events?.reduce((sum, event) => sum + (event.value || 0), 0) || 0;

    return totalUsage;
  } catch {
    // Fallback: return 0 if we can't get usage (allows verification)
    return 0;
  }
}
