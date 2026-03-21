create table if not exists public.portfolio_admins (
    email text primary key,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.portfolio_content (
    id text primary key,
    content jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default timezone('utc', now()),
    updated_by text
);

create or replace function public.request_email()
returns text
language sql
stable
as $$
    select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
as $$
    select exists (
        select 1
        from public.portfolio_admins admins
        where admins.email = public.request_email()
    )
$$;

alter table public.portfolio_admins enable row level security;
alter table public.portfolio_content enable row level security;

drop policy if exists "portfolio admins can read their own membership" on public.portfolio_admins;
create policy "portfolio admins can read their own membership"
on public.portfolio_admins
for select
to authenticated
using (lower(email) = public.request_email());

drop policy if exists "public can read portfolio content" on public.portfolio_content;
create policy "public can read portfolio content"
on public.portfolio_content
for select
to anon, authenticated
using (true);

drop policy if exists "portfolio admins can insert portfolio content" on public.portfolio_content;
create policy "portfolio admins can insert portfolio content"
on public.portfolio_content
for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "portfolio admins can update portfolio content" on public.portfolio_content;
create policy "portfolio admins can update portfolio content"
on public.portfolio_content
for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "portfolio admins can delete portfolio content" on public.portfolio_content;
create policy "portfolio admins can delete portfolio content"
on public.portfolio_content
for delete
to authenticated
using (public.is_portfolio_admin());

-- Create the `portfolio-media` bucket from the Supabase Dashboard instead of
-- inserting directly into storage.buckets. Supabase recommends treating the
-- storage schema as read-only, and bucket metadata can vary across versions.

drop policy if exists "public can read portfolio media" on storage.objects;
create policy "public can read portfolio media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-media');

drop policy if exists "portfolio admins can upload portfolio media" on storage.objects;
create policy "portfolio admins can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
);

drop policy if exists "portfolio admins can update portfolio media" on storage.objects;
create policy "portfolio admins can update portfolio media"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
)
with check (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
);

drop policy if exists "portfolio admins can delete portfolio media" on storage.objects;
create policy "portfolio admins can delete portfolio media"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'portfolio-media'
    and public.is_portfolio_admin()
);

insert into public.portfolio_admins (email)
values ('chandra170905@gmail.com')
on conflict (email) do nothing;
