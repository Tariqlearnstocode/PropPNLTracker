-- Add leaderboard opt-in flag to pnl_reports
ALTER TABLE pnl_reports
  ADD COLUMN IF NOT EXISTS show_on_leaderboard boolean NOT NULL DEFAULT false;

-- Add public toggle for report sharing
ALTER TABLE pnl_reports
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Index for efficient leaderboard queries
CREATE INDEX IF NOT EXISTS pnl_reports_leaderboard_idx
  ON pnl_reports (show_on_leaderboard)
  WHERE show_on_leaderboard = true AND status = 'completed';
