import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const metadata:Metadata={title:'Event Execution Resources | RunYourEvent',description:'Practical guides for event checklists, templates, timelines, execution plans, company events, weddings and reunions.',alternates:{canonical:'/resources'}}

const execution=[
  ['Event planning checklist','Turn a static checklist into owners, deadlines, dependencies and completion criteria.','/event-planning-checklist'],
  ['Event planning template','Start from structured event logic, then adapt it to the actual date, team and operating context.','/event-planning-template'],
  ['Event planning timeline','Build the schedule backwards from the fixed date and replan when reality changes.','/event-planning-timeline'],
  ['Event execution plan','Understand the difference between remembering work and controlling delivery.','/event-execution-plan'],
]
const eventGuides=[
  ['Company event planning','Primary commercial guide for corporate and company-event execution.','/company-event-planning'],
  ['Company retreat planning','Venue, travel, agenda, hospitality, confidentiality and contingencies in one plan.','/company-retreat-planning'],
  ['Wedding planning checklist','Consumer execution guide for venue, guests, vendors, deadlines and wedding day.','/wedding-planning-checklist'],
  ['Wedding planning timeline','Build the wedding schedule backwards from the date that cannot move.','/wedding-planning-timeline'],
  ['Family reunion planning','Coordinate travel, stays, meals, activities and family responsibilities.','/family-reunion-planning'],
  ['Class reunion planning','Give volunteer committees clear ownership for outreach, venue, program and event day.','/class-reunion-planning'],
]

function Card({item}:{item:string[]}){const [t,b,h]=item;return <a href={h} className="rounded-[26px] border border-black/[.055] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#c9aa57]"><h3 className="text-lg font-black text-[#23324a]">{t}</h3><p className="mt-3 text-sm leading-6 text-[#687386]">{b}</p><span className="mt-5 inline-flex items-center text-sm font-black text-[#9a7b31]">Read guide <ArrowRight className="ml-2" size={14}/></span></a>}

export default function Page(){return <main className="bg-[#fbfaf7]"><section className="shell py-20"><p className="eyebrow">Resources</p><h1 className="display mt-4 max-w-4xl text-5xl font-black sm:text-6xl">Execution thinking for people who have to deliver the event.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#687386]">Search intent may begin with a checklist, template or planning timeline. Every RunYourEvent guide leads back to the same operating discipline: workstreams, owners, dependencies, deadlines, completion criteria, readiness and event-day execution.</p><div className="mt-12"><p className="eyebrow">Core execution guides</p><div className="mt-5 grid gap-5 md:grid-cols-2">{execution.map(item=><Card key={item[0]} item={item}/>)}</div></div><div className="mt-14"><p className="eyebrow">Event-specific guides</p><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{eventGuides.map(item=><Card key={item[0]} item={item}/>)}</div></div></section></main>}
