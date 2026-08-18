import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const metadata:Metadata={title:'Event Types',description:'RunYourEvent leads with company events, weddings and family reunions, with additional event-specific execution templates for adjacent use cases.',alternates:{canonical:'/event-types'}}

const primary=[
  ['Company events','Give every workstream an owner and every deadline visibility.','/corporate'],
  ['Weddings','Know exactly what needs to happen next.','/weddings'],
  ['Family reunions','Coordinate travel, stays, meals, activities and family responsibilities from one operating plan.','/family-reunions'],
]
const secondary=[
  ['Milestone birthdays','Private-event execution without turning the product into generic party planning.'],
  ['Baby showers & graduations','Structured timelines, owners and deliverables for meaningful one-off events.'],
  ['Anniversaries & class reunions','Capture organic demand while keeping the core product positioned around execution.'],
]

export default function Page(){return <main className="bg-[#fbfaf7]"><section className="shell py-20"><p className="eyebrow">Event Types</p><h1 className="display mt-4 max-w-4xl text-5xl font-black sm:text-6xl">Three primary event funnels. One execution platform.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#687386]">Company events lead commercially. Weddings are the second high-value funnel. Family reunions are the third. Travel is never a standalone category—it appears only where the event itself requires travel coordination.</p><div className="mt-12 grid gap-5 md:grid-cols-3">{primary.map(([t,b,h])=><a key={t} href={h} className="rounded-[28px] border border-black/[.055] bg-white p-7 transition hover:-translate-y-0.5 hover:border-[#c9aa57]"><p className="text-[10px] font-black uppercase tracking-[.13em] text-[#9a7b31]">Primary funnel</p><h2 className="mt-3 text-2xl font-black text-[#23324a]">{t}</h2><p className="mt-3 text-base leading-7 text-[#687386]">{b}</p><span className="mt-6 inline-flex items-center text-sm font-black text-[#9a7b31]">Explore <ArrowRight className="ml-2" size={14}/></span></a>)}</div><div className="mt-14"><p className="eyebrow">Secondary organic demand</p><div className="mt-5 grid gap-4 md:grid-cols-3">{secondary.map(([t,b])=><article key={t} className="rounded-[24px] border border-black/[.055] bg-[#f5f2ea] p-6"><h3 className="font-black text-[#23324a]">{t}</h3><p className="mt-2 text-sm leading-6 text-[#687386]">{b}</p></article>)}</div></div><div className="mt-12 rounded-[28px] bg-[#15233f] p-7 text-white"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#efcd6d]">Professional operators</p><div className="mt-3 grid gap-5 md:grid-cols-2"><a href="/agencies" className="rounded-2xl border border-white/10 p-5"><h2 className="font-black">Event teams & agencies</h2><p className="mt-2 text-sm text-white/60">Standardize execution without forcing every event into the same template.</p></a><a href="/venues" className="rounded-2xl border border-white/10 p-5"><h2 className="font-black">Hotels & venues</h2><p className="mt-2 text-sm text-white/60">Coordinate clients, suppliers and internal teams from one operating plan.</p></a></div></div></section></main>}
