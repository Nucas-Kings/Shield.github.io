-- =====================================================
-- SHIELD SECURITY SERVICES
-- SUPABASE DATABASE SETUP
-- Run this file in the Supabase SQL Editor.
-- =====================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------- TABLES ----------
create table if not exists public.sites (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    address text,
    latitude numeric(10,7),
    longitude numeric(10,7),
    radius_meters integer not null default 200 check (radius_meters >= 25),
    geofence_enabled boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint sites_latitude_check check (latitude is null or (latitude >= -90 and latitude <= 90)),
    constraint sites_longitude_check check (longitude is null or (longitude >= -180 and longitude <= 180)),
    constraint sites_geofence_coords_check check (not geofence_enabled or (latitude is not null and longitude is not null))
);

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    employee_id text not null unique,
    full_name text not null,
    position text not null default 'Security Officer',
    account_type text not null check (account_type in ('admin','employee')),
    default_site_id uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint profiles_default_site_id_fkey foreign key (default_site_id) references public.sites(id) on delete set null
);

create table if not exists public.admin_secrets (
    user_id uuid primary key references public.profiles(id) on delete cascade,
    admin_code_hash text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.schedules (
    id uuid primary key default gen_random_uuid(),
    employee_user_id uuid not null,
    site_id uuid not null,
    shift_date date not null,
    start_time time not null,
    end_time time not null,
    starts_at timestamptz not null,
    ends_at timestamptz not null,
    notes text,
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint schedules_employee_user_id_fkey foreign key (employee_user_id) references public.profiles(id) on delete cascade,
    constraint schedules_site_id_fkey foreign key (site_id) references public.sites(id) on delete restrict,
    constraint schedules_time_order_check check (ends_at > starts_at)
);

create table if not exists public.time_entries (
    id uuid primary key default gen_random_uuid(),
    employee_user_id uuid not null,
    schedule_id uuid not null unique,
    clock_in_at timestamptz not null,
    clock_out_at timestamptz,
    status text not null check (status in ('clocked-in','on-break','completed','auto-clock-out')),
    clock_out_type text check (clock_out_type in ('manual','automatic')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint time_entries_employee_user_id_fkey foreign key (employee_user_id) references public.profiles(id) on delete cascade,
    constraint time_entries_schedule_id_fkey foreign key (schedule_id) references public.schedules(id) on delete cascade,
    constraint time_entries_clock_order_check check (clock_out_at is null or clock_out_at >= clock_in_at)
);

create table if not exists public.breaks (
    id uuid primary key default gen_random_uuid(),
    time_entry_id uuid not null,
    started_at timestamptz not null,
    ended_at timestamptz,
    created_at timestamptz not null default now(),
    constraint breaks_time_entry_id_fkey foreign key (time_entry_id) references public.time_entries(id) on delete cascade,
    constraint breaks_time_order_check check (ended_at is null or ended_at >= started_at)
);

create index if not exists schedules_employee_idx on public.schedules(employee_user_id);
create index if not exists schedules_starts_at_idx on public.schedules(starts_at);
create index if not exists time_entries_employee_idx on public.time_entries(employee_user_id);
create index if not exists time_entries_clock_in_idx on public.time_entries(clock_in_at desc);
create index if not exists breaks_time_entry_idx on public.breaks(time_entry_id);

-- Only one open time entry per employee.
create unique index if not exists one_open_time_entry_per_employee
on public.time_entries(employee_user_id)
where clock_out_at is null;

-- Only one open break per time entry.
create unique index if not exists one_open_break_per_entry
on public.breaks(time_entry_id)
where ended_at is null;

-- ---------- UPDATED_AT TRIGGER ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists sites_set_updated_at on public.sites;
create trigger sites_set_updated_at before update on public.sites for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists schedules_set_updated_at on public.schedules;
create trigger schedules_set_updated_at before update on public.schedules for each row execute function public.set_updated_at();

drop trigger if exists time_entries_set_updated_at on public.time_entries;
create trigger time_entries_set_updated_at before update on public.time_entries for each row execute function public.set_updated_at();

-- ---------- SECURITY HELPERS ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and account_type = 'admin'
    );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.verify_admin_code(p_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles p
        join public.admin_secrets s on s.user_id = p.id
        where p.id = auth.uid()
          and p.account_type = 'admin'
          and s.admin_code_hash = extensions.crypt(p_code, s.admin_code_hash)
    );
$$;

revoke all on function public.verify_admin_code(text) from public;
grant execute on function public.verify_admin_code(text) to authenticated;

-- ---------- ROW LEVEL SECURITY ----------
alter table public.sites enable row level security;
alter table public.profiles enable row level security;
alter table public.admin_secrets enable row level security;
alter table public.schedules enable row level security;
alter table public.time_entries enable row level security;
alter table public.breaks enable row level security;

-- Profiles: employees can read themselves; admins can read all employees.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Sites: every authenticated user may read sites; only admins modify them.
drop policy if exists sites_select on public.sites;
create policy sites_select on public.sites for select to authenticated using (true);

drop policy if exists sites_admin_insert on public.sites;
create policy sites_admin_insert on public.sites for insert to authenticated with check (public.is_admin());

drop policy if exists sites_admin_update on public.sites;
create policy sites_admin_update on public.sites for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists sites_admin_delete on public.sites;
create policy sites_admin_delete on public.sites for delete to authenticated using (public.is_admin());

-- Schedules: employees see only their own; admins manage all.
drop policy if exists schedules_select on public.schedules;
create policy schedules_select on public.schedules for select to authenticated
using (employee_user_id = auth.uid() or public.is_admin());

drop policy if exists schedules_admin_insert on public.schedules;
create policy schedules_admin_insert on public.schedules for insert to authenticated
with check (public.is_admin());

drop policy if exists schedules_admin_update on public.schedules;
create policy schedules_admin_update on public.schedules for update to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists schedules_admin_delete on public.schedules;
create policy schedules_admin_delete on public.schedules for delete to authenticated
using (public.is_admin());

-- Time entries are read-only from the browser. Clock actions go through RPC functions below.
drop policy if exists time_entries_select on public.time_entries;
create policy time_entries_select on public.time_entries for select to authenticated
using (employee_user_id = auth.uid() or public.is_admin());

-- Breaks are read-only from the browser.
drop policy if exists breaks_select on public.breaks;
create policy breaks_select on public.breaks for select to authenticated
using (
    exists (
        select 1 from public.time_entries t
        where t.id = breaks.time_entry_id
          and (t.employee_user_id = auth.uid() or public.is_admin())
    )
);

-- No select policy is intentionally created for admin_secrets.

-- ---------- CLOCK RPC FUNCTIONS ----------
create or replace function public.clock_in(p_schedule_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_user uuid := auth.uid();
    v_schedule public.schedules%rowtype;
    v_entry_id uuid;
begin
    if v_user is null then raise exception 'You must be signed in.'; end if;

    select * into v_schedule
    from public.schedules
    where id = p_schedule_id and employee_user_id = v_user;

    if not found then raise exception 'That shift is not assigned to your account.'; end if;
    if now() > v_schedule.ends_at + interval '30 minutes' then raise exception 'The clock-in window for this shift has closed.'; end if;
    if exists (select 1 from public.time_entries where employee_user_id = v_user and clock_out_at is null) then
        raise exception 'You already have an active time entry.';
    end if;
    if exists (select 1 from public.time_entries where schedule_id = p_schedule_id) then
        raise exception 'A time entry already exists for this shift.';
    end if;

    insert into public.time_entries(employee_user_id, schedule_id, clock_in_at, status)
    values (v_user, p_schedule_id, now(), 'clocked-in')
    returning id into v_entry_id;

    return v_entry_id;
end;
$$;

create or replace function public.start_break(p_time_entry_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_break_id uuid;
begin
    if not exists (
        select 1 from public.time_entries
        where id = p_time_entry_id and employee_user_id = auth.uid() and clock_out_at is null and status = 'clocked-in'
    ) then raise exception 'No clocked-in entry is available to start a break.'; end if;

    if exists (select 1 from public.breaks where time_entry_id = p_time_entry_id and ended_at is null) then
        raise exception 'A break is already active.';
    end if;

    insert into public.breaks(time_entry_id, started_at) values (p_time_entry_id, now()) returning id into v_break_id;
    update public.time_entries set status = 'on-break' where id = p_time_entry_id;
    return v_break_id;
end;
$$;

create or replace function public.end_break(p_time_entry_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    if not exists (
        select 1 from public.time_entries
        where id = p_time_entry_id and employee_user_id = auth.uid() and clock_out_at is null
    ) then raise exception 'No active time entry was found.'; end if;

    update public.breaks
    set ended_at = now()
    where id = (
        select id from public.breaks
        where time_entry_id = p_time_entry_id and ended_at is null
        order by started_at desc limit 1
    );

    if not found then raise exception 'No active break was found.'; end if;
    update public.time_entries set status = 'clocked-in' where id = p_time_entry_id;
    return true;
end;
$$;

create or replace function public.clock_out(p_time_entry_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_entry public.time_entries%rowtype;
    v_deadline timestamptz;
    v_effective timestamptz;
    v_auto boolean;
begin
    select * into v_entry
    from public.time_entries
    where id = p_time_entry_id and employee_user_id = auth.uid() and clock_out_at is null;

    if not found then raise exception 'No active time entry was found.'; end if;

    select ends_at + interval '30 minutes' into v_deadline
    from public.schedules where id = v_entry.schedule_id;

    v_auto := now() >= v_deadline;
    v_effective := case when v_auto then v_deadline else now() end;

    update public.breaks
    set ended_at = v_effective
    where time_entry_id = p_time_entry_id and ended_at is null;

    update public.time_entries
    set clock_out_at = v_effective,
        status = case when v_auto then 'auto-clock-out' else 'completed' end,
        clock_out_type = case when v_auto then 'automatic' else 'manual' end
    where id = p_time_entry_id;

    return true;
end;
$$;

create or replace function public.apply_due_auto_clockouts()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
    r record;
    v_count integer := 0;
begin
    if auth.uid() is null then raise exception 'You must be signed in.'; end if;

    for r in
        select t.id, s.ends_at + interval '30 minutes' as deadline
        from public.time_entries t
        join public.schedules s on s.id = t.schedule_id
        where t.clock_out_at is null
          and now() >= s.ends_at + interval '30 minutes'
    loop
        update public.breaks
        set ended_at = r.deadline
        where time_entry_id = r.id and ended_at is null;

        update public.time_entries
        set clock_out_at = r.deadline,
            status = 'auto-clock-out',
            clock_out_type = 'automatic'
        where id = r.id and clock_out_at is null;

        if found then v_count := v_count + 1; end if;
    end loop;

    return v_count;
end;
$$;

revoke all on function public.clock_in(uuid) from public;
revoke all on function public.start_break(uuid) from public;
revoke all on function public.end_break(uuid) from public;
revoke all on function public.clock_out(uuid) from public;
revoke all on function public.apply_due_auto_clockouts() from public;

grant execute on function public.clock_in(uuid) to authenticated;
grant execute on function public.start_break(uuid) to authenticated;
grant execute on function public.end_break(uuid) to authenticated;
grant execute on function public.clock_out(uuid) to authenticated;
grant execute on function public.apply_due_auto_clockouts() to authenticated;

-- ---------- DATA API GRANTS ----------
grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.sites to authenticated;
grant select, insert, update, delete on public.schedules to authenticated;
grant select on public.time_entries to authenticated;
grant select on public.breaks to authenticated;

-- ---------- STARTER SITES ----------
insert into public.sites(name, radius_meters, geofence_enabled)
values
    ('VECTOR', 200, false),
    ('Amazon Distribution Center', 200, false),
    ('FedEx Distribution Center', 200, false),
    ('Downtown Office Complex', 200, false)
on conflict (name) do nothing;