import { stripe, isStripeConfigured } from './client';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import Stripe from 'stripe';

/**
 * Get or create a Stripe customer for a user
 * Checks stripe_customers table first, then creates new customer in Stripe + DB
 */
export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string | null) {
  if (!isStripeConfigured() || !stripe) {
    return null;
  }

  // Check stripe_customers table first
  const { data: existing } = await supabaseAdmin
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle() as { data: { stripe_customer_id: string } | null; error: Error | null };

  if (existing?.stripe_customer_id) {
    // Verify customer still exists in Stripe
    try {
      const customer = await stripe!.customers.retrieve(existing.stripe_customer_id);
      if (!customer.deleted) {
        return existing.stripe_customer_id;
      }
    } catch {
      // Customer deleted from Stripe, remove stale record and create new one
      await supabaseAdmin.from('stripe_customers').delete().eq('user_id', userId);
    }
  }

  // Create new Stripe customer
  const customerData: Stripe.CustomerCreateParams = {
    email,
    metadata: { user_id: userId },
  };
  if (name) {
    customerData.name = name;
  }

  const customer = await stripe!.customers.create(customerData);

  // Save to stripe_customers table
  await supabaseAdmin
    .from('stripe_customers')
    .upsert({
      user_id: userId,
      stripe_customer_id: customer.id,
    } as unknown as Record<string, unknown>);

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

