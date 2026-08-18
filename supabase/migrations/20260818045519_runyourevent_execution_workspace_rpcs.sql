create or replace function public.rye_provision_workspace(p_draft_token uuid,p_plan jsonb,p_owner_access_hash text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_workspace uuid; v_order record; v_name text; v_event_date date; v_owner_member uuid;
begin
  select tier,event_segment into v_order from public.dengine_orders where draft_token=p_draft_token and status='paid' order by verified_at desc nulls last,created_at desc limit 1;
  if v_order.tier is null then raise exception 'paid entitlement required'; end if;
  select id into v_workspace from public.rye_workspaces where draft_token=p_draft_token;
  if v_workspace is not null then
    update public.rye_workspaces set owner_access_hash=p_owner_access_hash,updated_at=now() where id=v_workspace;
    update public.rye_workspace_members set access_hash=p_owner_access_hash,accepted_at=coalesce(accepted_at,now()) where workspace_id=v_workspace and role='owner';
    return v_workspace;
  end if;
  v_name:=coalesce(nullif(p_plan#>>'{event,name}',''),'Your event');
  begin v_event_date:=nullif(p_plan#>>'{smart,eventDate}','')::date; exception when others then v_event_date:=null; end;
  insert into public.rye_workspaces(draft_token,name,event_date,tier,event_segment,owner_access_hash)
  values(p_draft_token,v_name,v_event_date,v_order.tier,v_order.event_segment,p_owner_access_hash) returning id into v_workspace;
  insert into public.rye_workspace_members(workspace_id,name,email,role,access_hash,accepted_at)
  values(v_workspace,'Event owner',null,'owner',p_owner_access_hash,now()) returning id into v_owner_member;
  insert into public.rye_workspace_tasks(workspace_id,source_task_id,sort_order,layer,workstream,title,description,owner_label,target_date,baseline_target_date,weeks_before_event,depends_on,approval_required,approver,completion_criteria,evidence_required,risk_level,risk_if_missed,contingency,critical_path,procurement_category,vendor_scope)
  select v_workspace,coalesce(nullif(t->>'id',''),'T'||lpad(ord::text,2,'0')),ord::int,nullif(t->>'layer',''),coalesce(nullif(t->>'workstream',''),nullif(t->>'sub_project',''),'Event Operations'),coalesce(nullif(t->>'title',''),'Execution task'),nullif(t->>'description',''),nullif(t->>'who',''),case when coalesce(t->>'target_date','') ~ '^\d{4}-\d{2}-\d{2}$' then (t->>'target_date')::date else null end,case when coalesce(t->>'target_date','') ~ '^\d{4}-\d{2}-\d{2}$' then (t->>'target_date')::date else null end,case when coalesce(t->>'weeks_before_event','') ~ '^\d+$' then (t->>'weeks_before_event')::int else null end,coalesce(t->'depends_on','[]'::jsonb),coalesce((t->>'approval_required')::boolean,false),nullif(t->>'approver',''),coalesce(nullif(t->>'completion_criteria',''),nullif(t->>'definition_of_done','')),nullif(t->>'evidence_required',''),nullif(t->>'risk_level',''),nullif(t->>'risk_if_missed',''),nullif(t->>'contingency',''),coalesce((t->>'critical_path')::boolean,false),nullif(t->>'procurement_category',''),nullif(t->>'vendor_scope','')
  from jsonb_array_elements(coalesce(p_plan->'tasks','[]'::jsonb)) with ordinality as x(t,ord);
  insert into public.rye_run_of_show(workspace_id,sort_order,cue,owner_label,source_task_id,contingency,status)
  select v_workspace,row_number() over(order by sort_order)::int,title,owner_label,source_task_id,contingency,'planned' from public.rye_workspace_tasks where workspace_id=v_workspace and (layer='Execution' or weeks_before_event=0) order by sort_order;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(v_workspace,'RunYourEvent','workspace_created',jsonb_build_object('tier',v_order.tier,'tasks',(select count(*) from public.rye_workspace_tasks where workspace_id=v_workspace)));
  return v_workspace;
end $$;
grant execute on function public.rye_provision_workspace(uuid,jsonb,text) to anon,authenticated;

create or replace function public.rye_get_workspace(p_workspace_id uuid,p_access_hash text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_role text; v_result jsonb;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role is null then raise exception 'unauthorized'; end if;
  select jsonb_build_object(
    'role',v_role,
    'workspace',(select to_jsonb(w)-'owner_access_hash' from public.rye_workspaces w where w.id=p_workspace_id),
    'members',coalesce((select jsonb_agg(to_jsonb(m)-'access_hash' order by m.created_at) from public.rye_workspace_members m where m.workspace_id=p_workspace_id),'[]'::jsonb),
    'tasks',coalesce((select jsonb_agg(to_jsonb(t) order by t.sort_order,t.created_at) from public.rye_workspace_tasks t where t.workspace_id=p_workspace_id),'[]'::jsonb),
    'comments',coalesce((select jsonb_agg(to_jsonb(c) order by c.created_at desc) from (select * from public.rye_task_comments where workspace_id=p_workspace_id order by created_at desc limit 200) c),'[]'::jsonb),
    'runOfShow',coalesce((select jsonb_agg(to_jsonb(r) order by r.sort_order,r.start_time nulls last) from public.rye_run_of_show r where r.workspace_id=p_workspace_id),'[]'::jsonb),
    'activity',coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc) from (select * from public.rye_workspace_activity where workspace_id=p_workspace_id order by created_at desc limit 80) a),'[]'::jsonb),
    'metrics',jsonb_build_object('total',(select count(*) from public.rye_workspace_tasks where workspace_id=p_workspace_id),'done',(select count(*) from public.rye_workspace_tasks where workspace_id=p_workspace_id and status='done'),'blocked',(select count(*) from public.rye_workspace_tasks where workspace_id=p_workspace_id and status='blocked'),'criticalTotal',(select count(*) from public.rye_workspace_tasks where workspace_id=p_workspace_id and critical_path),'criticalDone',(select count(*) from public.rye_workspace_tasks where workspace_id=p_workspace_id and critical_path and status='done'),'overdue',(select count(*) from public.rye_workspace_tasks where workspace_id=p_workspace_id and target_date<current_date and status<>'done'),'awaitingApproval',(select count(*) from public.rye_workspace_tasks where workspace_id=p_workspace_id and status='awaiting_approval'))
  ) into v_result;
  return v_result;
end $$;
grant execute on function public.rye_get_workspace(uuid,text) to anon,authenticated;

create or replace function public.rye_update_task(p_workspace_id uuid,p_task_id uuid,p_access_hash text,p_status text,p_owner_member_id uuid default null,p_evidence_note text default null,p_blocked_reason text default null)
returns void language plpgsql security definer set search_path=public as $$
declare v_role text; v_title text;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role not in ('owner','editor') then raise exception 'write access required'; end if;
  if p_status not in ('not_started','in_progress','blocked','awaiting_approval','done') then raise exception 'invalid status'; end if;
  if p_owner_member_id is not null and not exists(select 1 from public.rye_workspace_members where id=p_owner_member_id and workspace_id=p_workspace_id) then raise exception 'invalid owner'; end if;
  update public.rye_workspace_tasks set status=p_status,owner_member_id=coalesce(p_owner_member_id,owner_member_id),evidence_note=coalesce(p_evidence_note,evidence_note),blocked_reason=case when p_status='blocked' then p_blocked_reason else null end,completed_at=case when p_status='done' then coalesce(completed_at,now()) else null end,updated_at=now() where id=p_task_id and workspace_id=p_workspace_id returning title into v_title;
  if v_title is null then raise exception 'task not found'; end if;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(p_workspace_id,v_role,'task_updated',jsonb_build_object('taskId',p_task_id,'title',v_title,'status',p_status));
end $$;
grant execute on function public.rye_update_task(uuid,uuid,text,text,uuid,text,text) to anon,authenticated;

create or replace function public.rye_add_comment(p_workspace_id uuid,p_task_id uuid,p_access_hash text,p_author text,p_body text)
returns bigint language plpgsql security definer set search_path=public as $$
declare v_role text; v_id bigint;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role is null then raise exception 'unauthorized'; end if;
  if length(trim(coalesce(p_body,'')))<1 or length(p_body)>2000 then raise exception 'invalid comment'; end if;
  insert into public.rye_task_comments(workspace_id,task_id,author_name,body) values(p_workspace_id,p_task_id,left(coalesce(nullif(trim(p_author),''),v_role),100),left(p_body,2000)) returning id into v_id;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(p_workspace_id,coalesce(nullif(trim(p_author),''),v_role),'comment_added',jsonb_build_object('taskId',p_task_id));
  return v_id;
end $$;
grant execute on function public.rye_add_comment(uuid,uuid,text,text,text) to anon,authenticated;
