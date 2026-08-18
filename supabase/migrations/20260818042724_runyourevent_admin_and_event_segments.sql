create extension if not exists pgcrypto with schema extensions;
alter table public.dengine_plan_drafts add column if not exists event_segment text not null default 'other';
alter table public.dengine_orders add column if not exists event_segment text not null default 'other';
alter table public.dengine_conversion_events add column if not exists event_segment text not null default 'other';
alter table public.dengine_plan_drafts drop constraint if exists dengine_plan_drafts_event_segment_check;
alter table public.dengine_plan_drafts add constraint dengine_plan_drafts_event_segment_check check (event_segment in ('company','weddings','family_reunions','secondary','other'));
alter table public.dengine_orders drop constraint if exists dengine_orders_event_segment_check;
alter table public.dengine_orders add constraint dengine_orders_event_segment_check check (event_segment in ('company','weddings','family_reunions','secondary','other'));
alter table public.dengine_conversion_events drop constraint if exists dengine_conversion_events_event_segment_check;
alter table public.dengine_conversion_events add constraint dengine_conversion_events_event_segment_check check (event_segment in ('company','weddings','family_reunions','secondary','other'));
create index if not exists idx_dengine_drafts_segment_created on public.dengine_plan_drafts(event_segment,created_at desc);
create index if not exists idx_dengine_orders_segment_created on public.dengine_orders(event_segment,created_at desc);
create index if not exists idx_dengine_conversion_segment_created on public.dengine_conversion_events(event_segment,created_at desc);

create table if not exists public.rye_admin_users (
  id uuid primary key default gen_random_uuid(), email text unique not null, password_hash text not null,
  is_active boolean not null default true, created_at timestamptz not null default now(), last_login_at timestamptz
);
create table if not exists public.rye_admin_sessions (
  id uuid primary key default gen_random_uuid(), admin_user_id uuid not null references public.rye_admin_users(id) on delete cascade,
  session_token text unique not null, created_at timestamptz not null default now(), expires_at timestamptz not null
);
create index if not exists idx_rye_admin_sessions_expiry on public.rye_admin_sessions(expires_at);
alter table public.rye_admin_users enable row level security;
alter table public.rye_admin_sessions enable row level security;
revoke all on public.rye_admin_users from anon,authenticated;
revoke all on public.rye_admin_sessions from anon,authenticated;

create or replace function public.rye_admin_login(p_email text,p_password text)
returns table(session_token text,expires_at timestamptz)
language plpgsql security definer set search_path=public,extensions as $$
declare v_user public.rye_admin_users%rowtype; v_token text; v_exp timestamptz;
begin
  select * into v_user from public.rye_admin_users u where lower(u.email)=lower(trim(p_email)) and u.is_active=true limit 1;
  if v_user.id is null or v_user.password_hash<>extensions.crypt(p_password,v_user.password_hash) then perform pg_sleep(0.35); raise exception 'invalid credentials'; end if;
  delete from public.rye_admin_sessions s where s.expires_at<=now();
  v_token:=encode(extensions.gen_random_bytes(32),'hex'); v_exp:=now()+interval '12 hours';
  insert into public.rye_admin_sessions(admin_user_id,session_token,expires_at) values(v_user.id,v_token,v_exp);
  update public.rye_admin_users u set last_login_at=now() where u.id=v_user.id;
  return query select v_token,v_exp;
end $$;
grant execute on function public.rye_admin_login(text,text) to anon,authenticated;

create or replace function public.rye_admin_session_valid(p_token text)
returns boolean language sql security definer set search_path=public stable as $$
 select exists(select 1 from public.rye_admin_sessions where session_token=p_token and expires_at>now());
$$;
revoke all on function public.rye_admin_session_valid(text) from public,anon,authenticated;
create or replace function public.rye_admin_logout(p_token text)
returns void language sql security definer set search_path=public as $$ delete from public.rye_admin_sessions where session_token=p_token; $$;
revoke all on function public.rye_admin_logout(text) from public,anon,authenticated;

create or replace function public.dengine_store_preview_draft(
 p_draft_token uuid,p_plan_ciphertext text,p_plan_iv text,p_plan_tag text,p_preview jsonb,p_event_summary jsonb,p_recommended_tier text,p_expires_at timestamptz,p_event_segment text default 'other'
) returns void language plpgsql security definer set search_path=public as $$
begin
 if p_recommended_tier not in ('essential','professional') then raise exception 'invalid tier'; end if;
 if p_event_segment not in ('company','weddings','family_reunions','secondary','other') then raise exception 'invalid segment'; end if;
 if p_expires_at<=now() or p_expires_at>now()+interval '49 hours' then raise exception 'invalid expiry'; end if;
 if length(p_plan_ciphertext)=0 or length(p_plan_ciphertext)>4000000 then raise exception 'invalid plan payload'; end if;
 if length(p_plan_iv)>256 or length(p_plan_tag)>256 then raise exception 'invalid encryption metadata'; end if;
 insert into public.dengine_plan_drafts(draft_token,plan_ciphertext,plan_iv,plan_tag,preview,event_summary,recommended_tier,expires_at,event_segment)
 values(p_draft_token,p_plan_ciphertext,p_plan_iv,p_plan_tag,coalesce(p_preview,'{}'::jsonb),coalesce(p_event_summary,'{}'::jsonb),p_recommended_tier,p_expires_at,p_event_segment);
 insert into public.dengine_conversion_events(event_name,draft_token,metadata,event_segment) values
 ('preview_generated',p_draft_token,coalesce(p_preview->'summary','{}'::jsonb),p_event_segment),
 ('tier_recommended',p_draft_token,jsonb_build_object('tier',p_recommended_tier),p_event_segment);
end $$;

drop function if exists public.dengine_prepare_checkout(uuid,text,boolean,boolean);
create function public.dengine_prepare_checkout(p_draft_token uuid,p_tier text,p_accept_terms boolean,p_immediate_performance boolean)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_order_id uuid; v_amount integer; v_segment text;
begin
 if p_tier not in ('essential','professional') then raise exception 'invalid tier'; end if;
 if coalesce(p_accept_terms,false) is not true or coalesce(p_immediate_performance,false) is not true then raise exception 'purchase acknowledgements required'; end if;
 select event_segment into v_segment from public.dengine_plan_drafts where draft_token=p_draft_token and expires_at>now();
 if v_segment is null then raise exception 'preview expired or unavailable'; end if;
 v_amount:=case when p_tier='essential' then 1900 else 3900 end;
 insert into public.dengine_orders(draft_token,tier,amount_cents,currency,status,accepted_terms_at,immediate_performance_consent_at,event_segment)
 values(p_draft_token,p_tier,v_amount,'usd','checkout_created',now(),now(),v_segment) returning id into v_order_id;
 insert into public.dengine_conversion_events(event_name,draft_token,metadata,event_segment) values('checkout_started',p_draft_token,jsonb_build_object('tier',p_tier),v_segment);
 return v_order_id;
end $$;
grant execute on function public.dengine_prepare_checkout(uuid,text,boolean,boolean) to anon,authenticated;
