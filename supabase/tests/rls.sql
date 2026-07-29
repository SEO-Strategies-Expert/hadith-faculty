-- Run against a disposable local Supabase database after migrations.
-- These assertions document the required RLS boundary; do not run against production.
begin;
select plan(8);
select ok((select relrowsecurity from pg_class where oid='public.news_events'::regclass), 'RLS enabled on news_events');
select ok((select relrowsecurity from pg_class where oid='public.user_roles'::regclass), 'RLS enabled on user_roles');
select ok((select relrowsecurity from pg_class where oid='public.admission_applications'::regclass), 'RLS enabled on admissions');
select has_policy('public','news_events','public reads published news_events','public published policy exists');
select has_policy('public','news_events','editors manage news','editor news policy exists');
select has_policy('public','user_roles','admin manages roles','only admin role management policy exists');
select has_policy('public','admission_applications','admissions manages applications','admissions read policy exists');
select has_policy('public','media_assets','library editors manage media_assets','library media policy exists');
select * from finish();
rollback;
