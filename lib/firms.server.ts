// ============================================================
// Prop Firm Supabase Queries (Server-only)
// Only import this from Server Components / Route Handlers
// ============================================================

import { createClient } from '@/utils/supabase/server';
import type { Firm, FirmWithAccounts } from './firms';

/** Fetch all active firms with their active accounts */
export async function getFirmsWithAccounts(): Promise<FirmWithAccounts[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('firms')
    .select(`
      *,
      firm_accounts (*)
    `)
    .eq('is_active', true)
    .eq('firm_accounts.is_active', true)
    .order('rating', { ascending: false })
    .order('sort_order', { referencedTable: 'firm_accounts', ascending: true })
    .order('size', { referencedTable: 'firm_accounts', ascending: true });

  if (error) {
    console.error('Error fetching firms:', error);
    return [];
  }

  return (data as FirmWithAccounts[]) ?? [];
}

/** Fetch a single firm by slug with all accounts */
export async function getFirmBySlug(slug: string): Promise<FirmWithAccounts | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('firms')
    .select(`
      *,
      firm_accounts (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('firm_accounts.is_active', true)
    .order('sort_order', { referencedTable: 'firm_accounts', ascending: true })
    .order('size', { referencedTable: 'firm_accounts', ascending: true })
    .single();

  if (error) {
    console.error('Error fetching firm:', error);
    return null;
  }

  return data as FirmWithAccounts;
}

/** Fetch just the firms (no accounts) for lightweight listings */
export async function getFirms(): Promise<Firm[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('firms')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching firms:', error);
    return [];
  }

  return (data as Firm[]) ?? [];
}
