grant execute on function public.rye_admin_session_valid(text) to anon,authenticated;
grant execute on function public.rye_admin_logout(text) to anon,authenticated;

create or replace function public.rye_admin_dashboard(p_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_valid boolean; v_result jsonb;
begin
  select public.rye_admin_session_valid(p_token) into v_valid;
  if coalesce(v_valid,false) is not true then raise exception 'unauthorized'; end if;
  select jsonb_build_object(
    'metrics',jsonb_build_object(
      'previews7d',(select count(*) from public.dengine_plan_drafts where created_at>=now()-interval '7 days'),
      'checkouts7d',(select count(*) from public.dengine_orders where created_at>=now()-interval '7 days'),
      'paid30d',(select count(*) from public.dengine_orders where status='paid' and created_at>=now()-interval '30 days'),
      'revenue30d',(select coalesce(sum(amount_cents),0) from public.dengine_orders where status='paid' and created_at>=now()-interval '30 days'),
      'activeWorkspaces',(select count(*) from public.rye_workspaces where status='active'),
      'workspaceMembers',(select count(*) from public.rye_workspace_members where accepted_at is not null)
    ),
    'segments',coalesce((select jsonb_agg(s order by case s->>'segment' when 'company' then 1 when 'weddings' then 2 when 'family_reunions' then 3 when 'secondary' then 4 else 5 end) from (
      select jsonb_build_object('segment',seg,'previews',(select count(*) from public.dengine_plan_drafts d where d.event_segment=seg and d.created_at>=now()-interval '30 days'),'orders',(select count(*) from public.dengine_orders o where o.event_segment=seg and o.created_at>=now()-interval '30 days'),'paid',(select count(*) from public.dengine_orders o where o.event_segment=seg and o.status='paid' and o.created_at>=now()-interval '30 days'),'revenue',(select coalesce(sum(amount_cents),0) from public.dengine_orders o where o.event_segment=seg and o.status='paid' and o.created_at>=now()-interval '30 days')) s from unnest(array['company','weddings','family_reunions','secondary','other']) seg
    ) q),'[]'::jsonb),
    'orders',coalesce((select jsonb_agg(to_jsonb(o) order by o.created_at desc) from (select id,draft_token,tier,amount_cents,currency,status,customer_email,event_segment,created_at,verified_at,stripe_checkout_session_id,stripe_payment_intent_id from public.dengine_orders order by created_at desc limit 30) o),'[]'::jsonb),
    'drafts',coalesce((select jsonb_agg(to_jsonb(d) order by d.created_at desc) from (select draft_token,event_summary,recommended_tier,event_segment,created_at,expires_at from public.dengine_plan_drafts order by created_at desc limit 30) d),'[]'::jsonb),
    'workspaces',coalesce((select jsonb_agg(to_jsonb(w)-'owner_access_hash' order by w.created_at desc) from (select * from public.rye_workspaces order by created_at desc limit 30) w),'[]'::jsonb),
    'activity',coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc) from (select * from public.dengine_conversion_events order by created_at desc limit 50) a),'[]'::jsonb)
  ) into v_result;
  return v_result;
end $$;
grant execute on function public.rye_admin_dashboard(text) to anon,authenticated;
