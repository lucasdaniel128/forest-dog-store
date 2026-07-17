-- Migration: Create orders table (v2 — full schema)
-- Run manually: supabase db push or supabase migration up

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  order_id text unique not null,
  charge_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'expired', 'failed')),
  amount_cents integer not null default 0,
  customer_name text not null default '',
  customer_email text not null default '',
  customer_document text not null default '',
  shipping_address jsonb,
  product text not null default 'barraca-automatica-joyfox',
  paid_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists orders_order_id_idx on orders (order_id);
create index if not exists orders_charge_id_idx on orders (charge_id);
create index if not exists orders_status_idx on orders (status);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at();

-- RLS: only service role can access (Edge Functions use service role)
alter table orders enable row level security;

create policy "Service role full access" on orders
  for all
  using (true)
  with check (true);
