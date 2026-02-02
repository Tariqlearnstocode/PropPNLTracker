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

    const { reportId, displayName } = await request.json();

    if (!reportId) {
      return NextResponse.json({ error: 'reportId is required' }, { status: 400 });
    }

    // Verify ownership
    const { data: report } = await supabaseAdmin
      .from('pnl_reports')
      .select('id, user_id')
      .eq('id', reportId)
      .single();

    if (!report || report.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Update display name (allow empty string to clear)
    const { error: updateError } = await supabaseAdmin
      .from('pnl_reports')
      .update({ display_name: displayName?.trim() || null })
      .eq('id', reportId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
