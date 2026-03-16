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

  // Handle one-time payment checkouts (snapshot and lifetime)
  if (session.mode === 'payment') {
    const planTier = session.metadata?.plan_tier;

    if (planTier === 'lifetime') {
      // Grant permanent lifetime access
      // TODO: Replace casts with generated Supabase types for stripe_subscriptions table
      await supabaseAdmin
        .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
        .upsert({
          user_id: userId,
          stripe_subscription_id: `lifetime_${session.id}`,
          stripe_customer_id: customerId || '',
          stripe_price_id: '',
          status: 'lifetime',
          plan_tier: 'lifetime',
          current_period_start: new Date().toISOString(),
          current_period_end: null,
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        } as unknown as Record<string, unknown>);
    } else if (planTier === 'snapshot') {
      // Snapshot payment - grant single-use access
      // TODO: Replace casts with generated Supabase types for stripe_subscriptions table
      await supabaseAdmin
        .from('stripe_subscriptions' as unknown as 'stripe_subscriptions')
        .insert({
          user_id: userId,
          stripe_subscription_id: `snapshot_${session.id}`,
          stripe_customer_id: customerId || '',
          stripe_price_id: '',
          status: 'snapshot',
          plan_tier: 'snapshot',
          current_period_start: new Date().toISOString(),
          current_period_end: null,
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        } as unknown as Record<string, unknown>);
    }
  }
}
