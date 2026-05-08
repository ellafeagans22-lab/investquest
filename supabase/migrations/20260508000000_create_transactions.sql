create table if not exists transactions (
  id               uuid primary key default gen_random_uuid(),
  user_id          text not null,
  ticker           text not null,
  action           text not null check (action in ('buy', 'sell')),
  shares           numeric not null,
  price_per_share  numeric not null,
  total_value      numeric not null,
  created_at       timestamptz not null default now()
);
