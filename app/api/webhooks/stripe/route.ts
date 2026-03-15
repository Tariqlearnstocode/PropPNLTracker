import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { supabaseAdmin } from '@/utils/supabase/admin';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe!.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    return;
  }

  // Get customer ID
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;

  // Determine plan tier from price metadata
  const recurringItem = subscription.items.data[0]; // Only recurring price now

  const planTier =
    recurringItem?.price.metadata?.type === 'monthly'
      ? 'monthly'
      : subscription.metadata?.plan_tier || 'monthly';

  // TODO: current_period_start/end exist at runtime but not in this Stripe types version
  const subRecord = subscription as unknown as Record<string, number>;

  // Upsert subscription in database
  // TODO: Replace casts with generated Supabase types for stripe_subscriptions table
  await supabaseAdmin.from('stripe_subscriptions' as unknown as 'stripe_subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    stripe_price_id: recurringItem?.price.id || '',
    stripe_usage_price_id: null, // No usage price anymore
    status: subscription.status,
    plan_tier: planTier,
    current_period_start: new Date(
      subRecord.current_period_start * 1000
    ).toISOString(),
    current_period_end: new Date(
      subRecord.current_period_end * 1000
    ).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  } as unknown as Record<string, unknown>);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    return;
  }

  // Update subscription status to canceled
  // TODO: Replace casts with generated Supabase types for stripe_subscriptions table
  await supabaseAdmin
    .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    } as unknown as Record<string, unknown>)
    .eq('stripe_subscription_id', subscription.id);
}


async function handlePaymentSucceeded(_invoice: Stripe.Invoice) {
  // Payment succeeded - subscription is active
  // This is handled by subscription.updated event
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // TODO: invoice.subscription exists at runtime but types differ across Stripe versions
  const invoiceRecord = invoice as unknown as Record<string, unknown>;
  const sub = invoiceRecord.subscription;
  const subscriptionId =
    typeof sub === 'string'
      ? sub
      : (sub as { id?: string } | null)?.id;

  if (subscriptionId) {
    // Update subscription status to past_due
    // TODO: Replace casts with generated Supabase types for stripe_subscriptions table
    await supabaseAdmin
      .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      } as unknown as Record<string, unknown>)
      .eq('stripe_subscription_id', subscriptionId);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  if (!userId) {
    return;
  }

  // Get customer ID from session
  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id;

  // Save customer mapping (if not already saved)
  if (customerId) {
    await supabaseAdmin
      .from('stripe_customers')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
      } as unknown as Record<string, unknown>);
  }

  // Handle subscription checkouts (monthly) - handled by subscription webhooks
  if (session.mode === 'subscription') {
    return;
  }

  // Handle one-time payment checkouts (one_time and lifetime)
  if (session.mode === 'payment') {
    const planTier = session.metadata?.plan_tier;

    // Get payment intent ID if available
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;

    if (planTier === 'lifetime') {
      // Grant permanent lifetime access by inserting into stripe_subscriptions with status 'lifetime'
      // TODO: Replace casts with generated Supabase types for stripe_subscriptions table
      await supabaseAdmin
        .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
        .upsert({
          user_id: userId,
          stripe_subscription_id: `lifetime_${session.id}`,
          stripe_customer_id: customerId || '',
          stripe_price_id: '',
          stripe_usage_price_id: null,
          status: 'lifetime',
          plan_tier: 'lifetime',
          current_period_start: new Date().toISOString(),
          current_period_end: null,
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        } as unknown as Record<string, unknown>);
    } else if (planTier === 'one_time') {
      // One-time payment - grant single-use access
      // TODO: Replace casts with generated Supabase types for stripe_subscriptions table
      await supabaseAdmin
        .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
        .insert({
          user_id: userId,
          stripe_subscription_id: `one_time_${session.id}`,
          stripe_customer_id: customerId || '',
          stripe_price_id: '',
          stripe_usage_price_id: null,
          status: 'one_time',
          plan_tier: 'one_time',
          current_period_start: new Date().toISOString(),
          current_period_end: null,
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        } as unknown as Record<string, unknown>);
    }
  }
}
