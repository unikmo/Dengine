export type SeoAcquisitionConfig={
  slug:string
  metaTitle:string
  metaDescription:string
  eyebrow:string
  title:string
  lead:string
  intro:string
  workstreams:string[]
  steps:{title:string;body:string}[]
  outputs:string[]
  pitfalls:string[]
  cta?:string
  faqs:{q:string;a:string}[]
}

export const SEO_ACQUISITION_PAGES:SeoAcquisitionConfig[]=[
  {
    slug:'company-event-planning',
    metaTitle:'Company Event Planning & Execution Software | RunYourEvent',
    metaDescription:'Build the complete execution plan for a company or corporate event: workstreams, owners, deadlines, dependencies, approvals, risks and Run of Show.',
    eyebrow:'Company and corporate events',
    title:'Build the complete execution plan for your company event',
    lead:'Enter your event and fixed date. RunYourEvent creates the workstreams, owners, deadlines, dependencies and completion criteria required to deliver it.',
    intro:'Company event planning becomes difficult when venue, program, speakers, production, registration, suppliers and approvals move on different timelines. RunYourEvent converts those moving parts into one execution model and keeps the team working from the same sequence.',
    workstreams:['Venue & logistics','Program & speakers','Registration & guest experience','Production & AV','Commercial, vendors & approvals','Event-day operations'],
    steps:[
      {title:'Fix the outcome and date',body:'Define what the event must achieve, the delivery date, audience size, location and operating constraints.'},
      {title:'Build the workstreams',body:'Separate venue, content, production, guests, suppliers and internal approvals into accountable streams.'},
      {title:'Connect dependencies',body:'Show what must be approved or completed before downstream work such as AV ordering, content lock or rehearsals can move.'},
      {title:'Operate to readiness',body:'Assign owners, track blockers, replan slips and run the event-day sequence from the live workspace.'},
    ],
    outputs:['A right-sized task graph rather than a generic corporate-event checklist','Named owners and completion criteria for every execution item','Backward deadlines calculated from the fixed event date','Dependencies, approvals and critical-path exposure','Professional risk, contingency and vendor-scope detail where required','A live workspace and editable Run of Show after purchase'],
    pitfalls:['Venue decisions arrive late and silently block production, signage or guest operations.','Content and executive approvals remain in inboxes instead of becoming visible gates.','Supplier lead times are treated as isolated tasks rather than dependencies.','The team reaches event week with activity everywhere but no objective readiness view.'],
    faqs:[
      {q:'Is RunYourEvent corporate event planning software?',a:'RunYourEvent is an event execution platform. It supports company and corporate event planning intent, but its core job is to turn the event into an executable operating model with ownership, dependencies, deadlines, completion criteria and live execution control.'},
      {q:'What company events does it support?',a:'The current reference library includes customer conferences, executive retreats, partner summits, product launches, grand openings, training programs, association conferences and related custom company events.'},
      {q:'Can a team collaborate on the plan?',a:'Yes. Paid plans can become live workspaces with owner, editor and viewer roles, task assignment, comments, evidence, readiness tracking and Run of Show.'},
      {q:'What happens if the event date changes?',a:'The workspace can replan the schedule when the event date changes while preserving manual timing adjustments and exposing downstream impact.'},
    ]
  },
  {
    slug:'event-planning-checklist',
    metaTitle:'Event Planning Checklist That Becomes an Execution Plan | RunYourEvent',
    metaDescription:'Use an event planning checklist that goes beyond boxes: workstreams, owners, deadlines, dependencies, completion criteria, risks and live readiness.',
    eyebrow:'Event planning checklist',
    title:'An event planning checklist that shows what depends on what',
    lead:'Start with the familiar checklist idea, then turn it into an operating plan with owners, deadlines, dependencies and a clear definition of done.',
    intro:'Most event checklists are static lists. They are useful for remembering work, but they do not tell you what becomes blocked when something slips. RunYourEvent structures checklist items as connected execution tasks so timing and accountability stay visible.',
    workstreams:['Venue & logistics','Guests & communications','Program & content','Vendors & procurement','Production & setup','Event-day operations'],
    steps:[
      {title:'Capture all required outcomes',body:'List what must become true for the event to be ready, not just what someone should remember to do.'},
      {title:'Define done',body:'Give each item completion criteria and evidence so “finished” means the same thing to everyone.'},
      {title:'Sequence the work',body:'Connect dependencies and backward dates so upstream delays reveal their actual downstream effect.'},
      {title:'Track readiness',body:'Move items through not started, in progress, blocked, awaiting approval and done while overall readiness updates.'},
    ],
    outputs:['Complete event workstreams instead of one long checklist','Every item tied to an accountable owner','Target dates anchored to event day','Dependency links between related tasks','Completion criteria and evidence requirements','Live status, blockers and readiness after purchase'],
    pitfalls:['A checklist contains everything but does not identify the critical chain.','Tasks are checked off without proving the required output exists.','Multiple people assume someone else owns the same item.','Late tasks remain isolated even when they endanger downstream delivery.'],
    faqs:[
      {q:'Can I use RunYourEvent as an event planning checklist?',a:'Yes. The free preview and paid plans can serve the checklist need, but RunYourEvent adds owners, deadlines, dependencies, completion criteria and live readiness so the checklist becomes operational.'},
      {q:'Is the checklist the same for every event?',a:'No. RunYourEvent right-sizes the work to the event type, scale, fixed date, venue status, team and operating context instead of forcing every event into the same template.'},
      {q:'Can I update checklist items after generating the plan?',a:'Yes. In the live workspace you can change status, owner, evidence and target dates, and dependency-aware replanning can move downstream tasks.'},
    ]
  },
  {
    slug:'event-planning-template',
    metaTitle:'Event Planning Template With Owners, Tasks & Timeline | RunYourEvent',
    metaDescription:'Start from an event planning template, then generate the event-specific workstreams, tasks, owners, dependencies and deadlines your event actually needs.',
    eyebrow:'Event planning template',
    title:'Start with a template. Finish with an event-specific execution model.',
    lead:'Use structured event references as a starting point, then adapt the work to your date, scale, venue status, team and operating reality.',
    intro:'A downloadable event planning template is usually generic by design. RunYourEvent uses structured reference models to establish the operating logic, then generates a right-sized plan around the specific event instead of leaving the user to delete half the template and invent the missing half.',
    workstreams:['Reference event model','Event-specific workstreams','Tasks & deliverables','Owners & approvals','Dependencies & timing','Risks & Run of Show'],
    steps:[
      {title:'Choose the event context',body:'Begin with the type of event and its operating characteristics rather than a blank spreadsheet.'},
      {title:'Adapt to reality',body:'Apply the fixed date, scale, location, venue status, team size, budget level and special constraints.'},
      {title:'Generate the execution graph',body:'Create only the tasks and workstreams that are useful for this event, with the dependencies between them.'},
      {title:'Operate the plan',body:'Move from generated template to live workspace, assignment, readiness and event-day execution.'},
    ],
    outputs:['Structured reference models instead of an empty page','Event-specific workstreams and task depth','Backward-scheduled dates from the actual event day','Clear ownership, approvals and completion criteria','Dependencies that show the operating sequence','A persistent plan that can continue into live execution'],
    pitfalls:['A generic template creates false completeness because it looks thorough but misses event-specific constraints.','Teams spend time deleting irrelevant rows instead of identifying genuine dependencies.','Spreadsheet templates rarely change downstream dates when one assumption moves.','Static templates stop being useful once the event enters active execution.'],
    faqs:[
      {q:'Does RunYourEvent provide event planning templates?',a:'Yes, through structured event reference models and generated plans. The goal is not simply to download a static file; it is to produce the event-specific execution model that the template is supposed to help create.'},
      {q:'Can I still start without a matching template?',a:'Yes. Custom events can be generated from the event description and operating context even when there is no exact reference model.'},
      {q:'Are templates included in the free preview?',a:'The preview shows enough of the generated execution structure to judge whether RunYourEvent understands the event before purchasing the complete plan.'},
    ]
  },
  {
    slug:'event-planning-timeline',
    metaTitle:'Event Planning Timeline & Backward Scheduling | RunYourEvent',
    metaDescription:'Build an event planning timeline backwards from the fixed event date, with dependencies, owners, buffers and automatic replanning when dates change.',
    eyebrow:'Event planning timeline',
    title:'Build your event timeline backwards from the date that cannot move',
    lead:'RunYourEvent turns the fixed event date into target dates for the work that must happen before it—and shows which dates depend on earlier decisions.',
    intro:'The event day is a hard endpoint. A useful event planning timeline therefore works backwards from that date while respecting venue, supplier, approval, content and production dependencies. RunYourEvent builds that logic into the plan rather than treating dates as unrelated reminders.',
    workstreams:['Fixed event date','Milestones & approvals','Supplier lead times','Task dependencies','Critical-path buffers','Event-day sequence'],
    steps:[
      {title:'Anchor the event date',body:'Start with the fixed delivery date and the actual constraints surrounding it.'},
      {title:'Estimate realistic lead times',body:'Schedule each necessary action at the point where it can still support downstream work.'},
      {title:'Respect dependencies',body:'Do not schedule work merely by preference; connect tasks that require earlier decisions or deliverables.'},
      {title:'Replan deliberately',body:'When the event or task date changes, shift affected work and show how much buffer remains.'},
    ],
    outputs:['Actual target dates rather than vague “months before” guidance','Weeks-before-event logic preserved for generated tasks','Dependency-aware movement of downstream tasks','Manual task adjustments preserved when the whole event moves','Critical-path visibility for high-consequence timing','Run of Show timing for event-day execution'],
    pitfalls:['Deadlines are selected independently even though the work is causally connected.','A late approval consumes buffer without changing the visible plan.','Changing the event date requires manually editing dozens of spreadsheet rows.','A timeline looks complete but does not distinguish flexible work from the critical path.'],
    faqs:[
      {q:'Can RunYourEvent create an event planning timeline?',a:'Yes. Generated tasks can receive target dates calculated backwards from the fixed event date, and the paid workspace supports later replanning.'},
      {q:'What happens when one task date moves?',a:'The workspace can recursively identify downstream dependent tasks and shift their target dates, while completed work remains undisturbed.'},
      {q:'Does changing the event date overwrite my manual adjustments?',a:'No. The event-date replan shifts the existing operating plan by the same date delta so manual adjustments are preserved.'},
    ]
  },
  {
    slug:'wedding-planning-checklist',
    metaTitle:'Wedding Planning Checklist With Timeline & Owners | RunYourEvent',
    metaDescription:'Build a wedding planning checklist around your actual date, venue, vendors and people—with owners, deadlines, dependencies and a live wedding-day Run of Show.',
    eyebrow:'Wedding planning checklist',
    title:'Build the wedding checklist around your actual date—not a generic countdown',
    lead:'Turn the wedding into clear workstreams for venue, ceremony, guests, vendors, logistics and the wedding-day sequence, with every responsibility and deadline visible.',
    intro:'Wedding checklists are often long because they try to serve every wedding. RunYourEvent instead starts from the couple’s actual date and operating context, then structures what this wedding needs—including the handoffs between venue, vendors, guest decisions and the day-of timeline.',
    workstreams:['Venue & ceremony','Guests & invitations','Catering & hospitality','Vendors & production','Travel & accommodation where relevant','Wedding-day Run of Show'],
    steps:[
      {title:'Lock the non-negotiables',body:'Start with date, venue status, guest scale, ceremony/reception structure and major constraints.'},
      {title:'Separate responsibilities',body:'Turn venue, guests, vendors, logistics and family responsibilities into visible workstreams and owners.'},
      {title:'Sequence vendor decisions',body:'Connect guest counts, layouts, menu, production, transport and final confirmations to the decisions they depend on.'},
      {title:'Build the wedding day',body:'Use the Run of Show for exact cues, owners, locations, handoffs and contingencies.'},
    ],
    outputs:['A wedding-specific execution plan rather than a universal checklist','Owners for couple, family, planner or vendor responsibilities','Deadline sequence tied to the wedding date','Dependencies between guest, venue and supplier decisions','Completion criteria for important confirmations and deliverables','Editable wedding-day Run of Show'],
    pitfalls:['Vendor bookings are tracked, but the decisions those vendors need are not.','Family responsibilities are agreed verbally and become ambiguous close to the date.','The guest-count deadline is disconnected from catering, seating and print quantities.','The day-of timeline exists separately from the preparation work that makes it possible.'],
    faqs:[
      {q:'Is RunYourEvent a wedding planning app?',a:'RunYourEvent is an event execution platform that can be used for weddings. It focuses on the operating plan, owners, deadlines, dependencies and day-of execution rather than inspiration, vendor marketplaces or wedding websites.'},
      {q:'Does it replace a wedding planner?',a:'No. It can give a couple or planner a structured execution model and shared workspace, but it does not replace professional judgment, vendor relationships or on-site services.'},
      {q:'Can family members collaborate?',a:'Yes. A paid wedding workspace can invite editors or viewers, assign tasks and keep comments, evidence, readiness and Run of Show in one place.'},
    ]
  },
  {
    slug:'wedding-planning-timeline',
    metaTitle:'Wedding Planning Timeline Built Backwards From Your Date | RunYourEvent',
    metaDescription:'Create a wedding planning timeline backwards from the wedding date, with venue, vendor, guest and production dependencies plus automatic replanning.',
    eyebrow:'Wedding planning timeline',
    title:'Build the wedding timeline backwards from the day that cannot slip',
    lead:'Start with the wedding date. RunYourEvent works backwards into the decisions, vendor deadlines, guest milestones and final handoffs required before that day.',
    intro:'A useful wedding timeline is not just a month-by-month list. Venue layout affects rentals and production; guest counts affect catering and seating; vendor deliverables depend on approvals. RunYourEvent makes those relationships explicit and recalculates affected dates when plans change.',
    workstreams:['Date & venue milestones','Guest deadlines','Vendor decisions','Design & production','Final confirmations','Wedding-day cues'],
    steps:[
      {title:'Set the wedding date',body:'Use the fixed date as the anchor for all upstream work and required buffers.'},
      {title:'Map decision deadlines',body:'Identify when guest, menu, layout, supplier and production decisions must be complete.'},
      {title:'Connect the handoffs',body:'Show which downstream vendor or logistics tasks depend on each earlier approval.'},
      {title:'Protect event week',body:'Replan changes early enough to preserve final confirmation and wedding-day preparation buffers.'},
    ],
    outputs:['Target dates tied to the real wedding day','Vendor and guest deadlines connected to dependencies','Visibility into which late decisions threaten other work','Manual schedule changes preserved during replanning','Live readiness across the wedding workstreams','Exact wedding-day Run of Show'],
    pitfalls:['Generic timelines assume lead times that do not match the actual venue or suppliers.','Guest decisions are late but their impact on seating, catering and transport is not visible.','Couples move the date and then manually reconstruct the planning schedule.','Final-week tasks are overloaded because earlier decisions did not have protected deadlines.'],
    faqs:[
      {q:'How far in advance should wedding planning start?',a:'There is no single correct answer for every wedding. RunYourEvent uses the actual event context and fixed date to right-size the work and schedule it backwards instead of assuming one universal planning period.'},
      {q:'Can I change the wedding date later?',a:'Yes. The paid workspace can shift the existing schedule by the change in event date while preserving manual adjustments.'},
      {q:'Can I adjust one vendor deadline without moving everything?',a:'Yes. A task date can be changed individually; only its downstream dependency chain needs to move.'},
    ]
  },
  {
    slug:'family-reunion-planning',
    metaTitle:'Family Reunion Planning Checklist & Timeline | RunYourEvent',
    metaDescription:'Plan and run a family reunion with clear owners for travel, accommodation, meals, activities, communications and the reunion-day schedule.',
    eyebrow:'Family reunion planning',
    title:'Coordinate the reunion without making one person carry the entire event',
    lead:'Turn travel, accommodation, meals, activities, communications and family responsibilities into one visible operating plan with owners and deadlines.',
    intro:'Family reunions combine event logistics with distributed family decision-making. The hidden difficulty is not simply remembering tasks—it is getting relatives to own work, resolving travel and accommodation dependencies, and keeping the program coherent once people arrive.',
    workstreams:['Family communications','Travel & arrivals','Accommodation','Meals & hospitality','Activities & program','Reunion-day operations'],
    steps:[
      {title:'Set date, place and scale',body:'Establish the reunion dates, location, expected households and major travel assumptions.'},
      {title:'Give families real ownership',body:'Assign accommodation, meals, activities, transport and communications instead of relying on one organizer.'},
      {title:'Connect logistics',body:'Tie headcounts and arrival information to rooms, transport, meals and activity capacity.'},
      {title:'Run the gathering',body:'Use a clear sequence for arrivals, meals, activities, announcements and handoffs during the reunion.'},
    ],
    outputs:['A family-reunion checklist adapted to the actual gathering','Named owners for family responsibilities','Arrival, room, meal and activity dependencies','Deadlines tied to the fixed reunion dates','Shared status and comments for collaborators','A simple Run of Show for the reunion program'],
    pitfalls:['One organizer becomes the default owner of every unresolved item.','Travel details arrive late and affect rooms, transport and meal counts.','Family volunteers agree to help but there is no shared definition of what “done” means.','The reunion schedule is created late and conflicts with logistics already booked.'],
    faqs:[
      {q:'Can RunYourEvent handle a multi-day family reunion?',a:'Yes. The event context can include travel, accommodation, meals, activities and multi-day operating requirements; the workspace then tracks the execution work.'},
      {q:'Can relatives be assigned specific responsibilities?',a:'Yes. Collaborators can join as editors or viewers, and tasks can be assigned to accepted workspace members.'},
      {q:'Is travel a separate RunYourEvent product?',a:'No. Travel is included when it is part of the actual event—such as a family reunion, destination wedding, company retreat or conference.'},
    ]
  },
  {
    slug:'class-reunion-planning',
    metaTitle:'Class Reunion Planning Checklist & Timeline | RunYourEvent',
    metaDescription:'Organize a class reunion with an execution plan for alumni outreach, venue, ticketing decisions, program, vendors, volunteers and event-day delivery.',
    eyebrow:'Class reunion planning',
    title:'Turn the class reunion committee into an execution team',
    lead:'Organize alumni outreach, venue, attendance assumptions, program, vendors and volunteer responsibilities around one fixed reunion date.',
    intro:'Class reunions are often run by volunteer committees with incomplete contact data and uncertain attendance. That makes ownership and decision timing more important than another generic checklist. RunYourEvent gives the committee one execution structure for what must happen and when.',
    workstreams:['Alumni outreach','Attendance & communications','Venue & hospitality','Program & memories','Vendors & finance','Event-day volunteers'],
    steps:[
      {title:'Establish the reunion model',body:'Fix the date, location, expected class size, event format and the assumptions that drive venue and cost decisions.'},
      {title:'Build the outreach sequence',body:'Separate alumni discovery, invitations, responses and final attendance deadlines.'},
      {title:'Assign committee ownership',body:'Give venue, communications, program, finance, vendors and event-day roles accountable owners.'},
      {title:'Lock the final operating plan',body:'Connect final headcount, seating, food, program and volunteer handoffs to the deadlines they depend on.'},
    ],
    outputs:['Committee workstreams with named accountability','Outreach and attendance milestones','Venue and vendor deadlines connected to headcount','Program and memory-content deliverables','Volunteer task ownership and completion criteria','Event-day Run of Show for arrivals, program and handoffs'],
    pitfalls:['The committee works hard but several people duplicate the same outreach.','Attendance remains uncertain too long for venue and catering commitments.','Program content is collected without deadlines or a clear final owner.','Volunteer jobs are discussed in meetings but not assigned in the operating plan.'],
    faqs:[
      {q:'Is this class reunion software?',a:'RunYourEvent is not a dedicated alumni database or ticketing platform. It provides the execution plan and workspace for the committee running the reunion.'},
      {q:'Can we track alumni registrations in RunYourEvent?',a:'RunYourEvent can track the work required to manage attendance, but it is not currently a registration or ticketing system. Registration data can remain in the tool chosen by the committee.'},
      {q:'Can a volunteer committee share the plan?',a:'Yes. The workspace supports owner, editor and viewer roles, assignments, comments, status and readiness.'},
    ]
  },
  {
    slug:'company-retreat-planning',
    metaTitle:'Company Retreat Planning & Execution Software | RunYourEvent',
    metaDescription:'Build a company retreat execution plan for venue, travel, accommodation, agenda, facilitation, hospitality, confidentiality and contingencies.',
    eyebrow:'Company retreat planning',
    title:'Run the retreat as an operating plan—not a collection of bookings',
    lead:'Coordinate venue, travel, accommodation, agenda, facilitation, hospitality and executive decisions around one retreat date and one accountable plan.',
    intro:'Company retreats have fewer attendees than conferences but often higher expectations per person. Travel, accommodation, executive availability, confidential content, facilitation and hospitality must converge on the same dates. RunYourEvent connects those streams and exposes conflicts early.',
    workstreams:['Venue & accommodation','Travel & arrivals','Agenda & facilitation','Executive inputs','Hospitality & activities','Confidentiality & contingency'],
    steps:[
      {title:'Define the retreat outcome',body:'Clarify the business objective, attendees, fixed dates, location and the decisions the retreat must produce.'},
      {title:'Coordinate travel and venue',body:'Connect flight/rail assumptions, rooming, transfers, arrival windows and venue readiness.'},
      {title:'Protect the agenda',body:'Give content owners, facilitators and executives clear deadlines for inputs, pre-work and approvals.'},
      {title:'Build contingencies',body:'Prepare for travel disruption, agenda changes, absent participants and confidentiality risks before departure.'},
    ],
    outputs:['A retreat-specific execution graph based on real operating dimensions','Travel, accommodation and venue dependencies','Agenda owners, inputs and approval milestones','Hospitality and activity workstreams','Risk and contingency detail for professional plans','A live workspace and retreat Run of Show'],
    pitfalls:['Travel is booked before arrival windows and transfer assumptions are coordinated.','Agenda sessions depend on executive inputs that have no protected deadlines.','Confidentiality requirements are treated as an afterthought.','Weather or travel disruption has no operational fallback plan.'],
    faqs:[
      {q:'Does RunYourEvent have a company retreat model?',a:'Yes. Executive Retreat is one of the current structured reference events, with venue, travel, agenda, facilitation, hospitality, confidentiality and contingency dimensions.'},
      {q:'Can the retreat plan include travel?',a:'Yes. Travel belongs inside the retreat execution model because it is an operational dependency of the event, not a separate RunYourEvent category.'},
      {q:'Can we use it for an offsite?',a:'Yes. A company offsite can be generated as a custom company event using the same date-driven execution logic.'},
    ]
  },
  {
    slug:'event-execution-plan',
    metaTitle:'What Is an Event Execution Plan? | RunYourEvent',
    metaDescription:'See how an event execution plan connects workstreams, tasks, owners, deadlines, dependencies, approvals, risks, completion criteria and Run of Show.',
    eyebrow:'Event execution plan',
    title:'The event plan should tell you what must become true—not just what to remember',
    lead:'An event execution plan connects the work, owners, deadlines and dependencies required to deliver the event, then keeps that model usable as reality changes.',
    intro:'Planning identifies what you intend to do. Execution control defines the operational conditions that must be true for delivery: who owns each item, what it depends on, when it is due, what proves completion, what happens if it slips and how the event day itself is run.',
    workstreams:['Event outcome & constraints','Workstreams & tasks','Owners & approvals','Dependencies & critical path','Risks & contingencies','Run of Show & readiness'],
    steps:[
      {title:'Model the event',body:'Translate the event idea, scale, location, venue status and fixed date into the necessary workstreams.'},
      {title:'Define execution objects',body:'Create tasks with owners, target dates, dependencies, completion criteria and evidence.'},
      {title:'Expose delivery risk',body:'Mark approval gates, critical-path work, risks, contingencies and supplier dependencies.'},
      {title:'Keep the model alive',body:'Use status, readiness, replanning, collaboration and Run of Show through actual delivery.'},
    ],
    outputs:['Events as complete delivery projects','Workstreams that reflect operational reality','Tasks with accountable owners and target dates','Dependencies and approval gates','Objective completion criteria and evidence','Readiness, replanning and event-day Run of Show'],
    pitfalls:['The plan is a document created once and abandoned once execution begins.','Owners are named at workstream level but individual handoffs remain ambiguous.','Deadlines exist without dependency logic, so schedule impact is invisible.','The event-day schedule is disconnected from the work required to make each cue ready.'],
    faqs:[
      {q:'How is an event execution plan different from an event planning checklist?',a:'A checklist records items to remember. An execution plan connects those items through ownership, timing, dependencies, completion criteria, risk and live status.'},
      {q:'Is RunYourEvent project management software?',a:'RunYourEvent contains execution-workspace capabilities, but its differentiator is building the event-specific operating model first rather than giving users a blank generic project board.'},
      {q:'Does the execution plan continue after generation?',a:'Yes. Paid plans can be provisioned into persistent workspaces with collaborators, assignments, status, evidence, readiness, replanning, activity history and Run of Show.'},
    ]
  }
]

export const SEO_ACQUISITION_BY_SLUG=Object.fromEntries(SEO_ACQUISITION_PAGES.map(page=>[page.slug,page])) as Record<string,SeoAcquisitionConfig>
