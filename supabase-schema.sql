create table if not exists public.cici_app_state (
  family_code text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.cici_app_state enable row level security;

drop policy if exists "cici_app_state_read" on public.cici_app_state;
drop policy if exists "cici_app_state_insert" on public.cici_app_state;
drop policy if exists "cici_app_state_update" on public.cici_app_state;

create policy "cici_app_state_read"
on public.cici_app_state
for select
to anon
using (true);

create policy "cici_app_state_insert"
on public.cici_app_state
for insert
to anon
with check (true);

create policy "cici_app_state_update"
on public.cici_app_state
for update
to anon
using (true)
with check (true);
