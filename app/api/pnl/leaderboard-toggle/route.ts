import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { z } from 'zod';

const leaderboardSchema = z.object({
  showOnLeaderboard: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: z.infer<typeof leaderboardSchema>;
    try {
      body = leaderboardSchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request body', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const { showOnLeaderboard } = body;

    // Update the user's report
    const { error } = await supabaseAdmin
      .from('pnl_reports')
      .update({ show_on_leaderboard: showOnLeaderboard })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (error) {
      return NextResponse.json({ error: 'Failed to update preference' }, { status: 500 });
    }

    return NextResponse.json({ success: true, showOnLeaderboard });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: report } = await supabaseAdmin
      .from('pnl_reports')
      .select('show_on_leaderboard')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .single();

    return NextResponse.json({
      showOnLeaderboard: report?.show_on_leaderboard ?? false,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
