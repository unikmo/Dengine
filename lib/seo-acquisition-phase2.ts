import type { SeoAcquisitionConfig } from '@/lib/seo-acquisition'

export const SEO_PHASE2_PAGES:SeoAcquisitionConfig[]=[
  {
    slug:'destination-wedding-planning',
    metaTitle:'Destination Wedding Planning Checklist & Timeline | RunYourEvent',
    metaDescription:'Build a destination wedding execution plan for venue, guest travel, accommodation, vendors, legal requirements, transfers and the wedding-day Run of Show.',
    eyebrow:'Destination wedding planning',
    title:'Run the destination wedding as one event—not a wedding plan plus a separate travel spreadsheet',
    lead:'Coordinate venue, guests, travel, accommodation, local vendors, legal requirements and event-day logistics around the fixed wedding date.',
    intro:'Destination weddings create extra dependencies because guest arrivals, rooms, transfers, local supplier access and ceremony requirements must converge before the wedding can happen. RunYourEvent keeps travel inside the wedding execution model so late arrival data, room assumptions or vendor decisions visibly affect downstream work.',
    workstreams:['Venue & ceremony','Guest travel & arrivals','Accommodation & rooming','Local vendors & production','Legal documents & approvals','Transfers & wedding-day Run of Show'],
    steps:[
      {title:'Fix the destination operating model',body:'Confirm wedding date, ceremony location, reception venue, likely guest origins, accommodation approach and any local legal requirements.'},
      {title:'Build the arrival dependency chain',body:'Connect RSVP and travel information to rooms, transfers, welcome events, meal counts and accessibility requirements.'},
      {title:'Lock local supplier handoffs',body:'Give venue, planner, catering, production, transport and ceremony suppliers clear deliverables, approvals and deadlines.'},
      {title:'Run the destination sequence',body:'Coordinate arrivals, welcome moments, ceremony, transfers, reception and contingency cues from one Run of Show.'},
    ],
    outputs:['A destination-wedding checklist tied to the actual location and date','Guest arrival and rooming dependencies','Local-vendor scopes, owners and approval deadlines','Travel and transfer work integrated into the wedding plan','Completion criteria for legal, venue and supplier confirmations','A multi-location wedding-day Run of Show'],
    pitfalls:['Guest travel data arrives after transport and room commitments are due.','Local legal or ceremony requirements are treated as a late administrative task.','The planner, hotel and transport supplier work from different arrival assumptions.','Weather or transport disruption has no pre-agreed fallback sequence.'],
    faqs:[
      {q:'Does RunYourEvent book travel for a destination wedding?',a:'No. RunYourEvent coordinates the execution work around travel and accommodation; bookings remain with the couple, guests, planner or chosen travel providers.'},
      {q:'Can the plan include multiple wedding events?',a:'Yes. Welcome events, rehearsal activities, ceremony, reception, transfers and farewell events can all be represented in the execution plan and Run of Show.'},
      {q:'Why is travel not a separate RunYourEvent category?',a:'Because travel is valuable here as a dependency of the destination wedding. The product stays focused on the event that must be delivered.'},
    ]
  },
  {
    slug:'family-reunion-checklist',
    metaTitle:'Family Reunion Checklist With Owners & Timeline | RunYourEvent',
    metaDescription:'Use a family reunion checklist that assigns owners for travel, rooms, meals, activities, communications and reunion-day responsibilities.',
    eyebrow:'Family reunion checklist',
    title:'A family reunion checklist that distributes the work across the family',
    lead:'Turn the reunion checklist into clear responsibilities, deadlines and dependencies so one organizer is not chasing every household and every supplier.',
    intro:'The most useful family reunion checklist is not the longest one. It is the one that makes ownership explicit: who confirms households, who manages rooming, who owns meals, who runs activities and what each person must deliver before the reunion date.',
    workstreams:['Family outreach','Attendance & household data','Travel & accommodation','Meals & supplies','Activities & memories','On-site responsibilities'],
    steps:[
      {title:'Confirm households and attendance',body:'Create an accountable sequence for outreach, responses, household counts, accessibility needs and final attendance.'},
      {title:'Split the logistics',body:'Assign rooming, arrivals, meals, transport, supplies and activities to named family members rather than one central organizer.'},
      {title:'Connect counts to commitments',body:'Tie final attendance to accommodation, food quantities, transport capacity and activity reservations.'},
      {title:'Define event-day owners',body:'Give arrivals, meals, announcements, activities, photos, cleanup and departures explicit responsibility.'},
    ],
    outputs:['A reunion checklist structured by household and operating workstream','Named owners for family responsibilities','Attendance deadlines linked to rooms, meals and activities','Clear completion criteria for purchases and confirmations','Shared comments and status in the paid workspace','A simple reunion Run of Show for the gathering itself'],
    pitfalls:['Everyone agrees to help, but responsibilities remain verbal.','Final attendance changes without updating meal, room or transport assumptions.','Supplies are bought without a single inventory owner.','Event-day jobs are discovered only after relatives arrive.'],
    faqs:[
      {q:'What should be on a family reunion checklist?',a:'At minimum: attendance, communications, travel, accommodation, meals, activities, supplies, accessibility, event-day responsibilities and final confirmations. RunYourEvent adapts the exact work to the reunion rather than forcing one universal list.'},
      {q:'Can several relatives edit the plan?',a:'Yes. Paid workspaces support owner, editor and viewer roles, assignments, comments and status.'},
      {q:'Can we use the checklist for a multi-day reunion?',a:'Yes. Multi-day logistics and program moments can be included, with a Run of Show for the on-site sequence.'},
    ]
  },
  {
    slug:'nonprofit-event-planning',
    metaTitle:'Nonprofit Event Planning & Execution Software | RunYourEvent',
    metaDescription:'Build a nonprofit event execution plan for mission goals, venue, program, donors, sponsors, volunteers, suppliers, approvals and event-day delivery.',
    eyebrow:'Nonprofit event planning',
    title:'Give the nonprofit event the same execution discipline as the mission behind it',
    lead:'Turn mission goals, program, donors, sponsors, volunteers, venue and suppliers into one accountable plan with owners and deadlines.',
    intro:'Nonprofit events often operate with small teams, volunteer support and several stakeholder groups at once. The challenge is not just planning the event; it is coordinating mission, fundraising or community outcomes with approvals, sponsors, volunteers, suppliers and financial controls without losing accountability.',
    workstreams:['Mission & event outcomes','Venue & guest operations','Program & speakers','Donors, sponsors & partners','Volunteers & staffing','Finance, suppliers & compliance'],
    steps:[
      {title:'Define the mission outcome',body:'Clarify whether the event exists to raise funds, engage donors, serve a community, recruit supporters or deliver another measurable outcome.'},
      {title:'Separate stakeholder workstreams',body:'Give program, sponsors, donors, volunteers, venue and finance clear owners rather than managing everything through one committee.'},
      {title:'Protect approvals and controls',body:'Make sponsor commitments, financial approvals, permissions and critical deliverables visible before downstream spending or communications proceed.'},
      {title:'Operate the event',body:'Track volunteer readiness, supplier delivery, guest flow, program cues and contingencies through event day.'},
    ],
    outputs:['A nonprofit-specific execution model tied to the actual event objective','Owners across staff, board members, volunteers and suppliers','Sponsor, donor and program deliverables with deadlines','Approval and financial-control checkpoints','Volunteer responsibilities without pretending to be volunteer-management software','Live readiness and Run of Show for delivery'],
    pitfalls:['Volunteer enthusiasm substitutes for explicit ownership.','Sponsor promises are made before deliverables and approvals are operationally defined.','Program, fundraising and guest operations work in parallel without a shared critical path.','Financial or compliance checks happen after supplier commitments are already made.'],
    faqs:[
      {q:'Is RunYourEvent nonprofit event management software?',a:'It is an event execution platform that works for nonprofit events. It does not replace donor CRM, ticketing or fundraising-processing systems; it controls the work required to deliver the event.'},
      {q:'Can board members and volunteers collaborate?',a:'Yes. They can be invited as editors or viewers, assigned tasks and follow shared readiness and activity.'},
      {q:'Does it support fundraising events?',a:'Yes. Fundraising galas already exist in the reference library, and RunYourEvent can also generate custom nonprofit and charity event plans.'},
    ]
  },
  {
    slug:'volunteer-event-planning',
    metaTitle:'Volunteer Event Planning Checklist & Execution Plan | RunYourEvent',
    metaDescription:'Plan volunteer-led events with clear workstreams, owners, deadlines, handoffs, completion criteria and an event-day operating sequence.',
    eyebrow:'Volunteer-led event planning',
    title:'Turn a volunteer committee into an execution team without buying volunteer-management software',
    lead:'Give each workstream an owner, each commitment a deadline and each event-day responsibility a clear handoff.',
    intro:'Volunteer-led events fail differently from professionally staffed events. People are capable and motivated, but availability changes, commitments are informal and knowledge is distributed. RunYourEvent turns those commitments into a visible operating plan while staying out of volunteer scheduling, signup and workforce-management territory.',
    workstreams:['Committee governance','Venue & permissions','Program & activities','Supplies & suppliers','Volunteer-owned deliverables','Event-day handoffs'],
    steps:[
      {title:'Define committee roles',body:'Separate decision owners from task owners so the group knows who can approve and who must deliver.'},
      {title:'Convert promises into deliverables',body:'Record what each volunteer is actually producing, when it is due and what proves it is complete.'},
      {title:'Expose fragile dependencies',body:'Identify tasks that rely on one person, one supplier, one permission or one late decision.'},
      {title:'Prepare the live handoff plan',body:'Create exact event-day ownership for setup, arrivals, activities, announcements, safety, cleanup and closeout.'},
    ],
    outputs:['Committee workstreams with accountable owners','Volunteer commitments expressed as concrete deliverables','Approvals and permissions visible as gates','Backup contingencies for high-risk volunteer-owned items','Readiness tracking across the committee','Event-day Run of Show and handoffs'],
    pitfalls:['A volunteer says “I can help with that” but no deliverable or deadline is recorded.','One absent volunteer silently owns a critical dependency.','Committee meetings generate decisions that never become assigned tasks.','Event-day setup depends on people who do not know their exact arrival time or handoff.'],
    faqs:[
      {q:'Is RunYourEvent volunteer management software?',a:'No. It does not manage volunteer databases, shifts or signup forms. It manages the execution plan for an event being delivered by volunteers.'},
      {q:'Can volunteers be assigned tasks?',a:'Yes. Accepted workspace members can be assigned execution tasks, comment and update status according to their role.'},
      {q:'Can we create backup plans for volunteer no-shows?',a:'Professional execution plans can include risk and contingency detail, and the live workspace can expose blocked work and ownership gaps.'},
    ]
  },
  {
    slug:'sports-event-planning',
    metaTitle:'Sports Event Planning Checklist & Execution Software | RunYourEvent',
    metaDescription:'Build a sports event execution plan for venue, permits, competition operations, officials, participants, safety, suppliers and event-day control.',
    eyebrow:'Sports event planning',
    title:'Build the operating plan behind the sports event—not just the competition schedule',
    lead:'Coordinate venue readiness, permits, participants, officials, equipment, safety, suppliers and the live event sequence from one execution plan.',
    intro:'A sports event has a competition schedule, but successful delivery depends on much more: venue access, field or course readiness, officials, equipment, participant communications, medical and safety plans, suppliers, volunteers and crowd flow. RunYourEvent connects those operational dependencies around the fixed event date.',
    workstreams:['Venue, course or field readiness','Participants & communications','Officials & competition operations','Equipment & suppliers','Safety, medical & permissions','Event-day operations'],
    steps:[
      {title:'Define the event format',body:'Set date, venue, participant scale, competition structure, public access and any governing-body requirements.'},
      {title:'Protect venue and safety readiness',body:'Make permissions, inspections, medical provision, equipment and course/field setup explicit dependencies.'},
      {title:'Coordinate people and equipment',body:'Connect officials, volunteers, suppliers and participant communications to the operational timeline.'},
      {title:'Run the live sequence',body:'Use the Run of Show for access, setup, briefings, competition blocks, awards, incidents and teardown.'},
    ],
    outputs:['A sports-event execution checklist beyond the fixture or competition schedule','Venue and safety dependencies with accountable owners','Officials, volunteers and supplier deliverables','Equipment and setup completion criteria','Risk and contingency visibility for critical operations','A live Run of Show for event-day control'],
    pitfalls:['Competition times are published before venue and operational dependencies are secure.','Medical, safety or permission work is treated as an isolated compliance task.','Equipment ownership is unclear between organizer, venue and suppliers.','Setup, participant arrival and official briefings collide because event-day handoffs were not sequenced.'],
    faqs:[
      {q:'Does RunYourEvent handle tournament registration?',a:'No. Registration, brackets and scoring belong in specialist sports systems. RunYourEvent manages the operational work required to deliver the event.'},
      {q:'Can it support charity races or community tournaments?',a:'Yes. The execution model can include charity, volunteer, sponsor, community and sports-specific workstreams as required by the event.'},
      {q:'Can safety tasks be marked as critical?',a:'Yes. Generated Professional plans can identify risk and critical-path work, and the workspace tracks readiness and blockers.'},
    ]
  },
  {
    slug:'birthday-party-planning-checklist',
    metaTitle:'Birthday Party Planning Checklist With Timeline | RunYourEvent',
    metaDescription:'Build a birthday party planning checklist around the actual date, venue, guests, food, entertainment, suppliers and event-day responsibilities.',
    eyebrow:'Birthday party planning checklist',
    title:'Use a birthday checklist that fits the actual party—not every party on the internet',
    lead:'Turn venue, guests, food, entertainment, decorations, suppliers and day-of responsibilities into a right-sized execution plan.',
    intro:'Milestone birthdays can involve the same execution problems as larger events: venue deadlines, guest counts, entertainment, catering, transport, speeches, surprises and family responsibilities. RunYourEvent keeps the plan proportional to the event instead of burying the organizer in a generic mega-checklist.',
    workstreams:['Venue & setup','Guests & invitations','Food & drinks','Entertainment & program','Decor, cake & suppliers','Party-day responsibilities'],
    steps:[
      {title:'Fix the party format',body:'Set date, venue, guest scale, style, key program moments and any surprise or accessibility requirements.'},
      {title:'Sequence guest and supplier decisions',body:'Connect RSVPs to catering, seating, transport and quantities while protecting supplier deadlines.'},
      {title:'Assign family and friend responsibilities',body:'Give setup, cake, speeches, photos, transport and gifts explicit owners where relevant.'},
      {title:'Run the party day',body:'Build a simple sequence for setup, guest arrival, food, entertainment, speeches, cake and closeout.'},
    ],
    outputs:['A right-sized birthday-party checklist','Owners for organizer, family, friends and suppliers','RSVP and supplier deadlines linked to the event date','Completion criteria for venue, catering and entertainment confirmations','Shared execution status for larger milestone parties','A simple party-day Run of Show'],
    pitfalls:['Guest counts change after catering and seating assumptions are committed.','Entertainment, speeches and cake timing conflict on the day.','Family members agree to bring critical items without a visible owner or deadline.','Setup tasks are discovered only when venue access begins.'],
    faqs:[
      {q:'Is RunYourEvent only for large events?',a:'No. Essential is designed to produce complete but right-sized plans for straightforward events, including milestone birthdays.'},
      {q:'Can I use it for a surprise birthday?',a:'Yes. The event brief can include secrecy, restricted communications and special handoffs where relevant.'},
      {q:'Do I need a subscription?',a:'Single-event plans are priced per event; a subscription is not required for the standard single-event flow.'},
    ]
  },
  {
    slug:'graduation-party-planning-checklist',
    metaTitle:'Graduation Party Planning Checklist & Timeline | RunYourEvent',
    metaDescription:'Build a graduation party checklist for venue, guests, food, school timing, decor, entertainment, family responsibilities and event-day execution.',
    eyebrow:'Graduation party planning checklist',
    title:'Build the graduation party around the ceremony, guest flow and fixed date',
    lead:'Coordinate venue, invitations, food, decor, entertainment, family responsibilities and the graduation-day sequence without losing the dependencies between them.',
    intro:'Graduation celebrations often sit around a school or university ceremony that the organizer cannot control. That makes timing, transport, guest arrival, venue access and catering especially dependent on a fixed external schedule. RunYourEvent works backwards from the celebration date and the ceremony constraints.',
    workstreams:['Ceremony timing & transport','Venue & setup','Guests & invitations','Food & hospitality','Decor, photos & memories','Celebration-day operations'],
    steps:[
      {title:'Anchor the ceremony constraints',body:'Record ceremony time, travel or parking assumptions, venue access and the earliest realistic party start.'},
      {title:'Build the guest sequence',body:'Coordinate invitations, RSVPs, arrival windows and any overlap between ceremony guests and party guests.'},
      {title:'Lock hospitality and setup',body:'Connect headcount to food, seating, rentals, decor, cake and supplier deadlines.'},
      {title:'Prepare the celebration day',body:'Assign transport, setup, food, photos, speeches, gifts, cleanup and any surprise moments.'},
    ],
    outputs:['A graduation-specific checklist tied to ceremony timing','Guest and catering deadlines linked to the fixed celebration date','Owners for family setup and day-of responsibilities','Supplier and venue completion criteria','Contingencies for ceremony overruns or weather','A simple celebration Run of Show'],
    pitfalls:['The party start time ignores realistic travel from the ceremony.','Guest counts remain fluid after food and rental deadlines.','Setup access conflicts with family attendance at the ceremony.','Outdoor plans have no weather fallback with equivalent capacity.'],
    faqs:[
      {q:'Can RunYourEvent plan around a graduation ceremony?',a:'Yes. The ceremony can be treated as a fixed external dependency that constrains transport, setup and party timing.'},
      {q:'Can it handle an open-house graduation party?',a:'Yes. The plan can reflect a longer guest-arrival window, food replenishment, parking and flexible program requirements.'},
      {q:'Can family members share responsibilities?',a:'Yes. Paid workspaces support collaborators, assignments, comments and live status.'},
    ]
  }
]
