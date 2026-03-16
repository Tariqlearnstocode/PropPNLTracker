-- Beta codes table
create table public.beta_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  max_uses integer not null default 1,
  times_used integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Beta redemptions table
create table public.beta_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id),
  beta_code_id uuid not null references public.beta_codes(id),
  redeemed_at timestamptz not null default now()
);

-- Enable RLS
alter table public.beta_codes enable row level security;
alter table public.beta_redemptions enable row level security;

-- beta_codes: allow service role only (no public access needed)
-- beta_redemptions: allow authenticated users to read their own
create policy "Users can read own redemptions"
  on public.beta_redemptions for select
  to authenticated
  using (auth.uid() = user_id);
