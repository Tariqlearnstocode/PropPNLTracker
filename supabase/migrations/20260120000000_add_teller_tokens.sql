-- Add encrypted access token storage for subscription users
-- Enables daily refresh capability for monthly/annual subscribers

-- ============================================
-- UPDATE CONNECTED_ACCOUNTS TABLE
-- ============================================
-- Add fields for token storage and daily refresh tracking
ALTER TABLE connected_accounts
  ADD COLUMN IF NOT EXISTS encrypted_access_token text, -- AES-256-GCM encrypted Teller access token
  ADD COLUMN IF NOT EXISTS token_encrypted_at timestamptz, -- When token was encrypted/stored
  ADD COLUMN IF NOT EXISTS last_refresh_attempt timestamptz, -- Track daily refresh rate limiting
  ADD COLUMN IF NOT EXISTS can_refresh_daily boolean DEFAULT false; -- Whether user can use daily refresh (subscription users only)

-- Create index for daily refresh queries
CREATE INDEX IF NOT EXISTS connected_accounts_refresh_check_idx 
  ON connected_accounts(user_id, last_refresh_attempt) 
  WHERE can_refresh_daily = true;

-- Note: encrypted_access_token should only be accessible via service role (admin operations)
-- RLS policies already prevent users from accessing sensitive data
-- The token is encrypted at rest using AES-256-GCM
