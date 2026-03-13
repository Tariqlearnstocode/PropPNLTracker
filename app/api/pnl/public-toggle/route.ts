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

    const { isPublic } = await request.json();

    if (typeof isPublic !== 'boolean') {
      return NextResponse.json({ error: 'isPublic must be a boolean' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('pnl_reports')
      .update({ is_public: isPublic })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error updating public preference:', error);
      return NextResponse.json({ error: 'Failed to update preference' }, { status: 500 });
    }

    return NextResponse.json({ success: true, isPublic });
  } catch (error) {
    console.error('Public toggle error:', error);
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
      .select('id, is_public, share_slug, report_token, display_name')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .single();

    return NextResponse.json({
      reportId: report?.id ?? null,
      isPublic: report?.is_public ?? false,
      shareSlug: report?.share_slug ?? null,
      reportToken: report?.report_token ?? null,
      displayName: report?.display_name ?? null,
    });
  } catch (error) {
    console.error('Public get error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
