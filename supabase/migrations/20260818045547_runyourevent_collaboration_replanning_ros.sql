create or replace function public.rye_invite_member(p_workspace_id uuid,p_access_hash text,p_name text,p_email text,p_role text,p_member_access_hash text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_role text; v_id uuid;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role<>'owner' then raise exception 'owner access required'; end if;
  if p_role not in ('editor','viewer') then raise exception 'invalid role'; end if;
  insert into public.rye_workspace_members(workspace_id,name,email,role,access_hash)
  values(p_workspace_id,left(coalesce(nullif(trim(p_name),''),coalesce(nullif(trim(p_email),''),'Collaborator')),100),nullif(lower(trim(p_email)),''),p_role,p_member_access_hash)
  returning id into v_id;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(p_workspace_id,'owner','member_invited',jsonb_build_object('memberId',v_id,'role',p_role,'email',p_email));
  return v_id;
end $$;
grant execute on function public.rye_invite_member(uuid,text,text,text,text,text) to anon,authenticated;

create or replace function public.rye_accept_invite(p_member_access_hash text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_member record;
begin
  update public.rye_workspace_members set accepted_at=coalesce(accepted_at,now()) where access_hash=p_member_access_hash returning id,workspace_id,name,email,role into v_member;
  if v_member.id is null then raise exception 'invite not found'; end if;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(v_member.workspace_id,coalesce(v_member.name,v_member.email),'member_joined',jsonb_build_object('memberId',v_member.id,'role',v_member.role));
  return jsonb_build_object('workspaceId',v_member.workspace_id,'memberId',v_member.id,'name',v_member.name,'role',v_member.role);
end $$;
grant execute on function public.rye_accept_invite(text) to anon,authenticated;

create or replace function public.rye_replan_workspace_date(p_workspace_id uuid,p_access_hash text,p_new_event_date date)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_role text; v_old date; v_changed integer;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role not in ('owner','editor') then raise exception 'write access required'; end if;
  select event_date into v_old from public.rye_workspaces where id=p_workspace_id; if v_old is null then raise exception 'workspace not found'; end if;
  update public.rye_workspaces set event_date=p_new_event_date,updated_at=now() where id=p_workspace_id;
  update public.rye_workspace_tasks set target_date=(p_new_event_date-(weeks_before_event*7)),baseline_target_date=(p_new_event_date-(weeks_before_event*7)),updated_at=now() where workspace_id=p_workspace_id and weeks_before_event is not null;
  get diagnostics v_changed=row_count;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(p_workspace_id,v_role,'event_date_replanned',jsonb_build_object('oldDate',v_old,'newDate',p_new_event_date,'tasksReplanned',v_changed));
  return jsonb_build_object('oldDate',v_old,'newDate',p_new_event_date,'tasksReplanned',v_changed);
end $$;
grant execute on function public.rye_replan_workspace_date(uuid,text,date) to anon,authenticated;

create or replace function public.rye_replan_task_date(p_workspace_id uuid,p_task_id uuid,p_access_hash text,p_new_target_date date)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_role text; v_old date; v_source text; v_event date; v_delta integer; v_affected integer;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role not in ('owner','editor') then raise exception 'write access required'; end if;
  select target_date,source_task_id into v_old,v_source from public.rye_workspace_tasks where id=p_task_id and workspace_id=p_workspace_id;
  select event_date into v_event from public.rye_workspaces where id=p_workspace_id;
  if v_source is null or v_old is null then raise exception 'task cannot be replanned'; end if;
  v_delta:=p_new_target_date-v_old;
  update public.rye_workspace_tasks set target_date=p_new_target_date,updated_at=now() where id=p_task_id;
  with recursive downstream as (
    select t.id,t.source_task_id,t.depends_on,1 depth from public.rye_workspace_tasks t where t.workspace_id=p_workspace_id and exists(select 1 from jsonb_array_elements_text(t.depends_on) d where d=v_source)
    union
    select t.id,t.source_task_id,t.depends_on,d.depth+1 from downstream d join public.rye_workspace_tasks t on t.workspace_id=p_workspace_id where d.depth<40 and exists(select 1 from jsonb_array_elements_text(t.depends_on) x where x=d.source_task_id)
  )
  update public.rye_workspace_tasks t set target_date=case when v_event is not null then least(v_event,t.target_date+v_delta) else t.target_date+v_delta end,updated_at=now()
  where t.id in (select id from downstream) and t.target_date is not null and t.status<>'done';
  get diagnostics v_affected=row_count;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(p_workspace_id,v_role,'dependency_replanned',jsonb_build_object('taskId',p_task_id,'sourceTaskId',v_source,'oldDate',v_old,'newDate',p_new_target_date,'deltaDays',v_delta,'downstreamTasks',v_affected));
  return jsonb_build_object('oldDate',v_old,'newDate',p_new_target_date,'deltaDays',v_delta,'downstreamTasks',v_affected);
end $$;
grant execute on function public.rye_replan_task_date(uuid,uuid,text,date) to anon,authenticated;

create or replace function public.rye_save_run_of_show(p_workspace_id uuid,p_access_hash text,p_id uuid,p_start_time time,p_duration_minutes integer,p_cue text,p_owner_label text,p_location text,p_technical_cue text,p_contingency text,p_notes text,p_status text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_role text; v_id uuid;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role not in ('owner','editor') then raise exception 'write access required'; end if;
  if p_status not in ('planned','ready','live','complete','at_risk') then raise exception 'invalid status'; end if;
  if length(trim(coalesce(p_cue,'')))<1 then raise exception 'cue required'; end if;
  if p_id is null then
    insert into public.rye_run_of_show(workspace_id,sort_order,start_time,duration_minutes,cue,owner_label,location,technical_cue,contingency,notes,status)
    values(p_workspace_id,coalesce((select max(sort_order)+1 from public.rye_run_of_show where workspace_id=p_workspace_id),1),p_start_time,greatest(0,least(1440,coalesce(p_duration_minutes,15))),left(p_cue,220),left(p_owner_label,120),left(p_location,160),left(p_technical_cue,500),left(p_contingency,1200),left(p_notes,1200),p_status) returning id into v_id;
  else
    update public.rye_run_of_show set start_time=p_start_time,duration_minutes=greatest(0,least(1440,coalesce(p_duration_minutes,15))),cue=left(p_cue,220),owner_label=left(p_owner_label,120),location=left(p_location,160),technical_cue=left(p_technical_cue,500),contingency=left(p_contingency,1200),notes=left(p_notes,1200),status=p_status,updated_at=now() where id=p_id and workspace_id=p_workspace_id returning id into v_id;
  end if;
  if v_id is null then raise exception 'run of show item not found'; end if;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(p_workspace_id,v_role,'run_of_show_saved',jsonb_build_object('itemId',v_id,'status',p_status));
  return v_id;
end $$;
grant execute on function public.rye_save_run_of_show(uuid,text,uuid,time,integer,text,text,text,text,text,text,text) to anon,authenticated;

create or replace function public.rye_delete_run_of_show(p_workspace_id uuid,p_access_hash text,p_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare v_role text;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role not in ('owner','editor') then raise exception 'write access required'; end if;
  delete from public.rye_run_of_show where id=p_id and workspace_id=p_workspace_id;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(p_workspace_id,v_role,'run_of_show_deleted',jsonb_build_object('itemId',p_id));
end $$;
grant execute on function public.rye_delete_run_of_show(uuid,text,uuid) to anon,authenticated;
