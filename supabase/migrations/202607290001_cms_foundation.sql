begin;

create extension if not exists pgcrypto;

create type public.app_role as enum (
  'admin', 'editor', 'faculty', 'admissions', 'library_editor', 'student'
);
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.news_kind as enum ('news', 'event', 'announcement', 'lecture', 'workshop');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  display_name text,
  email text,
  avatar_path text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  unique (user_id, role)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, display_name, email)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_profile_id()
returns uuid language sql stable security definer set search_path = ''
as $$ select auth.uid() $$;

create or replace function public.has_role(requested_role public.app_role)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    where ur.user_id = auth.uid() and ur.role = requested_role and p.is_active
  )
$$;

create or replace function public.has_any_role(requested_roles public.app_role[])
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    where ur.user_id = auth.uid() and ur.role = any(requested_roles) and p.is_active
  )
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select public.has_role('admin'::public.app_role) $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_public_content(
  row_status public.content_status,
  row_visible boolean,
  row_published_at timestamptz
)
returns boolean language sql stable set search_path = ''
as $$
  select row_status = 'published'::public.content_status
    and row_visible
    and (row_published_at is null or row_published_at <= now())
$$;

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null,
  summary text,
  body text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  is_featured boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  kind public.news_kind not null default 'news',
  title text not null check (char_length(title) between 3 and 180),
  excerpt text,
  body text,
  cover_image_path text,
  cover_image_alt text,
  category text,
  location text,
  external_url text check (external_url is null or external_url ~ '^https://'),
  event_start_at timestamptz,
  event_end_at timestamptz,
  registration_url text check (registration_url is null or registration_url ~ '^https://'),
  status public.content_status not null default 'draft',
  is_visible boolean not null default true,
  is_featured boolean not null default false,
  is_pinned boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (event_end_at is null or event_start_at is null or event_end_at >= event_start_at)
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, body text, cover_image_path text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, body text, cover_image_path text,
  program_id uuid references public.programs(id) on delete set null,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.faculty_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, body text, image_path text, specialization text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.scientific_council_members (
  id uuid primary key default gen_random_uuid(),
  faculty_member_id uuid references public.faculty_members(id) on delete set null,
  title text not null, role_title text, summary text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, body text, cover_image_path text, file_path text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.journal_issues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, body text, issue_number integer, cover_image_path text, file_path text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.research_papers (
  id uuid primary key default gen_random_uuid(),
  journal_issue_id uuid references public.journal_issues(id) on delete set null,
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, body text, authors jsonb not null default '[]'::jsonb, file_path text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.ijazat (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, body text, cover_image_path text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.library_resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, body text, resource_url text, file_path text, cover_image_path text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.research_sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[[:alnum:]]+(-[[:alnum:]]+)*$'),
  title text not null, summary text, site_url text not null check (site_url ~ '^https://'),
  category text, tags text[] not null default '{}',
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, is_featured boolean not null default false,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.admission_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 160),
  email text not null, phone text, country text,
  program_id uuid references public.programs(id) on delete set null,
  academic_background text, fee_option text,
  status text not null default 'new' check (status in ('new','reviewing','accepted','rejected','withdrawn')),
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.fee_options (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null, summary text,
  sort_order integer not null default 0, is_visible boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null, summary text, starts_at timestamptz not null, ends_at timestamptz,
  meeting_url text, program_id uuid references public.programs(id) on delete set null,
  faculty_member_id uuid references public.faculty_members(id) on delete set null,
  status public.content_status not null default 'draft', is_visible boolean not null default true,
  published_at timestamptz, created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null, label text not null, url text not null check (url ~ '^https://'),
  sort_order integer not null default 0, is_visible boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null check (bucket_id in ('public-media','private-admission-documents')),
  storage_path text not null unique check (storage_path !~ '(^|/)\.\.(/|$)'),
  original_name text, alt_text text, mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  width integer check (width is null or width > 0), height integer check (height is null or height > 0),
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.university_accreditation (
  id uuid primary key default gen_random_uuid(),
  title text not null, summary text, body text, logo_path text, external_url text,
  status public.content_status not null default 'draft', sort_order integer not null default 0,
  is_visible boolean not null default true, published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in ('create','update','delete','publish','archive','role_change','media_upload','media_delete','unauthorized_access')),
  entity_type text not null, entity_id uuid,
  previous_data jsonb, new_data jsonb,
  ip_address inet, user_agent text,
  created_at timestamptz not null default now()
);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','pages','site_settings','news_events','programs','courses','faculty_members',
    'scientific_council_members','publications','journal_issues','research_papers','ijazat',
    'library_resources','research_sites','admission_applications','fee_options','live_sessions',
    'social_links','media_assets','university_accreditation'
  ] loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'pages','news_events','programs','courses','faculty_members','scientific_council_members',
    'publications','journal_issues','research_papers','ijazat','library_resources','research_sites',
    'university_accreditation'
  ] loop
    execute format('create index %I_status_published_idx on public.%I (status, published_at desc)', table_name, table_name);
    execute format('create index %I_sort_idx on public.%I (sort_order)', table_name, table_name);
  end loop;
