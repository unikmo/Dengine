import type { SeoAcquisitionConfig } from '@/lib/seo-acquisition'

export const SEO_PHASE3_PAGES:SeoAcquisitionConfig[]=[
  {
    slug:'charity-event-planning',
    metaTitle:'Charity Event Planning Checklist & Execution Plan | RunYourEvent',
    metaDescription:'Build a charity event execution plan for venue, supporters, sponsors, volunteers, suppliers, fundraising moments and event-day delivery.',
    eyebrow:'Charity event planning',
    title:'Run the charity event around the cause, the supporters and the delivery work',
    lead:'Coordinate venue, sponsors, supporters, volunteers, suppliers, fundraising moments and event-day responsibilities from one execution plan.',
    intro:'Charity events combine public-facing experience with mission credibility. Sponsor commitments, donor or supporter communications, volunteer responsibilities, venue logistics and fundraising moments must all land on time. RunYourEvent turns those parallel streams into one accountable operating model.',
    workstreams:['Cause & event outcome','Supporters & communications','Sponsors & partners','Venue & suppliers','Volunteers & staffing','Fundraising moments & event-day operations'],
    steps:[
      {title:'Define the cause outcome',body:'Clarify what the event must achieve in awareness, funds, participation or community engagement.'},
      {title:'Build supporter and sponsor workstreams',body:'Give outreach, sponsor assets, partner obligations and guest communications clear owners and deadlines.'},
      {title:'Protect delivery dependencies',body:'Connect venue, suppliers, permissions, volunteer readiness and fundraising mechanics to the deadlines they require.'},
      {title:'Run the public-facing sequence',body:'Coordinate arrivals, program, appeals, donor moments, activities, acknowledgements and closeout through the Run of Show.'},
    ],
    outputs:['A charity-event execution checklist tied to the actual cause and format','Sponsor and supporter deliverables with owners','Volunteer responsibilities integrated into event readiness','Fundraising moments connected to program and technical dependencies','Risk and contingency visibility for public-facing delivery','A live Run of Show for event day'],
    pitfalls:['Sponsor deliverables are promised without a single fulfillment owner.','Volunteer roles are discussed but not tied to arrival times or handoffs.','Fundraising mechanics are tested too late relative to program and production.','Cause messaging, donor experience and event logistics are managed in separate plans.'],
    faqs:[
      {q:'How is this different from nonprofit event planning?',a:'The nonprofit page covers the broader organizational operating context. This charity-event page focuses on public-facing charity events where supporters, sponsors, volunteers and fundraising moments must converge on event day.'},
      {q:'Does RunYourEvent process donations?',a:'No. Donation and payment processing should remain with the organization’s fundraising platform. RunYourEvent manages the execution work around the event.'},
      {q:'Can volunteers and staff share the same workspace?',a:'Yes. Paid workspaces support role-based collaboration, assignments, comments, status and readiness.'},
    ]
  },
  {
    slug:'church-event-planning',
    metaTitle:'Church Event Planning Checklist & Execution Plan | RunYourEvent',
    metaDescription:'Plan church events with clear owners for venue spaces, ministry teams, program, hospitality, volunteers, communications, safety and event-day delivery.',
    eyebrow:'Church event planning',
    title:'Give ministry teams and volunteers one operating plan for the event',
    lead:'Coordinate program, rooms, hospitality, communications, volunteers, suppliers, safety and event-day responsibilities around one fixed date.',
    intro:'Church events are often delivered across ministry teams and volunteers rather than a dedicated event department. The operational challenge is making responsibilities visible while respecting facilities, worship or program requirements, child-safety or accessibility considerations, hospitality and volunteer availability.',
    workstreams:['Program & ministry content','Facilities & room readiness','Communications & attendance','Hospitality & supplies','Volunteers & safety','Event-day handoffs'],
    steps:[
      {title:'Define the event purpose and format',body:'Set the fixed date, audience, program structure, rooms, ministry teams and special safety or accessibility requirements.'},
      {title:'Assign ministry ownership',body:'Separate program, communications, hospitality, facilities, volunteer and supplier responsibilities.'},
      {title:'Connect facility and program dependencies',body:'Make room setup, AV, childcare, food, signage and program approvals visible before event day.'},
      {title:'Prepare volunteer handoffs',body:'Give setup, welcome, program support, hospitality, safety and cleanup explicit timing and owners.'},
    ],
    outputs:['A church-event checklist organized by ministry and operating workstream','Clear ownership across staff and volunteers','Facility, program and hospitality dependencies','Completion criteria for room, supply and technical readiness','Live status for volunteer-led preparation','A Run of Show for service, program or community-event delivery'],
    pitfalls:['Multiple ministry teams assume facilities or AV are handled by someone else.','Volunteer assignments exist informally but arrival and handoff times are unclear.','Hospitality quantities are set before attendance assumptions are stable.','Program changes reach technical and facilities teams too late.'],
    faqs:[
      {q:'What types of church events can RunYourEvent support?',a:'Examples include conferences, retreats, community days, fundraisers, holiday events, workshops and other fixed-date gatherings. The exact plan is generated from the event context.'},
      {q:'Is this church management software?',a:'No. RunYourEvent does not manage membership, giving or ministry databases. It manages the execution work for a specific event.'},
      {q:'Can volunteers be viewers or editors?',a:'Yes. The workspace supports owner, editor and viewer roles.'},
    ]
  },
  {
    slug:'community-event-planning',
    metaTitle:'Community Event Planning Checklist & Execution Plan | RunYourEvent',
    metaDescription:'Build a community event execution plan for permits, venue or public space, partners, volunteers, safety, suppliers, communications and live operations.',
    eyebrow:'Community event planning',
    title:'Coordinate the partners, permissions and people behind the community event',
    lead:'Turn public-space logistics, partners, volunteers, communications, safety and event-day operations into one accountable plan.',
    intro:'Community events frequently involve more external dependencies than their budget suggests: public spaces, permits, local partners, volunteers, suppliers, accessibility, safety, weather and resident communications. RunYourEvent makes those dependencies visible so the organizer can see what must be true before the event opens.',
    workstreams:['Purpose & community partners','Site, permits & permissions','Participants & communications','Suppliers & infrastructure','Volunteers, safety & accessibility','Live community operations'],
    steps:[
      {title:'Map the stakeholder environment',body:'Identify the organizer, venue or municipality, community partners, suppliers, volunteers and affected audiences.'},
      {title:'Secure permissions early',body:'Make permits, insurance, site access, safety and infrastructure approvals explicit gates.'},
      {title:'Coordinate public-facing logistics',body:'Connect communications, access, parking or transport, signage, vendors and program to the site plan.'},
      {title:'Prepare event-day control',body:'Assign setup, welcome, safety, information, activities, issue escalation, cleanup and site handback.'},
    ],
    outputs:['A community-event execution model around real stakeholders','Permit and site-readiness dependencies','Partner, supplier and volunteer ownership','Accessibility and safety tasks with completion criteria','Weather and site contingencies where relevant','A live operations Run of Show'],
    pitfalls:['Permit or site conditions surface after suppliers have already been booked.','Community partners agree to contribute without clear deliverables.','Public communications are published before access, parking or weather arrangements are stable.','Cleanup and site handback have no accountable owner.'],
    faqs:[
      {q:'Can RunYourEvent support events in parks or public spaces?',a:'Yes. The event plan can include permits, access, infrastructure, safety, accessibility, suppliers and weather contingencies.'},
      {q:'Does it manage municipal permit applications?',a:'No. It can track the permit work, owners, deadlines and evidence, but the application itself stays with the relevant authority.'},
      {q:'Can community partners collaborate?',a:'Yes. Paid workspaces can invite editors or viewers as appropriate.'},
    ]
  },
  {
    slug:'small-business-event-planning',
    metaTitle:'Small Business Event Planning & Execution Software | RunYourEvent',
    metaDescription:'Build a small business event execution plan for venue, customers, suppliers, promotion, staff, inventory, approvals and event-day delivery.',
    eyebrow:'Small business event planning',
    title:'Run the business event without turning the whole company into an event department',
    lead:'Coordinate venue, promotion, customers, suppliers, staff, inventory and event-day responsibilities with a right-sized execution plan.',
    intro:'For a small business, the people running an event usually also have normal jobs to do. A launch, customer evening, workshop or opening therefore needs enough structure to protect deadlines without introducing enterprise process overhead. RunYourEvent creates a right-sized operating plan around the fixed event date.',
    workstreams:['Business outcome & offer','Venue or site readiness','Customers & promotion','Suppliers & inventory','Staff responsibilities','Event-day sales or service operations'],
    steps:[
      {title:'Define the business outcome',body:'Clarify whether the event exists to launch, sell, educate, retain customers, generate leads or open a location.'},
      {title:'Protect normal operations',body:'Assign event work clearly so critical tasks do not disappear between day-to-day business responsibilities.'},
      {title:'Connect promotion to readiness',body:'Do not promote promises that depend on unconfirmed venue, inventory, supplier or staffing assumptions.'},
      {title:'Run the customer experience',body:'Coordinate setup, arrivals, service or sales moments, demonstrations, payments, follow-up and teardown.'},
    ],
    outputs:['A right-sized small-business event checklist','Named owners across a small team','Promotion, supplier and inventory dependencies','Completion criteria for customer-facing readiness','Simple status and readiness without enterprise complexity','A practical event-day Run of Show'],
    pitfalls:['Marketing launches before operational capacity is confirmed.','The owner becomes the default escalation point for every task.','Inventory or demonstration equipment arrives too late for testing.','Normal business coverage and event staffing are planned separately.'],
    faqs:[
      {q:'Is RunYourEvent suitable for very small teams?',a:'Yes. Essential is intended to remain complete for straightforward events rather than forcing enterprise complexity onto small teams.'},
      {q:'Can it support a grand opening?',a:'Yes. Grand Opening is already one of the structured reference event models.'},
      {q:'Can we use it for customer workshops or launch events?',a:'Yes. The event brief can represent workshops, product launches, customer events and other fixed-date business gatherings.'},
    ]
  },
  {
    slug:'offsite-event-planning',
    metaTitle:'Company Offsite Planning Checklist & Execution Plan | RunYourEvent',
    metaDescription:'Plan a company offsite with one execution model for venue, travel, agenda, workshops, activities, meals, team communications and contingencies.',
    eyebrow:'Company offsite planning',
    title:'Build the offsite around the team outcome—not a list of bookings',
    lead:'Coordinate venue, travel, agenda, workshops, meals, activities and team communications around the fixed offsite dates.',
    intro:'An offsite may be shorter or less formal than an executive retreat, but it still requires operational convergence. Travel windows, meeting rooms, workshop materials, meals, activities and team communications must support the same business objective. RunYourEvent turns those elements into one date-driven plan.',
    workstreams:['Offsite outcome & agenda','Venue & meeting spaces','Travel & arrivals','Meals & hospitality','Activities & team experience','On-site facilitation & contingencies'],
    steps:[
      {title:'Define the offsite outcome',body:'Set the business purpose, attendees, fixed dates and the decisions or team outcomes expected.'},
      {title:'Coordinate logistics with the agenda',body:'Connect arrival times, rooms, meals, transfers and activity bookings to the actual program.'},
      {title:'Protect workshop readiness',body:'Give facilitators, content owners and participants deadlines for materials, pre-work and decisions.'},
      {title:'Prepare on-site adjustments',body:'Create contingencies for travel delay, weather, room changes or agenda compression.'},
    ],
    outputs:['A company-offsite checklist tied to the real agenda','Travel and venue dependencies','Owners for facilitation, meals, activities and communications','Preparation deadlines for workshops and materials','Contingencies for common offsite disruption','A live offsite Run of Show'],
    pitfalls:['Travel is booked without considering the first real working session.','Activities consume agenda time because business outcomes were not protected.','Facilitators receive participant data or materials too late.','Weather or transport disruption forces improvisation without a fallback sequence.'],
    faqs:[
      {q:'How is an offsite different from a company retreat in RunYourEvent?',a:'Both use the same execution engine. The offsite page targets broader team offsites and workshops, while the retreat page is positioned around more formal retreat logistics, executives, accommodation and confidentiality.'},
      {q:'Can travel be included?',a:'Yes. Travel is included as part of the offsite when it affects the event execution sequence.'},
      {q:'Can the team share the plan?',a:'Yes. Paid workspaces support multiple collaborators and task assignment.'},
    ]
  },
  {
    slug:'product-launch-event-planning',
    metaTitle:'Product Launch Event Planning & Execution Software | RunYourEvent',
    metaDescription:'Build a product launch event execution plan for messaging, demo readiness, press, venue, production, guests, approvals, suppliers and contingencies.',
    eyebrow:'Product launch event planning',
    title:'Make launch readiness visible before the audience sees the product',
    lead:'Connect messaging, demo readiness, press, production, venue, guests, suppliers and approvals around one launch date.',
    intro:'A product launch event sits at the intersection of product, marketing, communications, executives and live production. The launch date can remain fixed while messaging, demo builds, press materials or technical production change underneath it. RunYourEvent exposes those dependencies and the remaining readiness.',
    workstreams:['Launch narrative & approvals','Product & demo readiness','Press & communications','Venue & guest operations','Production & technical rehearsal','Suppliers, contingency & Run of Show'],
    steps:[
      {title:'Lock the launch promise',body:'Define the audience, product story, event objective, fixed date and what must be demonstrably ready.'},
      {title:'Connect product and content gates',body:'Make demo builds, messaging approval, executive content and press materials explicit dependencies.'},
      {title:'Protect technical production',body:'Tie staging, AV, connectivity, demo hardware and rehearsal to the content and product decisions they require.'},
      {title:'Rehearse the failure modes',body:'Create contingencies for demo failure, late messaging, executive changes and production issues.'},
    ],
    outputs:['A product-launch execution graph across product, marketing and production','Approval gates for messaging, content and press','Demo-readiness completion criteria and evidence','Technical and supplier dependencies','Risk and contingency detail for launch-critical moments','An editable live launch Run of Show'],
    pitfalls:['Marketing deadlines ignore whether the demo environment is actually stable.','Executive content changes after technical cues and graphics are locked.','Press materials and live messaging diverge because approvals are fragmented.','The demo has no credible fallback if connectivity or product state fails.'],
    faqs:[
      {q:'Does RunYourEvent have a product launch model?',a:'Yes. Product Launch is one of the current structured reference events, with message, demo readiness, press, production, venue, guest operations and contingency dimensions.'},
      {q:'Can product and marketing teams share the same execution plan?',a:'Yes. The workspace is designed for cross-functional ownership and dependency visibility.'},
      {q:'Can we track a technical rehearsal?',a:'Yes. Rehearsal tasks and exact live cues can be included in the plan and Run of Show.'},
    ]
  },
  {
    slug:'corporate-event-planning-checklist',
    metaTitle:'Corporate Event Planning Checklist With Owners & Timeline | RunYourEvent',
    metaDescription:'Use a corporate event planning checklist with workstreams, accountable owners, approvals, dependencies, deadlines, risks and live readiness.',
    eyebrow:'Corporate event planning checklist',
    title:'Turn the corporate event checklist into a cross-functional operating plan',
    lead:'Give venue, program, speakers, production, guests, procurement and approvals one connected checklist with owners and deadlines.',
    intro:'The corporate-event checklist query often starts as a request for a list. The operational need is stronger: different functions own different parts of the event, and one late decision can block production, communications or suppliers. RunYourEvent makes the checklist accountable and dependency-aware.',
    workstreams:['Venue & logistics','Program & executives','Speakers & content','Production & AV','Guests & communications','Procurement, approvals & suppliers'],
    steps:[
      {title:'Structure the checklist by workstream',body:'Keep corporate functions visible instead of putting every task into one undifferentiated list.'},
      {title:'Assign accountable owners',body:'Name the person or function responsible for each item and the approver where one is required.'},
      {title:'Add dependency logic',body:'Connect venue, content, procurement and production tasks to the decisions they actually depend on.'},
      {title:'Track readiness to event day',body:'Use live status, blockers, evidence, critical-path readiness and the Run of Show rather than a final-week status meeting.'},
    ],
    outputs:['A corporate-event checklist organized into real workstreams','Owners and approvers for individual execution items','Backward-scheduled deadlines from the event date','Dependency and critical-path visibility','Completion criteria and evidence requirements','A live execution workspace after purchase'],
    pitfalls:['The checklist is comprehensive but ownership is still at department level.','Procurement and approval lead times are added after vendor decisions are made.','Content changes do not propagate to production and speaker operations.','The event appears “mostly done” without a measurable critical-path readiness view.'],
    faqs:[
      {q:'Why have both a company-event page and this corporate checklist page?',a:'They target different search intent. The company-event page is the primary commercial authority page; this page serves users explicitly looking for a corporate-event checklist and moves them toward the execution model.'},
      {q:'Can the checklist be updated collaboratively?',a:'Yes. Paid workspaces support task assignment, status, evidence, comments, replanning and activity history.'},
      {q:'Does RunYourEvent replace corporate procurement tools?',a:'No. It can track procurement requirements, approvals and vendor scope as part of event execution, while purchasing remains in the organization’s normal systems.'},
    ]
  },
  {
    slug:'fundraising-event-planning-checklist',
    metaTitle:'Fundraising Event Planning Checklist & Timeline | RunYourEvent',
    metaDescription:'Build a fundraising event checklist for donors, sponsors, venue, program, giving mechanics, volunteers, financial controls and event-day execution.',
    eyebrow:'Fundraising event planning checklist',
    title:'Build the fundraising event around donor experience and giving readiness',
    lead:'Coordinate donors, sponsors, program, venue, giving mechanics, volunteers and financial controls in one accountable execution plan.',
    intro:'A fundraising event succeeds only when the guest experience, program and giving mechanics work together. Donor communications, sponsor commitments, auction or pledge mechanics, payment flow, production and financial controls all have dependencies. RunYourEvent makes those dependencies visible before the appeal goes live.',
    workstreams:['Fundraising goal & donor strategy','Donor invitations & stewardship','Sponsors & auction or pledge items','Venue, hospitality & seating','Giving mechanics & financial controls','Program, production & event-day operations'],
    steps:[
      {title:'Define the fundraising mechanism',body:'Clarify the fundraising target and whether giving happens through appeals, pledges, auctions, sponsorships, ticketing or a combination.'},
      {title:'Build donor and sponsor milestones',body:'Give invitations, confirmations, sponsor assets, item collection and stewardship communications clear owners and deadlines.'},
      {title:'Test the giving flow',body:'Treat payment, pledge, auction or donation mechanics as launch-critical dependencies that require evidence of readiness.'},
      {title:'Connect program to giving',body:'Sequence speeches, stories, appeals, recognition and production cues so the fundraising moments are operationally supported.'},
    ],
    outputs:['A fundraising-event checklist tied to the chosen giving model','Donor and sponsor deliverables with deadlines','Giving-mechanic readiness and completion evidence','Financial-control and reconciliation tasks','Volunteer and hospitality responsibilities','A fundraising-specific Run of Show'],
    pitfalls:['Giving technology is assumed ready without an end-to-end test.','Sponsor benefits and auction items arrive too late for production and communications.','The fundraising appeal is written separately from the live program timing.','Post-event reconciliation and donor follow-up have no owner before event day.'],
    faqs:[
      {q:'Does RunYourEvent process donations or auction payments?',a:'No. It tracks the work required to prepare and operate those mechanics. Payment processing should remain with the organization’s chosen fundraising or commerce provider.'},
      {q:'Can it support a gala?',a:'Yes. Fundraising Gala is already one of the current structured reference event models.'},
      {q:'Can financial-control tasks require evidence?',a:'Yes. Completion criteria and evidence requirements can be part of the execution plan, particularly in Professional plans.'},
    ]
  }
]
