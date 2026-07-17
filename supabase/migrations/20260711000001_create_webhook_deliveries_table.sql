-- Migration: Create webhook_deliveries table
-- Run manually: supabase db push or supabase migration up

create table if not exists webhook_deliveries (
  id uuid default gen_random_uuid() primary key,
  delivery_id text unique not null,
  event_type text not null,
  processed_at timestamptz default now() not null
);

-- Index for idempotency check by delivery_id
create index if not exists webhook_deliveries_delivery_id_idx on webhook_deliveries (delivery_id);
