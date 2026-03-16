import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserPlan } from '@/lib/stripe/helpers';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await getUserPlan(user.id);

    if (plan === 'lifetime') {
      return NextResponse.json({
        hasSubscription: true,
        plan: 'lifetime',
        status: 'lifetime',
        isLifetime: true,
      });
    }

    if (plan === 'snapshot') {
      return NextResponse.json({
        hasSubscription: true,
        plan: 'snapshot',
        status: 'snapshot',
      });
    }

    return NextResponse.json({
      hasSubscription: false,
      plan: 'none',
      status: null,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
