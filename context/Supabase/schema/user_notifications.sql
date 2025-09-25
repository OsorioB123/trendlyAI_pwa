-- TrendlyAI Supabase: user notifications support
-- Creates per-user notifications table with RLS + updated_at trigger.

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text,
  title text not null,
  message text not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_user_notifications_user_created_at
  on public.user_notifications (user_id, created_at desc);

create index if not exists idx_user_notifications_unread
  on public.user_notifications (user_id)
  where read_at is null;

-- Ensure the helper function exists (idempotent)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- Recreate trigger safely for environments without IF NOT EXISTS support
drop trigger if exists set_user_notifications_updated_at on public.user_notifications;
create trigger set_user_notifications_updated_at
  before update on public.user_notifications
  for each row
  execute procedure public.update_updated_at_column();

alter table public.user_notifications enable row level security;

-- Replace existing policies with the latest version
set check_function_bodies = off;

drop policy if exists "user_notifications_select_own" on public.user_notifications;
create policy "user_notifications_select_own"
  on public.user_notifications
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_notifications_update_read" on public.user_notifications;
create policy "user_notifications_update_read"
  on public.user_notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

reset check_function_bodies;

-- Inserts/maintenance should be performed via service role or backend routines.
