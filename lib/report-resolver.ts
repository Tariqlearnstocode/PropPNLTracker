import type { SupabaseClient } from '@supabase/supabase-js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolve a report by share slug or report token (for public share URLs).
 * Tries share_slug first, then report_token if the param looks like a UUID.
 */
export async function getReportBySlugOrToken(
  supabase: SupabaseClient,
  slugOrToken: string
): Promise<{ id: string; report_token: string; share_slug: string | null; [key: string]: unknown } | null> {
  const bySlug = await supabase
    .from('pnl_reports')
    .select('*')
    .eq('share_slug', slugOrToken)
    .maybeSingle();

  if (bySlug.data) return bySlug.data as { id: string; report_token: string; share_slug: string | null; [key: string]: unknown };

  if (UUID_REGEX.test(slugOrToken)) {
    const byToken = await supabase
      .from('pnl_reports')
      .select('*')
      .eq('report_token', slugOrToken)
      .maybeSingle();
    if (byToken.data) return byToken.data as { id: string; report_token: string; share_slug: string | null; [key: string]: unknown };
  }

  return null;
}
