-- Limits targeted admin in-app notifications.
-- No public user can read or write this table.

create table if not exists public.notification_rate_limit_events (
  id bigint generated always as identity primary key,
  admin_user_id uuid not null,
  created_at timestamptz not null default now()
);

alter table public.notification_rate_limit_events enable row level security;

create index if not exists notification_rate_limit_events_admin_created_idx
  on public.notification_rate_limit_events (
    admin_user_id,
    created_at desc
  );

create or replace function public.consume_admin_notification_rate_limit(
  p_admin_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_notification_count integer;
begin
  select count(*)
  into recent_notification_count
  from public.notification_rate_limit_events
  where admin_user_id = p_admin_user_id
    and created_at >= now() - interval '10 minutes';

  if recent_notification_count >= 10 then
    return false;
  end if;

  insert into public.notification_rate_limit_events (admin_user_id)
  values (p_admin_user_id);

  return true;
end;
$$;

revoke all on function public.consume_admin_notification_rate_limit(uuid)
  from public;

grant execute on function public.consume_admin_notification_rate_limit(uuid)
  to service_role;