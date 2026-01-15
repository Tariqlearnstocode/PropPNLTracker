-- Prop Firm PNL Tracker Migration
-- Creates new schema for PNL tracking (replaces income_verifications)

-- ============================================
-- PNL REPORTS TABLE
-- ============================================
-- Stores PNL reports for each user's connected bank account
CREATE TABLE IF NOT EXISTS pnl_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  report_token uuid UNIQUE DEFAULT gen_random_uuid(), -- for sharing via link
  account_id text, -- Teller account ID (which bank account this report is for)
  raw_teller_data jsonb, -- raw transaction data from Teller
  pnl_data jsonb, -- calculated PNL (monthly breakdown, per-firm, etc.)
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX pnl_reports_user_id_idx ON pnl_reports(user_id);
CREATE INDEX pnl_reports_report_token_idx ON pnl_reports(report_token);
CREATE INDEX pnl_reports_status_idx ON pnl_reports(status);
CREATE INDEX pnl_reports_account_id_idx ON pnl_reports(account_id);

-- RLS
ALTER TABLE pnl_reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view own pnl reports" ON pnl_reports
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own reports
CREATE POLICY "Users can create own pnl reports" ON pnl_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update own pnl reports" ON pnl_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete own pnl reports" ON pnl_reports
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CONNECTED ACCOUNTS TABLE
-- ============================================
-- Tracks user's connected bank accounts
CREATE TABLE IF NOT EXISTS connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  account_id text NOT NULL, -- Teller account ID
  account_name text,
  account_type text, -- checking, savings, etc.
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, account_id) -- One account per user
);

CREATE INDEX connected_accounts_user_id_idx ON connected_accounts(user_id);
CREATE INDEX connected_accounts_account_id_idx ON connected_accounts(account_id);

-- RLS
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;

-- Users can view their own connected accounts
CREATE POLICY "Users can view own connected accounts" ON connected_accounts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own connected accounts
CREATE POLICY "Users can create own connected accounts" ON connected_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own connected accounts
CREATE POLICY "Users can update own connected accounts" ON connected_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own connected accounts
CREATE POLICY "Users can delete own connected accounts" ON connected_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- UPDATE TRIGGERS
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for pnl_reports
CREATE TRIGGER update_pnl_reports_updated_at
  BEFORE UPDATE ON pnl_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for connected_accounts
CREATE TRIGGER update_connected_accounts_updated_at
  BEFORE UPDATE ON connected_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
