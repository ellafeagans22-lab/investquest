create table if not exists portfolio_snapshots (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  total_value numeric not null,
  created_at  timestamptz not null default now()
);
