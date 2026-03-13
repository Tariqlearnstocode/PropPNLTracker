import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { showOnLeaderboard } = await request.json();

    if (typeof showOnLeaderboard !== 'boolean') {
      return NextResponse.json({ error: 'showOnLeaderboard must be a boolean' }, { status: 400 });
    }

    // Update the user's report
    const { error } = await supabaseAdmin
      .from('pnl_reports')
      .update({ show_on_leaderboard: showOnLeaderboard })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error updating leaderboard preference:', error);
      return NextResponse.json({ error: 'Failed to update preference' }, { status: 500 });
    }

    return NextResponse.json({ success: true, showOnLeaderboard });
  } catch (error) {
    console.error('Leaderboard toggle error:', error);
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
  } catch (error) {
    console.error('Leaderboard get error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
