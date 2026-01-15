import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { account_id } = await request.json();

    if (!account_id) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Verify the account belongs to the user
    const { data: account, error: accountError } = await supabase
      .from('connected_accounts')
      .select('id, account_id')
      .eq('user_id', user.id)
      .eq('account_id', account_id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: 'Account not found or access denied' },
        { status: 404 }
      );
    }

    // Delete all reports associated with this account
    const { error: reportsError } = await supabase
      .from('pnl_reports')
      .delete()
      .eq('user_id', user.id)
      .eq('account_id', account_id);

    if (reportsError) {
      console.error('Error deleting reports:', reportsError);
      // Continue even if reports deletion fails
    }

    // Delete the connected account
    const { error: deleteError } = await supabase
      .from('connected_accounts')
      .delete()
      .eq('user_id', user.id)
      .eq('account_id', account_id);

    if (deleteError) {
      console.error('Error deleting connected account:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Account and associated reports deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/accounts/delete:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
