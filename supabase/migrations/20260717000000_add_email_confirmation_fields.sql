-- Migration: Add email confirmation tracking fields to orders
-- Safe: ADD COLUMN IF NOT EXISTS, no data loss

alter table orders add column if not exists confirmation_email_sent_at timestamptz;
alter table orders add column if not exists confirmation_email_id text;
alter table orders add column if not exists confirmation_email_error text;
