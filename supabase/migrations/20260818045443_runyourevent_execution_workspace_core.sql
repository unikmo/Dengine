create table if not exists public.rye_workspaces (
  id uuid primary key default gen_random_uuid(), draft_token uuid unique not null, name text not null, event_date date,
  tier text not null check (tier in ('essential','professional')),
  event_segment text not null default 'other' check (event_segment in ('company','weddings','family_reunions','secondary','other')),
  status text not null default 'active' check (status in ('active','archived')), owner_access_hash text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.rye_workspace_members (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.rye_workspaces(id) on delete cascade,
  name text not null, email text, role text not null check (role in ('owner','editor','viewer')), access_hash text unique not null,
  accepted_at timestamptz, created_at timestamptz not null default now()
);
create index if not exists idx_rye_members_workspace on public.rye_workspace_members(workspace_id);
create table if not exists public.rye_workspace_tasks (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.rye_workspaces(id) on delete cascade,
  source_task_id text not null, sort_order integer not null default 0, layer text, workstream text not null default 'Event Operations',
  title text not null, description text, owner_member_id uuid references public.rye_workspace_members(id) on delete set null, owner_label text,
  target_date date, baseline_target_date date, weeks_before_event integer, depends_on jsonb not null default '[]'::jsonb,
  approval_required boolean not null default false, approver text, completion_criteria text, evidence_required text, evidence_note text,
  risk_level text, risk_if_missed text, contingency text, critical_path boolean not null default false,
  procurement_category text, vendor_scope text,
  status text not null default 'not_started' check (status in ('not_started','in_progress','blocked','awaiting_approval','done')),
  blocked_reason text, completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(workspace_id,source_task_id)
);
create index if not exists idx_rye_tasks_workspace_status on public.rye_workspace_tasks(workspace_id,status);
create index if not exists idx_rye_tasks_workspace_target on public.rye_workspace_tasks(workspace_id,target_date);
create table if not exists public.rye_task_comments (
  id bigint generated always as identity primary key, workspace_id uuid not null references public.rye_workspaces(id) on delete cascade,
  task_id uuid not null references public.rye_workspace_tasks(id) on delete cascade, author_name text not null, body text not null, created_at timestamptz not null default now()
);
create index if not exists idx_rye_comments_task on public.rye_task_comments(task_id,created_at);
create table if not exists public.rye_run_of_show (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.rye_workspaces(id) on delete cascade,
  sort_order integer not null default 0, start_time time, duration_minutes integer not null default 15 check (duration_minutes between 0 and 1440),
  cue text not null, owner_label text, location text, source_task_id text, technical_cue text, contingency text, notes text,
  status text not null default 'planned' check (status in ('planned','ready','live','complete','at_risk')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists idx_rye_ros_workspace_order on public.rye_run_of_show(workspace_id,sort_order,start_time);
create table if not exists public.rye_workspace_activity (
  id bigint generated always as identity primary key, workspace_id uuid not null references public.rye_workspaces(id) on delete cascade,
  actor text, event_name text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index if not exists idx_rye_activity_workspace_created on public.rye_workspace_activity(workspace_id,created_at desc);
alter table public.rye_workspaces enable row level security;
alter table public.rye_workspace_members enable row level security;
alter table public.rye_workspace_tasks enable row level security;
alter table public.rye_task_comments enable row level security;
alter table public.rye_run_of_show enable row level security;
alter table public.rye_workspace_activity enable row level security;
revoke all on public.rye_workspaces from anon,authenticated;
revoke all on public.rye_workspace_members from anon,authenticated;
revoke all on public.rye_workspace_tasks from anon,authenticated;
revoke all on public.rye_task_comments from anon,authenticated;
revoke all on public.rye_run_of_show from anon,authenticated;
revoke all on public.rye_workspace_activity from anon,authenticated;
create or replace function public.rye_role_for_hash(p_workspace_id uuid,p_access_hash text)
returns text language plpgsql security definer set search_path=public as $$
declare v_role text;
begin
  select 'owner' into v_role from public.rye_workspaces w where w.id=p_workspace_id and w.owner_access_hash=p_access_hash;
  if v_role is not null then return v_role; end if;
  select m.role into v_role from public.rye_workspace_members m where m.workspace_id=p_workspace_id and m.access_hash=p_access_hash and m.accepted_at is not null limit 1;
  return v_role;
end $$;
revoke all on function public.rye_role_for_hash(uuid,text) from public,anon,authenticated;
