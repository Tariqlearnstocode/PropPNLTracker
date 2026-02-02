-- One report per user: enforce single report row per user_id
-- account_id on pnl_reports is already nullable; report is identified by user_id only

CREATE UNIQUE INDEX IF NOT EXISTS pnl_reports_user_id_key ON pnl_reports(user_id);
