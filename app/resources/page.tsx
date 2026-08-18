import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const metadata:Metadata={title:'Event Execution Resources & Planning Guides | RunYourEvent',description:'Event execution guides for company events, weddings, reunions, nonprofit and volunteer events, community events, celebrations, checklists, templates and timelines.',alternates:{canonical:'/resources'}}

const clusters=[
  {title:'Execution foundations',items:[
    ['Event planning checklist','Turn a static checklist into owners, deadlines, dependencies and completion criteria.','/event-planning-checklist'],
    ['Event planning template','Start from structured event logic, then adapt it to the actual date, team and operating context.','/event-planning-template'],
    ['Event planning timeline','Build the schedule backwards from the fixed date and replan when reality changes.','/event-planning-timeline'],
    ['Event execution plan','Understand the difference between remembering work and controlling delivery.','/event-execution-plan'],
  ]},
  {title:'Company & business events',items:[
    ['Company event planning','Primary commercial guide for company and corporate event execution.','/company-event-planning'],
    ['Corporate event planning checklist','Cross-functional checklist with owners, approvals and dependencies.','/corporate-event-planning-checklist'],
    ['Company retreat planning','Venue, travel, agenda, hospitality, confidentiality and contingencies.','/company-retreat-planning'],
    ['Company offsite planning','Team outcomes, travel, workshops, meals and on-site execution.','/offsite-event-planning'],
    ['Product launch event planning','Product, messaging, press, production, demo readiness and launch-day control.','/product-launch-event-planning'],
    ['Small business event planning','Right-sized execution for openings, workshops, customer events and launches.','/small-business-event-planning'],
  ]},
  {title:'Weddings & celebrations',items:[
    ['Wedding planning checklist','Venue, guests, vendors, deadlines and wedding-day execution.','/wedding-planning-checklist'],
    ['Wedding planning timeline','Build the wedding schedule backwards from the fixed date.','/wedding-planning-timeline'],
    ['Destination wedding planning','Travel, accommodation, local vendors, transfers and multi-location delivery.','/destination-wedding-planning'],
    ['Birthday party planning checklist','A right-sized checklist for milestone birthdays and larger celebrations.','/birthday-party-planning-checklist'],
    ['Graduation party planning checklist','Coordinate ceremony timing, guests, food, setup and celebration-day responsibilities.','/graduation-party-planning-checklist'],
  ]},
  {title:'Reunions',items:[
    ['Family reunion planning','Coordinate travel, stays, meals, activities and distributed family responsibilities.','/family-reunion-planning'],
    ['Family reunion checklist','Turn family commitments into owners, deadlines and event-day responsibilities.','/family-reunion-checklist'],
    ['Class reunion planning','Give volunteer committees clear ownership for outreach, venue, program and event day.','/class-reunion-planning'],
  ]},
  {title:'Nonprofit, volunteer & community',items:[
    ['Nonprofit event planning','Mission, program, donors, sponsors, volunteers and financial controls.','/nonprofit-event-planning'],
    ['Volunteer event planning','Execution discipline for volunteer-led events without pretending to be volunteer-management software.','/volunteer-event-planning'],
    ['Charity event planning','Supporters, sponsors, volunteers, fundraising moments and public-facing delivery.','/charity-event-planning'],
    ['Fundraising event planning checklist','Donor experience, giving mechanics, sponsors and financial readiness.','/fundraising-event-planning-checklist'],
    ['Church event planning','Ministry teams, facilities, hospitality, volunteers, safety and program handoffs.','/church-event-planning'],
    ['Community event planning','Permits, partners, public-space logistics, volunteers, safety and site handback.','/community-event-planning'],
    ['Sports event planning','Venue readiness, participants, officials, equipment, safety and live operations.','/sports-event-planning'],
  ]},
]

function Card({item}:{item:string[]}){const [t,b,h]=item;return <a href={h} className="rounded-[24px] border border-black/[.055] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#c9aa57]"><h3 className="text-lg font-black text-[#23324a]">{t}</h3><p className="mt-3 text-sm leading-6 text-[#687386]">{b}</p><span className="mt-5 inline-flex items-center text-sm font-black text-[#9a7b31]">Read guide <ArrowRight className="ml-2" size={14}/></span></a>}

export default function Page(){return <main className="bg-[#fbfaf7]"><section className="shell py-20"><p className="eyebrow">Resources</p><h1 className="display mt-4 max-w-5xl text-5xl font-black sm:text-6xl">Deep event planning guides that lead to execution—not another pile of generic checklists.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#687386]">RunYourEvent meets the language people search for—planning, checklists, templates and timelines—then shows the stronger operating model behind delivery: workstreams, owners, dependencies, deadlines, completion criteria, readiness, replanning and Run of Show.</p>{clusters.map(cluster=><section key={cluster.title} className="mt-14"><p className="eyebrow">{cluster.title}</p><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{cluster.items.map(item=><Card key={item[0]} item={item}/>)}</div></section>)}</section></main>}
