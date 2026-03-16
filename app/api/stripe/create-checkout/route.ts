import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { stripe, isStripeConfigured } from '@/lib/stripe/client';
import { getOrCreateStripeCustomer } from '@/lib/stripe/helpers';
import { validatePriceIds } from '@/lib/stripe/prices';
import { z } from 'zod';

const checkoutSchema = z.object({
  plan: z.enum(['snapshot', 'lifetime']),
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

    // Map plan to price ID
    const priceIdMap: Record<string, string | undefined> = {
      snapshot: prices.snapshot,
      lifetime: prices.lifetime,
    };

    const priceId = priceIdMap[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: `Price not configured for plan: ${plan}` },
        { status: 500 }
      );
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${origin}/connect?payment=success`;
    const cancelUrl = `${origin}/#pricing`;

    // Both plans are one-time payments
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
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
