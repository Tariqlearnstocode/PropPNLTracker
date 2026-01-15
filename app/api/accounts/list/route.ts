import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch connected accounts
    const { data: accounts, error } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching connected accounts:', error);
      return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }

    // Also fetch report tokens for each account
    const accountIds = accounts?.map(acc => acc.account_id) || [];
    const { data: reports } = await supabase
      .from('pnl_reports')
      .select('account_id, report_token, created_at, updated_at')
      .eq('user_id', user.id)
      .in('account_id', accountIds);

    // Combine accounts with their reports
    const accountsWithReports = accounts?.map(account => {
      const accountReports = reports?.filter(r => r.account_id === account.account_id) || [];
      return {
        ...account,
        reports: accountReports,
        reportCount: accountReports.length,
      };
    }) || [];

    return NextResponse.json({ accounts: accountsWithReports });
  } catch (error: any) {
    console.error('Error in GET /api/accounts/list:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
