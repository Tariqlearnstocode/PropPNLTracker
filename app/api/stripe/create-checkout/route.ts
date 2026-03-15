import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { stripe, isStripeConfigured } from '@/lib/stripe/client';
import { getOrCreateStripeCustomer } from '@/lib/stripe/helpers';
import { validatePriceIds } from '@/lib/stripe/prices';
import { z } from 'zod';

const checkoutSchema = z.object({
  plan: z.enum(['starter', 'pro']),
});

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set up Stripe to use this feature.' },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: z.infer<typeof checkoutSchema>;
    try {
      body = checkoutSchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request body', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const { plan } = body;

    const prices = validatePriceIds();

    // Get or create Stripe customer (include name from user metadata)
    const name = user.user_metadata?.name || null;
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email || '',
      name
    );

    if (!customerId) {
      return NextResponse.json(
        { error: 'Failed to create or retrieve Stripe customer' },
        { status: 500 }
      );
    }

    // Determine recurring price based on plan
    const recurringPriceId =
      plan === 'starter'
        ? prices.starterRecurring!
        : prices.proRecurring!;

    // Create checkout session (only recurring price, no usage price)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: recurringPriceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_tier: plan,
        },
      },
      allow_promotion_codes: true,
      success_url: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/settings?tab=subscription&success=true`,
      cancel_url: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/settings?tab=subscription&canceled=true`,
      metadata: {
        user_id: user.id,
        plan_tier: plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
