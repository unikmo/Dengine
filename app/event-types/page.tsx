import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const metadata:Metadata={title:'Event Types | RunYourEvent',description:'Explore RunYourEvent execution guides for company events, weddings, reunions, nonprofit and volunteer events, community events, celebrations and professional operators.',alternates:{canonical:'/event-types'}}

const primary=[
  ['Company & corporate events','Primary commercial funnel','Build the complete execution plan across venue, program, production, guests, vendors, approvals and event day.','/company-event-planning'],
  ['Wedding planning','Consumer SEO lead','Turn the fixed wedding date into an accountable checklist, timeline and wedding-day Run of Show.','/wedding-planning-checklist'],
  ['Family reunions','Hidden organic opportunity','Coordinate travel, stays, meals, activities and family responsibilities from one operating plan.','/family-reunion-planning'],
  ['Class reunions','Underserved volunteer-led use case','Give outreach, venue, attendance, vendors, program and volunteer work clear owners and dates.','/class-reunion-planning'],
]

const mission=[
  ['Nonprofit events','Mission, sponsors, donors, volunteers, finance and delivery.','/nonprofit-event-planning'],
  ['Volunteer-led events','Committee execution, ownership, handoffs and contingencies.','/volunteer-event-planning'],
  ['Charity events','Supporters, sponsors, volunteers and fundraising moments.','/charity-event-planning'],
  ['Fundraising events','Giving mechanics, donor experience and financial readiness.','/fundraising-event-planning-checklist'],
  ['Church events','Ministry teams, facilities, hospitality, volunteers and safety.','/church-event-planning'],
  ['Community events','Permits, partners, site logistics, volunteers and public operations.','/community-event-planning'],
  ['Sports events','Venue, officials, equipment, participants, safety and live control.','/sports-event-planning'],
]

const adjacent=[
  ['Destination weddings','Wedding execution plus guest travel, rooms, transfers and local vendors.','/destination-wedding-planning'],
  ['Company offsites','Team outcomes, venue, travel, workshops, meals and on-site delivery.','/offsite-event-planning'],
  ['Product launches','Message, demo, press, production, approvals and technical rehearsal.','/product-launch-event-planning'],
  ['Small business events','Right-sized event execution for lean teams.','/small-business-event-planning'],
  ['Birthday parties','Milestone-event checklist, suppliers and party-day sequence.','/birthday-party-planning-checklist'],
  ['Graduation parties','Ceremony constraints, guests, hospitality and celebration-day execution.','/graduation-party-planning-checklist'],
]

function Card({item}:{item:string[]}){const [t,b,h]=item;return <a href={h} className="rounded-[24px] border border-black/[.055] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#c9aa57]"><h3 className="text-lg font-black text-[#23324a]">{t}</h3><p className="mt-2 text-sm leading-6 text-[#687386]">{b}</p><span className="mt-5 inline-flex items-center text-sm font-black text-[#9a7b31]">Explore <ArrowRight className="ml-2" size={14}/></span></a>}

export default function Page(){return <main className="bg-[#fbfaf7]"><section className="shell py-20"><p className="eyebrow">Event Types</p><h1 className="display mt-4 max-w-5xl text-5xl font-black sm:text-6xl">Focused event funnels. One execution engine.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#687386]">Company events still lead commercially, weddings lead consumer search and reunions remain a strong underserved opportunity. We have now expanded only where each use case can carry its own execution logic rather than keyword-swapped copy.</p><div className="mt-12 grid gap-5 md:grid-cols-2">{primary.map(item=><Card key={item[0]} item={item}/>)}</div><section className="mt-14"><p className="eyebrow">Nonprofit, volunteer & community</p><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{mission.map(item=><Card key={item[0]} item={item}/>)}</div></section><section className="mt-14"><p className="eyebrow">Adjacent high-intent guides</p><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{adjacent.map(item=><Card key={item[0]} item={item}/>)}</div></section><div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[28px] bg-[#f5f2ea] p-7"><p className="eyebrow">PTA & school blueprints</p><h2 className="mt-3 text-2xl font-black text-[#23324a]">Still an outreach and partnership wedge first.</h2><p className="mt-3 text-sm leading-6 text-[#687386]">We are deliberately not manufacturing generic school-event SEO pages yet. The stronger route is to build reusable school/PTA execution blueprints and distribute them through organizations, schools and parent groups.</p></div><div className="rounded-[28px] bg-[#15233f] p-7 text-white"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#efcd6d]">Professional operators</p><div className="mt-5 space-y-4"><a href="/agencies" className="block rounded-2xl border border-white/10 p-5"><h2 className="font-black">Event teams & agencies</h2><p className="mt-2 text-sm text-white/60">Standardize execution without forcing every event into the same template.</p></a><a href="/venues" className="block rounded-2xl border border-white/10 p-5"><h2 className="font-black">Hotels & venues</h2><p className="mt-2 text-sm text-white/60">Coordinate clients, suppliers and internal teams from one operating plan.</p></a></div></div></div></section></main>}
