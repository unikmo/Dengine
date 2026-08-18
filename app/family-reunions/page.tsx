import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Family Reunion Execution Software',
  description: 'Coordinate travel, accommodation, meals, activities, family responsibilities and deadlines from one family reunion operating plan.',
  alternates: { canonical: '/family-reunions' },
}

export default function Page(){return <main className="bg-[#fbfaf7]"><section className="shell py-20"><p className="eyebrow">Family reunions</p><h1 className="display mt-4 max-w-4xl text-5xl font-black sm:text-6xl">Bring the family together without carrying the entire plan in your head.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#687386]">RunYourEvent turns the reunion into clear workstreams for travel, accommodation, meals, activities, communications, responsibilities and the live schedule.</p><div className="mt-8 flex flex-wrap gap-3"><a className="btn-primary" href="/custom">Build my reunion plan <ArrowRight className="ml-2" size={15}/></a><a className="btn-secondary" href="/templates">See templates</a></div><div className="mt-12 grid gap-5 md:grid-cols-3">{[['Travel & stays','Coordinate arrivals, rooms, transport and who still needs confirmation.'],['Family responsibilities','Assign meals, activities, communications and logistics instead of relying on one organizer.'],['Run of Show','Keep the reunion weekend, handoffs and live moments visible in one sequence.']].map(([t,b])=><article key={t} className="rounded-[28px] border border-black/[.055] bg-white p-7"><h2 className="text-xl font-black text-[#23324a]">{t}</h2><p className="mt-3 text-sm leading-6 text-[#687386]">{b}</p></article>)}</div></section></main>}
