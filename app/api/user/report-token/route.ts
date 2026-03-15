import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's most recent report token
    const { data: report, error } = await supabase
      .from('pnl_reports')
      .select('report_token')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !report) {
      // User doesn't have a report yet - this is not an error
      return NextResponse.json({ reportToken: null });
    }

    return NextResponse.json({ reportToken: report.report_token });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
