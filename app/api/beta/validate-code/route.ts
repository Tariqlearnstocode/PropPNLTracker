import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: z.infer<typeof schema>;
    try {
      body = schema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request body', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const code = body.code.trim().toUpperCase();

    // Check if user already has beta access
    const { data: existingRedemption } = await supabaseAdmin
      .from('beta_redemptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingRedemption) {
      return NextResponse.json({ success: true, message: 'Already redeemed' });
    }

    // Look up the code
    const { data: betaCode, error: lookupError } = await supabaseAdmin
      .from('beta_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle();

    if (lookupError) {
      console.error('Beta code lookup error:', lookupError);
      return NextResponse.json({ error: 'Failed to validate code' }, { status: 500 });
    }

    if (!betaCode) {
      return NextResponse.json({ error: 'Invalid beta code' }, { status: 400 });
    }

    // Check usage limit
    if (betaCode.times_used >= betaCode.max_uses) {
      return NextResponse.json({ error: 'This code has reached its usage limit' }, { status: 400 });
    }

    // Redeem: increment usage + create redemption record
    await supabaseAdmin
      .from('beta_codes')
      .update({ times_used: betaCode.times_used + 1 })
      .eq('id', betaCode.id);

    await supabaseAdmin
      .from('beta_redemptions')
      .insert({
        user_id: user.id,
        beta_code_id: betaCode.id,
      });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to validate code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
