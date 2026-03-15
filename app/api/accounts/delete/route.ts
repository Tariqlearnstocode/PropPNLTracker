import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { calculatePNLReport, type RawFinancialData } from '@/lib/pnl-calculations';
import { z } from 'zod';

const deleteAccountSchema = z.object({
  account_id: z.string().min(1),
});

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: z.infer<typeof deleteAccountSchema>;
    try {
      body = deleteAccountSchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request body', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const { account_id } = body;

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

    const { data: report, error: reportError } = await supabase
      .from('pnl_reports')
      .select('id, raw_teller_data, manual_assignments')
      .eq('user_id', user.id)
      .single();

    if (!reportError && report?.raw_teller_data) {
      const raw = report.raw_teller_data as RawFinancialData;
      const transactions = (raw.transactions || []).filter((t) => t.account_id !== account_id);
      const accounts = (raw.accounts || []).filter((a) => a.id !== account_id);
      const manualAssignments = (report.manual_assignments as Record<string, string>) || {};
      const removedTxnIds = new Set((raw.transactions || []).filter((t) => t.account_id === account_id).map((t) => t.id as string));
      const filteredManual = { ...manualAssignments };
      removedTxnIds.forEach((id) => delete filteredManual[id as string]);

      const updatedRaw = {
        ...raw,
        transactions,
        accounts,
        fetched_at: new Date().toISOString(),
      };
      const pnlData = calculatePNLReport(updatedRaw, filteredManual);

      await supabase
        .from('pnl_reports')
        .update({
          raw_teller_data: updatedRaw,
          pnl_data: pnlData,
          manual_assignments: filteredManual,
          updated_at: new Date().toISOString(),
        })
        .eq('id', report.id);
    }

    const { error: deleteError } = await supabase
      .from('connected_accounts')
      .delete()
      .eq('user_id', user.id)
      .eq('account_id', account_id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account and associated data removed successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
