create or replace function public.rye_replan_workspace_date(p_workspace_id uuid,p_access_hash text,p_new_event_date date)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_role text; v_old date; v_changed integer; v_delta integer;
begin
  v_role:=public.rye_role_for_hash(p_workspace_id,p_access_hash); if v_role not in ('owner','editor') then raise exception 'write access required'; end if;
  select event_date into v_old from public.rye_workspaces where id=p_workspace_id; if v_old is null then raise exception 'workspace not found'; end if;
  v_delta:=p_new_event_date-v_old;
  update public.rye_workspaces set event_date=p_new_event_date,updated_at=now() where id=p_workspace_id;
  update public.rye_workspace_tasks set target_date=case when target_date is null then null else target_date+v_delta end,baseline_target_date=case when baseline_target_date is null then null else baseline_target_date+v_delta end,updated_at=now() where workspace_id=p_workspace_id;
  get diagnostics v_changed=row_count;
  insert into public.rye_workspace_activity(workspace_id,actor,event_name,metadata) values(p_workspace_id,v_role,'event_date_replanned',jsonb_build_object('oldDate',v_old,'newDate',p_new_event_date,'deltaDays',v_delta,'tasksReplanned',v_changed));
  return jsonb_build_object('oldDate',v_old,'newDate',p_new_event_date,'deltaDays',v_delta,'tasksReplanned',v_changed);
end $$;
grant execute on function public.rye_replan_workspace_date(uuid,text,date) to anon,authenticated;
