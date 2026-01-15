-- Add manual_assignments column to pnl_reports table
-- Stores user manual assignments of transactions to prop firms

ALTER TABLE pnl_reports 
ADD COLUMN IF NOT EXISTS manual_assignments jsonb DEFAULT '{}'::jsonb;

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS pnl_reports_manual_assignments_idx 
ON pnl_reports USING gin (manual_assignments);

-- Update existing rows to have empty object instead of NULL
UPDATE pnl_reports 
SET manual_assignments = '{}'::jsonb 
WHERE manual_assignments IS NULL;