end $$;
create index news_events_public_order_idx on public.news_events (is_pinned desc, is_featured desc, published_at desc);
create index user_roles_user_idx on public.user_roles (user_id);
create index admission_applications_status_idx on public.admission_applications (status, created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','user_roles','pages','site_settings','news_events','programs','courses',
    'faculty_members','scientific_council_members','publications','journal_issues',
    'research_papers','ijazat','library_resources','research_sites','admission_applications',
    'fee_options','live_sessions','social_links','media_assets','university_accreditation','audit_logs'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

create policy "profile owner reads own" on public.profiles for select using (id = auth.uid());
create policy "profile owner updates own safe profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "admin manages profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "users read own roles" on public.user_roles for select using (user_id = auth.uid());
create policy "admin manages roles" on public.user_roles for all using (public.is_admin()) with check (public.is_admin());

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'pages','news_events','programs','courses','faculty_members','scientific_council_members',
    'publications','journal_issues','research_papers','ijazat','library_resources','research_sites',
    'university_accreditation'
  ] loop
    execute format(
      'create policy "public reads published %1$s" on public.%1$I for select using (public.is_public_content(status, is_visible, published_at))',
      table_name
    );
    execute format(
      'create policy "admin manages %1$s" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())',
      table_name
    );
  end loop;
end $$;

create policy "editors manage editorial content" on public.pages for all
  using (public.has_role('editor')) with check (public.has_role('editor'));
create policy "editors manage news" on public.news_events for all
  using (public.has_role('editor')) with check (public.has_role('editor'));
create policy "editors manage programs" on public.programs for all
  using (public.has_role('editor')) with check (public.has_role('editor'));
create policy "editors manage courses" on public.courses for all
  using (public.has_role('editor')) with check (public.has_role('editor'));

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'publications','journal_issues','research_papers','library_resources','research_sites','media_assets'
  ] loop
    execute format(
      'create policy "library editors manage %1$s" on public.%1$I for all using (public.has_role(''library_editor'')) with check (public.has_role(''library_editor''))',
      table_name
    );
  end loop;
end $$;

create policy "faculty reads own member record" on public.faculty_members for select
  using (profile_id = auth.uid() or public.is_public_content(status, is_visible, published_at));
create policy "faculty updates own member record" on public.faculty_members for update
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "public submits admission applications" on public.admission_applications for insert
  to anon, authenticated with check (status = 'new' and assigned_to is null);
create policy "admissions manages applications" on public.admission_applications for select
  using (public.has_any_role(array['admin','admissions']::public.app_role[]));
create policy "admissions updates applications" on public.admission_applications for update
  using (public.has_any_role(array['admin','admissions']::public.app_role[]))
  with check (public.has_any_role(array['admin','admissions']::public.app_role[]));

create policy "public reads visible fees" on public.fee_options for select using (is_visible);
create policy "admin manages fees" on public.fee_options for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads visible social links" on public.social_links for select using (is_visible);
create policy "admin manages social links" on public.social_links for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads public settings" on public.site_settings for select using (is_public);
create policy "admin manages settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads published live sessions" on public.live_sessions for select
  using (public.is_public_content(status, is_visible, published_at));
create policy "admin manages live sessions" on public.live_sessions for all using (public.is_admin()) with check (public.is_admin());
create policy "faculty manages own live sessions" on public.live_sessions for all
  using (exists(select 1 from public.faculty_members f where f.id = faculty_member_id and f.profile_id = auth.uid()))
  with check (exists(select 1 from public.faculty_members f where f.id = faculty_member_id and f.profile_id = auth.uid()));
create policy "media managers read assets" on public.media_assets for select
  using (bucket_id = 'public-media' or public.has_any_role(array['admin','editor','library_editor','admissions']::public.app_role[]));
create policy "media managers write public assets" on public.media_assets for all
  using (public.has_any_role(array['admin','editor','library_editor']::public.app_role[]))
  with check (public.has_any_role(array['admin','editor','library_editor']::public.app_role[]));
create policy "admissions manages private assets" on public.media_assets for all
  using (public.has_any_role(array['admin','admissions']::public.app_role[]))
  with check (public.has_any_role(array['admin','admissions']::public.app_role[]));
create policy "admin reads audit logs" on public.audit_logs for select using (public.is_admin());
create policy "authorized actors append audit logs" on public.audit_logs for insert
  with check (
    actor_id = auth.uid()
    and public.has_any_role(array['admin','editor','faculty','admissions','library_editor']::public.app_role[])
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-media','public-media',true,10485760,array['image/jpeg','image/png','image/webp','image/avif','application/pdf']),
  ('private-admission-documents','private-admission-documents',false,26214400,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;

create policy "public reads public media" on storage.objects for select
  using (bucket_id = 'public-media');
create policy "media roles upload public media" on storage.objects for insert
  with check (
    bucket_id = 'public-media'
    and public.has_any_role(array['admin','editor','library_editor']::public.app_role[])
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "media roles update public media" on storage.objects for update
  using (bucket_id = 'public-media' and owner_id = auth.uid())
  with check (bucket_id = 'public-media' and owner_id = auth.uid());
create policy "media roles delete public media" on storage.objects for delete
  using (bucket_id = 'public-media' and (owner_id = auth.uid() or public.is_admin()));
create policy "admissions access private documents" on storage.objects for select
  using (bucket_id = 'private-admission-documents' and public.has_any_role(array['admin','admissions']::public.app_role[]));
create policy "applicants upload private documents" on storage.objects for insert
  to authenticated with check (
    bucket_id = 'private-admission-documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

grant execute on function public.has_role(public.app_role) to anon, authenticated;
grant execute on function public.has_any_role(public.app_role[]) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.current_profile_id() to authenticated;

commit;
