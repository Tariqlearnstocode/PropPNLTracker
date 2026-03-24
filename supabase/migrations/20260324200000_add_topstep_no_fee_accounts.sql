-- Add Topstep "No Activation Fee" accounts
-- These are the same Trading Combine but with no activation fee path
-- Higher monthly price, but $0 activation fee when funded
-- Best for traders who can pass in 1-2 attempts

INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost,
  profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size,
  profit_split, min_days_to_pass, min_days_for_payout,
  news_trading, consistency_rule, algorithmic_trading, scalping_rules,
  sort_order, last_verified
) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM public.firms WHERE slug = 'topstep'),
  'Trading Combine (No Fee)', 'evaluation', 50000, '$50,000',
  109, 0, 109,
  3000, 2000, 'Trailing', 1000, '5 minis',
  '90/10', 2, 5,
  'Allowed', 'Best day cannot exceed 50% of profit target', 'Allowed', 'Not allowed (50%+ of winners must be 20+ seconds)',
  10, NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM public.firms WHERE slug = 'topstep'),
  'Trading Combine (No Fee)', 'evaluation', 100000, '$100,000',
  159, 0, 159,
  6000, 3000, 'Trailing', 2000, '10 minis',
  '90/10', 2, 5,
  'Allowed', 'Best day cannot exceed 50% of profit target', 'Allowed', 'Not allowed (50%+ of winners must be 20+ seconds)',
  11, NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM public.firms WHERE slug = 'topstep'),
  'Trading Combine (No Fee)', 'evaluation', 150000, '$150,000',
  209, 0, 209,
  9000, 4500, 'Trailing', 3000, '15 minis',
  '90/10', 2, 5,
  'Allowed', 'Best day cannot exceed 50% of profit target', 'Allowed', 'Not allowed (50%+ of winners must be 20+ seconds)',
  12, NOW()
);
