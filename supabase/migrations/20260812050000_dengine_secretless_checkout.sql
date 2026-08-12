-- Public capability RPCs for DEngine's encrypted preview + Stripe Payment Link flow.
-- The Stripe webhook signing secret is stored separately in Supabase Vault and is never committed.

create or replace function public.dengine_store_preview_draft(
  p_draft_token uuid, p_plan_ciphertext text, p_plan_iv text, p_plan_tag text,
  p_preview jsonb, p_event_summary jsonb, p_recommended_tier text, p_expires_at timestamptz
) returns void language plpgsql security definer set search_path = public as $$
begin
  if p_recommended_tier not in ('essential','professional') then raise exception 'invalid tier'; end if;
  if p_expires_at <= now() or p_expires_at > now() + interval '49 hours' then raise exception 'invalid expiry'; end if;
  if length(p_plan_ciphertext) = 0 or length(p_plan_ciphertext) > 4000000 then raise exception 'invalid plan payload'; end if;
  if length(p_plan_iv) > 256 or length(p_plan_tag) > 256 then raise exception 'invalid encryption metadata'; end if;
  insert into public.dengine_plan_drafts(draft_token,plan_ciphertext,plan_iv,plan_tag,preview,event_summary,recommended_tier,expires_at)
  values(p_draft_token,p_plan_ciphertext,p_plan_iv,p_plan_tag,coalesce(p_preview,'{}'::jsonb),coalesce(p_event_summary,'{}'::jsonb),p_recommended_tier,p_expires_at);
  insert into public.dengine_conversion_events(event_name,draft_token,metadata) values
    ('preview_generated',p_draft_token,coalesce(p_preview->'summary','{}'::jsonb)),
    ('tier_recommended',p_draft_token,jsonb_build_object('tier',p_recommended_tier));
end; $$;
revoke all on function public.dengine_store_preview_draft(uuid,text,text,text,jsonb,jsonb,text,timestamptz) from public;
grant execute on function public.dengine_store_preview_draft(uuid,text,text,text,jsonb,jsonb,text,timestamptz) to anon, authenticated;

create or replace function public.dengine_prepare_checkout(p_draft_token uuid,p_tier text,p_accept_terms boolean,p_immediate_performance boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_order_id uuid; v_amount integer;
begin
  if p_tier not in ('essential','professional') then raise exception 'invalid tier'; end if;
  if coalesce(p_accept_terms,false) is not true or coalesce(p_immediate_performance,false) is not true then raise exception 'purchase acknowledgements required'; end if;
  if not exists(select 1 from public.dengine_plan_drafts where draft_token=p_draft_token and expires_at>now()) then raise exception 'preview expired or unavailable'; end if;
  v_amount := case when p_tier='essential' then 1900 else 3900 end;
  insert into public.dengine_orders(draft_token,tier,amount_cents,currency,status,accepted_terms_at,immediate_performance_consent_at)
  values(p_draft_token,p_tier,v_amount,'usd','checkout_created',now(),now()) returning id into v_order_id;
  insert into public.dengine_conversion_events(event_name,draft_token,metadata) values('checkout_started',p_draft_token,jsonb_build_object('tier',p_tier));
  return v_order_id;
end; $$;
revoke all on function public.dengine_prepare_checkout(uuid,text,boolean,boolean) from public;
grant execute on function public.dengine_prepare_checkout(uuid,text,boolean,boolean) to anon, authenticated;

create or replace function public.dengine_get_paid_draft(p_draft_token uuid)
returns table(plan_ciphertext text,plan_iv text,plan_tag text,paid_tier text,event_summary jsonb,verified_at timestamptz)
language sql stable security definer set search_path=public as $$
  select d.plan_ciphertext,d.plan_iv,d.plan_tag,o.tier,d.event_summary,o.verified_at
  from public.dengine_plan_drafts d
  join lateral(
    select tier,verified_at from public.dengine_orders where draft_token=d.draft_token and status='paid'
    order by verified_at desc nulls last,created_at desc limit 1
  ) o on true
  where d.draft_token=p_draft_token limit 1;
$$;
revoke all on function public.dengine_get_paid_draft(uuid) from public;
grant execute on function public.dengine_get_paid_draft(uuid) to anon, authenticated;

create or replace function public.dengine_get_webhook_secret() returns text
language sql stable security definer set search_path=public,vault as $$
  select decrypted_secret from vault.decrypted_secrets where name='dengine_stripe_webhook_sandbox' limit 1;
$$;
revoke all on function public.dengine_get_webhook_secret() from public,anon,authenticated;
grant execute on function public.dengine_get_webhook_secret() to service_role;
