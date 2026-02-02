-- Custom share link slug (e.g. /share/johns-trading instead of /share/uuid)
ALTER TABLE pnl_reports ADD COLUMN IF NOT EXISTS share_slug text UNIQUE;
CREATE UNIQUE INDEX IF NOT EXISTS pnl_reports_share_slug_idx ON pnl_reports(share_slug) WHERE share_slug IS NOT NULL;
