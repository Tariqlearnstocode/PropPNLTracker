-- Contact form submissions
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now() not null
);

-- No RLS needed — only the admin client writes to this table
alter table contact_submissions enable row level security;

-- No select/insert policies for anon or authenticated roles
-- All access goes through supabaseAdmin in the API route
