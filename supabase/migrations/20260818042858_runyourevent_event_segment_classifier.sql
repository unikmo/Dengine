create or replace function public.rye_classify_event_segment(p_summary jsonb)
returns text language plpgsql immutable as $$
declare s text:=lower(coalesce(p_summary->>'name','')||' '||coalesce(p_summary->>'category','')||' '||coalesce(p_summary->>'objective',''));
begin
  if s ~ '(wedding|bride|groom|ceremony|reception)' then return 'weddings'; end if;
  if s ~ '(family reunion|family gathering|family homecoming|kinship reunion)' then return 'family_reunions'; end if;
  if s ~ '(birthday|baby shower|graduation|anniversary|class reunion)' then return 'secondary'; end if;
  if s ~ '(company|corporate|conference|customer|partner|executive|team retreat|workshop|training|product launch|grand opening|association|fundraising|gala|donor|business)' then return 'company'; end if;
  return 'other';
end $$;

create or replace function public.rye_set_draft_segment()
returns trigger language plpgsql as $$
begin
  if new.event_segment is null or new.event_segment='other' then new.event_segment:=public.rye_classify_event_segment(new.event_summary); end if;
  return new;
end $$;
drop trigger if exists trg_rye_set_draft_segment on public.dengine_plan_drafts;
create trigger trg_rye_set_draft_segment before insert or update of event_summary,event_segment on public.dengine_plan_drafts for each row execute function public.rye_set_draft_segment();
update public.dengine_plan_drafts set event_segment=public.rye_classify_event_segment(event_summary) where event_segment='other';
update public.dengine_orders o set event_segment=d.event_segment from public.dengine_plan_drafts d where o.draft_token=d.draft_token and o.event_segment='other';
update public.dengine_conversion_events c set event_segment=d.event_segment from public.dengine_plan_drafts d where c.draft_token=d.draft_token and c.event_segment='other';
