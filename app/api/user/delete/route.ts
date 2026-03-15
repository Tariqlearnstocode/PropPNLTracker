import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { z } from 'zod';

const deleteUserSchema = z.object({
  confirmation: z.literal('DELETE'),
});

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: z.infer<typeof deleteUserSchema>;
    try {
      body = deleteUserSchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Confirmation required. Please type DELETE to confirm.', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    // Delete all reports associated with the user
    const { error: reportsError } = await supabaseAdmin
      .from('pnl_reports')
      .delete()
      .eq('user_id', user.id);

    if (reportsError) {
      // Continue even if reports deletion fails
    }

    // Delete all connected accounts
    const { error: accountsError } = await supabaseAdmin
      .from('connected_accounts')
      .delete()
      .eq('user_id', user.id);

    if (accountsError) {
      // Continue even if accounts deletion fails
    }

    // Delete the user account (this will cascade delete related data via foreign keys)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete user account' },
        { status: 500 }
      );
    }

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
