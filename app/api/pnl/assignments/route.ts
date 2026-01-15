import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

/**
 * GET /api/pnl/assignments?reportId=xxx
 * Get manual assignments for a report
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json(
        { error: 'reportId is required' },
        { status: 400 }
      );
    }

    // Fetch report to verify ownership
    const { data: report, error: fetchError } = await supabaseAdmin
      .from('pnl_reports')
      .select('id, user_id, manual_assignments')
      .eq('id', reportId)
      .single();

    if (fetchError || !report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Verify ownership (RLS should handle this, but double-check)
    if (report.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Return assignments (default to empty object if null)
    const assignments = report.manual_assignments || {};

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pnl/assignments
 * Save manual assignments for a report
 * Body: { reportId: string, assignments: Record<string, string> }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportId, assignments } = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { error: 'reportId is required' },
        { status: 400 }
      );
    }

    if (!assignments || typeof assignments !== 'object') {
      return NextResponse.json(
        { error: 'assignments must be an object' },
        { status: 400 }
      );
    }

    // Fetch report to verify ownership
    const { data: report, error: fetchError } = await supabaseAdmin
      .from('pnl_reports')
      .select('id, user_id')
      .eq('id', reportId)
      .single();

    if (fetchError || !report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Verify ownership (RLS should handle this, but double-check)
    if (report.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update manual assignments
    const { error: updateError } = await supabaseAdmin
      .from('pnl_reports')
      .update({ manual_assignments: assignments })
      .eq('id', reportId);

    if (updateError) {
      console.error('Error updating assignments:', updateError);
      return NextResponse.json(
        { error: 'Failed to save assignments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
