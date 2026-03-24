-- ============================================================
-- Prop Firm Directory Schema
-- Two tables: firms (company-level) + firm_accounts (per-plan)
-- ============================================================

-- ---------- FIRMS TABLE (company-level data) ----------
create table if not exists public.firms (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  logo_url      text,
  website       text,
  rating        numeric(2,1) check (rating >= 0 and rating <= 5),
  category      text not null check (category in ('futures', 'forex', 'crypto', 'multi')),

  -- Company info
  founders      text,                     -- e.g. "George Kohler & Andrew Blaylock"
  country       text,
  founded_year  smallint,

  -- Allocation limits
  max_funded_accounts   smallint,         -- e.g. 3
  max_funded_allocation text,             -- e.g. "$450,000"

  -- Platforms (array of text)
  platforms     text[] default '{}',      -- e.g. {'NinjaTrader','TradingView','Tradovate'}

  -- Payout info
  payout_methods    text[] default '{}',  -- e.g. {'Rise','ACH','Wise','SWIFT','Wire','Crypto'}
  payout_frequency  text,                 -- e.g. "Every 14 days" or "Every 5 winning days"
  profit_split_note text,                 -- optional note if split varies by plan

  -- Support
  support_email     text,
  support_discord   text,
  support_help_url  text,
  support_live_chat boolean default false,

  -- Firm-wide rules (things that apply to ALL accounts at this firm)
  inactivity_rule       text,             -- e.g. "10 trading days"
  copy_trading          text,             -- e.g. "Allowed", "Not allowed", "Allowed with restrictions"
  max_before_live       text,             -- e.g. "$120,000"
  clear_path_to_live    text,             -- e.g. "5 payouts or $120,000"

  -- Meta
  is_active       boolean default true,
  last_verified   timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ---------- FIRM ACCOUNTS TABLE (per-plan / per-tier data) ----------
create table if not exists public.firm_accounts (
  id            uuid primary key default gen_random_uuid(),
  firm_id       uuid not null references public.firms(id) on delete cascade,

  -- Plan identification
  plan_name     text not null,            -- e.g. "Zero Plan", "Growth Plans", "Rapid Challenge"
  account_type  text not null check (account_type in ('evaluation', 'funded', 'instant', 'direct')),
  size          integer not null,         -- account size in dollars, e.g. 50000, 100000
  size_label    text not null,            -- display label, e.g. "$50,000"

  -- Pricing
  price             numeric(10,2),        -- eval price before discounts
  activation_fee    numeric(10,2) default 0,  -- separate activation fee (for all-in price calc)
  reset_cost        numeric(10,2),

  -- Targets & limits
  profit_target     numeric(10,2),
  max_drawdown      numeric(10,2),
  drawdown_type     text check (drawdown_type in ('EOD', 'Trailing', 'Static', 'Intraday')),
  daily_loss_limit  numeric(10,2),
  max_contract_size text,                 -- e.g. "15 contracts" or null if unlimited

  -- Profit split (account-specific, not firm-level)
  profit_split      text,                 -- e.g. "90/10", "80/20", "Tier System"

  -- Time rules
  min_days_to_pass    smallint,
  min_days_for_payout smallint,

  -- Trading rules (account-specific)
  news_trading        text,               -- "Allowed", "Not allowed", "Restricted"
  consistency_rule    text,               -- e.g. "30% max daily profit", "No single day > 40% of total"
  algorithmic_trading text,               -- "Allowed", "Not allowed", "Allowed with restrictions"
  scalping_rules      text,               -- "Allowed", "Not allowed", details

  -- Display ordering
  sort_order    smallint default 0,

  -- Meta
  is_active     boolean default true,
  last_verified timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),

  -- Prevent duplicate plan+size combos per firm
  unique (firm_id, plan_name, account_type, size)
);

-- ---------- INDEXES ----------
create index idx_firms_slug on public.firms(slug);
create index idx_firms_category on public.firms(category);
create index idx_firms_is_active on public.firms(is_active);
create index idx_firm_accounts_firm_id on public.firm_accounts(firm_id);
create index idx_firm_accounts_size on public.firm_accounts(size);
create index idx_firm_accounts_drawdown_type on public.firm_accounts(drawdown_type);
create index idx_firm_accounts_account_type on public.firm_accounts(account_type);

-- ---------- AUTO-UPDATE updated_at ----------
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger firms_updated_at
  before update on public.firms
  for each row execute function public.update_updated_at();

create trigger firm_accounts_updated_at
  before update on public.firm_accounts
  for each row execute function public.update_updated_at();

-- ---------- RLS ----------
alter table public.firms enable row level security;
alter table public.firm_accounts enable row level security;

-- Public read access (these are directory pages, everyone can see them)
create policy "Firms are publicly readable"
  on public.firms for select
  using (true);

create policy "Firm accounts are publicly readable"
  on public.firm_accounts for select
  using (true);

-- Only service role can insert/update/delete (admin operations)
create policy "Service role can manage firms"
  on public.firms for all
  using (auth.role() = 'service_role');

create policy "Service role can manage firm accounts"
  on public.firm_accounts for all
  using (auth.role() = 'service_role');
