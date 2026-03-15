import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { z } from 'zod';

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$/;

const shareSlugSchema = z.object({
  reportId: z.string().min(1),
  shareSlug: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: z.infer<typeof shareSlugSchema>;
    try {
      body = shareSlugSchema.parse(await request.json());
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid request body', details: (err as z.ZodError).errors },
        { status: 400 }
      );
    }

    const { reportId, shareSlug } = body;

    const slug = typeof shareSlug === 'string' ? shareSlug.trim().toLowerCase() : '';

    if (slug && !SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must be 2–50 characters: lowercase letters, numbers, and hyphens only' },
        { status: 400 }
      );
    }

    const { data: report } = await supabaseAdmin
      .from('pnl_reports')
      .select('id, user_id')
      .eq('id', reportId)
      .single();

    if (!report || report.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const value = slug || null;

    if (value) {
      const { data: existing } = await supabaseAdmin
        .from('pnl_reports')
        .select('id')
        .eq('share_slug', value)
        .neq('id', reportId)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ error: 'This link is already taken' }, { status: 409 });
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('pnl_reports')
      .update({ share_slug: value })
      .eq('id', reportId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ success: true, shareSlug: value });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
