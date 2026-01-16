-- Add Teller webhook support
-- Adds fields to connected_accounts for enrollment tracking and webhook-triggered refreshes
-- Creates table for storing webhook events

-- ============================================
-- UPDATE CONNECTED_ACCOUNTS TABLE
-- ============================================
-- Add fields for enrollment tracking and webhook-triggered refreshes
ALTER TABLE connected_accounts
  ADD COLUMN IF NOT EXISTS enrollment_id text,
  ADD COLUMN IF NOT EXISTS enrollment_status text DEFAULT 'connected' CHECK (enrollment_status IN ('connected', 'disconnected', 'error')),
  ADD COLUMN IF NOT EXISTS enrollment_disconnected_at timestamptz,
  ADD COLUMN IF NOT EXISTS enrollment_disconnect_reason text,
  ADD COLUMN IF NOT EXISTS needs_refresh boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_webhook_at timestamptz;

-- Create index for enrollment_id lookups
CREATE INDEX IF NOT EXISTS connected_accounts_enrollment_id_idx ON connected_accounts(enrollment_id);
CREATE INDEX IF NOT EXISTS connected_accounts_needs_refresh_idx ON connected_accounts(needs_refresh) WHERE needs_refresh = true;

-- ============================================
-- TELLER WEBHOOK EVENTS TABLE
-- ============================================
-- Stores webhook events from Teller for audit/debugging
CREATE TABLE IF NOT EXISTS teller_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, -- transactions.processed, enrollment.disconnected, etc.
  event_id text, -- Teller's event ID
  account_id text,
  enrollment_id text,
  user_id uuid REFERENCES auth.users,
  payload jsonb NOT NULL, -- Full webhook payload
  processed boolean DEFAULT false, -- Whether we've fully processed this event
  error_message text, -- If processing failed
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX teller_webhook_events_event_type_idx ON teller_webhook_events(event_type);
CREATE INDEX teller_webhook_events_account_id_idx ON teller_webhook_events(account_id);
CREATE INDEX teller_webhook_events_enrollment_id_idx ON teller_webhook_events(enrollment_id);
CREATE INDEX teller_webhook_events_user_id_idx ON teller_webhook_events(user_id);
CREATE INDEX teller_webhook_events_processed_idx ON teller_webhook_events(processed) WHERE processed = false;
CREATE INDEX teller_webhook_events_created_at_idx ON teller_webhook_events(created_at);

-- RLS for webhook events (admin only, no user access needed)
ALTER TABLE teller_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access webhook events
CREATE POLICY "Service role only for webhook events" ON teller_webhook_events
  FOR ALL USING (false); -- Block all access via RLS, use service role
