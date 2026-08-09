-- Event Engine Schema
-- Run this in Supabase SQL Editor: supabase.com → your project → SQL Editor

-- ── EVENTS TABLE ──────────────────────────────────────────────────────────
create table if not exists events (
  id                uuid primary key default gen_random_uuid(),
  name              text not null unique,
  category          text not null,
  subcategory       text not null,
  scale             text not null check (scale in ('Intimate','Medium','Large','Mega')),
  blueprint         text not null,
  luxury_base       integer not null default 0 check (luxury_base between 0 and 5),
  complexity        integer not null default 3 check (complexity between 1 and 5),
  planning_weeks    integer not null default 2,
  description       text not null,
  key_dimensions    text[] not null default '{}',
  primary_cost      text,
  key_risks         text[] not null default '{}',
  intake_questions  text[] not null default '{}',
  has_tasks         boolean not null default false,
  created_at        timestamptz default now()
);

-- ── TASKS TABLE ───────────────────────────────────────────────────────────
create table if not exists tasks (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid references events(id) on delete cascade,
  slot                integer not null,
  layer               text not null check (layer in ('Promotion','Setup','Execution','Cleanup')),
  title               text not null,
  time_minutes        integer not null,
  who                 text not null,
  definition_of_done  text not null,
  unique(event_id, slot)
);

-- ── BLUEPRINTS TABLE (saved user blueprints) ──────────────────────────────
create table if not exists blueprints (
  id                  uuid primary key default gen_random_uuid(),
  share_code          text unique default substring(gen_random_uuid()::text, 1, 8),
  event_id            uuid references events(id),
  event_name          text not null,
  guest_count         integer,
  budget_level        integer default 0,
  is_first_time       boolean default false,
  is_volunteer_driven boolean default true,
  is_outdoor          boolean default false,
  custom_answers      jsonb default '{}',
  tasks               jsonb not null default '[]',
  claimed_tasks       jsonb not null default '{}',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ── CATEGORIES VIEW ───────────────────────────────────────────────────────
create or replace view categories as
select
  category as name,
  count(*) as event_count,
  count(*) filter (where has_tasks) as events_with_tasks
from events
group by category
order by category;

-- ── INDEXES ───────────────────────────────────────────────────────────────
create index if not exists idx_events_category on events(category);
create index if not exists idx_events_scale on events(scale);
create index if not exists idx_events_has_tasks on events(has_tasks);
create index if not exists idx_events_name_search on events using gin(to_tsvector('english', name || ' ' || description));
create index if not exists idx_tasks_event_id on tasks(event_id);
create index if not exists idx_blueprints_share_code on blueprints(share_code);

-- ── FULL-TEXT SEARCH FUNCTION ─────────────────────────────────────────────
create or replace function search_events(query text, cat text default null)
returns setof events
language sql
stable
as $$
  select * from events
  where
    (query is null or query = '' or
     to_tsvector('english', name || ' ' || description || ' ' || category) 
     @@ plainto_tsquery('english', query))
    and (cat is null or cat = '' or category = cat)
  order by
    case when query is not null and query != ''
      then ts_rank(
        to_tsvector('english', name || ' ' || description),
        plainto_tsquery('english', query)
      )
      else 0
    end desc,
    complexity asc,
    name asc;
$$;

-- ── ROW LEVEL SECURITY (public read, no auth needed for MVP) ──────────────
alter table events enable row level security;
alter table tasks enable row level security;
alter table blueprints enable row level security;

create policy "Events are publicly readable" on events for select using (true);
create policy "Tasks are publicly readable" on tasks for select using (true);
create policy "Blueprints are publicly readable" on blueprints for select using (true);
create policy "Anyone can create blueprints" on blueprints for insert with check (true);
create policy "Anyone can update blueprint claims" on blueprints for update using (true);
