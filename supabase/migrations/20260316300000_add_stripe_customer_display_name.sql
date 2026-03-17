ALTER TABLE stripe_customers
  ADD COLUMN IF NOT EXISTS display_name text;
