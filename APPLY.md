# DEngine — Event Execution Intelligence rebuild

This package is designed as a drop-in replacement for the matching paths in `unikmo/Dengine`.

## What changed

### Product positioning
- Removed the blueprint-library-first identity.
- New core: **Event Execution Intelligence**.
- Primary value proposition: event brief + fixed date → execution architecture.
- The reference library remains available, but is explicitly secondary.

### Homepage
- New hero: **“Your event date is fixed. DEngine works backwards.”**
- Readiness / blocker preview.
- Event Execution Graph explanation.
- Backward-scheduling and change-propagation story.
- Professional event models rather than “400+ templates” as the moat.
- New capability-based pricing teaser.

### Event builder
- Rebuilt intake around:
  - fixed event date
  - attendance
  - objective
  - format
  - venue status
  - geography
  - team size
  - operating level
  - first-time context
- Autocomplete still uses the existing Supabase event reference library.
- Generation now always adapts an event profile rather than simply loading a static task list.

### Execution Graph output
Generated tasks now support:
- stable task IDs
- workstreams
- dependencies
- owners
- approval gates / approvers
- completion criteria
- completion evidence
- risk level
- consequence if missed
- contingency
- critical-path flag
- procurement category
- vendor-ready scope
- weeks before event
- target date

### Readiness
- Tasks can be completed in the UI.
- Critical-path tasks carry 3× readiness weight.
- Dashboard shows:
  - readiness
  - critical tasks open
  - approval gates open
  - high/critical risks

### Backward schedule change
- Moving the fixed event date recalculates target dates locally using `weeks_before_event`.
- Existing Gantt component is reused.

### Pricing
- Free preview
- $39 single execution plan
- Team / agency recurring layer shown as custom pricing

## Files to replace

- `app/page.tsx`
- `app/layout.tsx`
- `app/pricing/page.tsx`
- `app/browse/page.tsx`
- `app/custom/page.tsx`
- `app/globals.css`
- `types/index.ts`
- `lib/anthropic.ts`

## Existing files intentionally preserved

- `app/api/generate/route.ts`
- `components/GanttView.tsx`
- `lib/dates.ts`
- `lib/supabase.ts`
- Existing category / event detail routes
- Supabase event reference data

## Important implementation note

The GitHub connector available in this ChatGPT session returns:

`403 Resource not accessible by integration`

for all Git write operations, including the Contents API and Git Blob API. The repository itself is readable and the authenticated user has admin permissions, so the missing permission is at the GitHub App / OAuth scope level.

Once the GitHub integration has **Contents: Read and write** permission for `unikmo/Dengine`, these replacement files can be committed directly.

## Validation after applying

Run:

```bash
npm install
npm run build
```

Then test:
1. `/`
2. `/custom`
3. Generate a plan with a future event date
4. Switch Execution Graph / Backward Timeline / Risks + Approvals
5. Complete several tasks and confirm readiness changes
6. Move the event date and confirm target dates shift
7. `/pricing`
8. `/browse`

## Product caveat

This rebuild implements fixed-date deadline propagation. It does **not yet** implement a deterministic graph engine that automatically adds/removes tasks when attendance, venue or format changes after generation. Those changes currently require regeneration. That is the next technical layer and should not be marketed as fully automatic until implemented.
