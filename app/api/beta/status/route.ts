import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: redemption } = await supabaseAdmin
      .from('beta_redemptions')
      .select('id, redeemed_at')
      .eq('user_id', user.id)
      .maybeSingle();

    return NextResponse.json({
      hasBetaAccess: !!redemption,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to check beta status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
