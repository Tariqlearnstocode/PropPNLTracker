import { createClient } from '@/utils/supabase/server';
import HomePageClient from './HomePageClient';

// Force dynamic rendering - don't cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    // "Auth session missing" is expected when user is logged out - not a real error
    if (!authError.message?.includes('Auth session missing')) {
      console.error('HomePage: Auth error:', authError.message, authError);
    }
  }
  
  // Fetch PNL reports and connected accounts if authenticated
  let pnlReports: any[] = [];
  let connectedAccounts: any[] = [];
  
  if (user) {
    // Fetch PNL reports
    const { data: reportsData, error: reportsError } = await supabase
      .from('pnl_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (reportsError) {
      console.error('HomePage: PNL reports query error:', reportsError.message, reportsError);
    }
    
    pnlReports = reportsData || [];
    
    // Fetch connected accounts
    const { data: accountsData, error: accountsError } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (accountsError) {
      console.error('HomePage: Connected accounts query error:', accountsError.message, accountsError);
    }
    
    connectedAccounts = accountsData || [];
  }
  
  return (
    <HomePageClient 
      initialReports={pnlReports}
      initialConnectedAccounts={connectedAccounts}
    />
  );
}
