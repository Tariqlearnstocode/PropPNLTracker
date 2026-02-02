-- Add display_name column to pnl_reports for public sharing
ALTER TABLE pnl_reports ADD COLUMN IF NOT EXISTS display_name text;
