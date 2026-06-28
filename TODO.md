# TODO
- [ ] Inspect `app/custom/page.tsx` for header/subtitle, event inputs, venue toggle, and budget tier rendering.
- [x] Implement UI updates:
  - [x] Change H1 text.
  - [x] Remove subtitle paragraph.
  - [x] Add optional context field under event name.
  - [x] Replace venue toggle with Indoor/Mixed/Outdoor and add `venue` state.
  - [ ] Replace budget tiers with new `BUDGET_OPTIONS` (levels 0-5), update grid to 6 columns, and update types/selection.
- [ ] Update `generate()` to include context in `intake.custom_answers` and map venue choice to `is_outdoor`.
- [ ] Update budget buttons/levels to include new Volunteer tier + level 0..5 and grid-cols-6.
- [ ] Run typecheck/lint/build (if available) to ensure app compiles.
- [ ] Commit + push with requested git command.

