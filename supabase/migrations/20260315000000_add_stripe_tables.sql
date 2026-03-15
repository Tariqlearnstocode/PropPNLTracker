-- ============================================
-- STRIPE CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX stripe_customers_user_id_idx ON stripe_customers(user_id);
CREATE INDEX stripe_customers_stripe_customer_id_idx ON stripe_customers(stripe_customer_id);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customer record" ON stripe_customers
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- STRIPE SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  stripe_price_id text,
  stripe_usage_price_id text,
  status text NOT NULL, -- active, canceled, past_due, lifetime, one_time
  plan_tier text, -- monthly, lifetime, one_time
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX stripe_subscriptions_user_id_idx ON stripe_subscriptions(user_id);
CREATE INDEX stripe_subscriptions_status_idx ON stripe_subscriptions(status);
CREATE INDEX stripe_subscriptions_customer_id_idx ON stripe_subscriptions(stripe_customer_id);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON stripe_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE TRIGGER update_stripe_subscriptions_updated_at
  BEFORE UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
