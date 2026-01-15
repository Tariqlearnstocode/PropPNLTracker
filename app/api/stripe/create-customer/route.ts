import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { isStripeConfigured } from '@/lib/stripe/client';
import { getOrCreateStripeCustomer } from '@/lib/stripe/helpers';

export async function POST(request: NextRequest) {
  try {
    // If Stripe is not configured, return success (no-op)
    if (!isStripeConfigured()) {
      console.log('Stripe not configured, skipping customer creation');
      return NextResponse.json({ 
        customerId: null,
        message: 'Stripe not configured' 
      });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, email } = body;

    // Verify the userId matches the authenticated user
    if (userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get user's name from metadata
    const name = user.user_metadata?.name || null;

    // Get or create Stripe customer (with name if available)
    const customerId = await getOrCreateStripeCustomer(userId, email, name);

    return NextResponse.json({ customerId });
  } catch (error: any) {
    console.error('Error creating Stripe customer:', error);
    // Return success even on error - don't block signup
    return NextResponse.json({ 
      customerId: null,
      error: 'Stripe customer creation failed',
      details: error.message 
    });
  }
}
