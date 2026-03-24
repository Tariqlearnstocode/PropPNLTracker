import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { z } from 'zod';
import { calculatePNLReport } from '@/lib/pnl-calculations';

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
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

const assignmentsBodySchema = z.object({
  reportId: z.string().min(1),
  assignments: z.record(z.string(), z.string()),
});

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

    let body: z.infer<typeof assignmentsBodySchema>;
    try {
      body = assignmentsBodySchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request body', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const { reportId, assignments } = body;

    // Fetch report to verify ownership and get raw data for validation
    const { data: report, error: fetchError } = await supabaseAdmin
      .from('pnl_reports')
      .select('id, user_id, raw_teller_data')
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

    // Server-side integrity check: only allow assignments on unmatched
    // transactions that need assignment. Auto-matched transactions are locked.
    if (report.raw_teller_data && Object.keys(assignments).length > 0) {
      const pnl = calculatePNLReport(report.raw_teller_data);
      const editableIds = new Set(
        pnl.transactions
          .filter(t => t.match.type === 'unmatched' && t.match.needsAssignment)
          .map(t => t.id)
      );

      const invalidIds = Object.keys(assignments).filter(id => !editableIds.has(id));
      if (invalidIds.length > 0) {
        return NextResponse.json(
          { error: 'Cannot assign auto-matched transactions' },
          { status: 403 }
        );
      }
    }

    // Update manual assignments
    const { error: updateError } = await supabaseAdmin
      .from('pnl_reports')
      .update({ manual_assignments: assignments })
      .eq('id', reportId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to save assignments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
