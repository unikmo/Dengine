import { ArrowRight, CheckCircle2, GitBranch, CalendarClock, ShieldCheck } from 'lucide-react'

export type SeoAcquisitionPageProps = {
  eyebrow: string
  title: string
  lead: string
  intro: string
  workstreams: string[]
  steps: { title: string; body: string }[]
  outputs: string[]
  pitfalls: string[]
  cta?: string
  faqs?: { q: string; a: string }[]
}

export default function SeoAcquisitionPage({eyebrow,title,lead,intro,workstreams,steps,outputs,pitfalls,cta='Build my execution plan',faqs=[]}:SeoAcquisitionPageProps){
  const faqSchema=faqs.length?{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}:null
  return <main className="bg-[#fbfaf7]">
    {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>}
    <section className="border-b border-black/[.055]"><div className="shell grid gap-12 py-20 lg:grid-cols-[1.05fr_.75fr] lg:items-center"><div><p className="eyebrow">{eyebrow}</p><h1 className="display mt-4 max-w-5xl text-5xl font-black leading-[1] sm:text-6xl">{title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#687386]">{lead}</p><div className="mt-8 flex flex-wrap gap-3"><a className="btn-primary" href="/custom">{cta} <ArrowRight className="ml-2" size={15}/></a><a className="btn-secondary" href="#framework">See the execution framework</a></div><div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold text-[#788395]">{['Free preview','Backward scheduled from the event date','Live workspace after purchase'].map(x=><span key={x} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#9a7b31]"/>{x}</span>)}</div></div><aside className="rounded-[30px] bg-[#15233f] p-7 text-white"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#efcd6d]">What RunYourEvent builds</p><div className="mt-5 space-y-3">{workstreams.map(x=><div key={x} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] p-3"><GitBranch size={15} className="text-[#efcd6d]"/><span className="font-bold">{x}</span></div>)}</div></aside></div></section>

    <section className="bg-white py-20"><div className="shell grid gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">From planning intent to execution control</p><h2 className="display mt-4 text-4xl font-black">A checklist is useful. A connected operating plan is stronger.</h2><p className="mt-5 text-base leading-7 text-[#687386]">{intro}</p></div><div className="grid gap-4 sm:grid-cols-2">{outputs.map((x,i)=><article key={x} className="rounded-[24px] border border-black/[.055] bg-[#fbfaf7] p-5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f3ead2] text-[10px] font-black text-[#80631f]">{String(i+1).padStart(2,'0')}</span><p className="mt-4 font-black leading-6 text-[#23324a]">{x}</p></article>)}</div></div></section>

    <section id="framework" className="border-y border-black/[.055] bg-[#f5f2ea] py-20"><div className="shell"><p className="eyebrow">Execution framework</p><h2 className="display mt-4 max-w-4xl text-4xl font-black sm:text-5xl">Work backwards from the fixed date, then make every dependency visible.</h2><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{steps.map((s,i)=><article key={s.title} className="rounded-[26px] border border-black/[.055] bg-white p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#15233f] text-xs font-black text-[#efcd6d]">{i+1}</span><h3 className="mt-5 text-lg font-black text-[#23324a]">{s.title}</h3><p className="mt-3 text-sm leading-6 text-[#687386]">{s.body}</p></article>)}</div></div></section>

    <section className="bg-[#15233f] py-20 text-white"><div className="shell grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-center"><div><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#efcd6d]">What usually goes wrong</p><h2 className="display mt-4 text-4xl font-black">The event date does not move just because the work is late.</h2><p className="mt-5 text-base leading-7 text-white/60">RunYourEvent makes schedule exposure, ownership gaps and blocked work visible before they become event-day surprises.</p></div><div className="grid gap-3">{pitfalls.map(x=><div key={x} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#efcd6d]"/><p className="text-sm font-bold leading-6 text-white/80">{x}</p></div>)}</div></div></section>

    <section className="bg-white py-20"><div className="shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex items-center gap-3 text-[#9a7b31]"><CalendarClock size={18}/><p className="eyebrow">RunYourEvent</p></div><h2 className="display mt-4 max-w-4xl text-4xl font-black">Turn the fixed date into a plan your team can actually execute.</h2><p className="mt-4 max-w-3xl text-base leading-7 text-[#687386]">Generate the plan, assign the work, track readiness, replan when dates move and run event day from the same execution workspace.</p></div><a className="btn-primary shrink-0" href="/custom">{cta} <ArrowRight className="ml-2" size={15}/></a></div></section>

    {faqs.length>0&&<section className="border-t border-black/[.055] bg-[#f5f2ea] py-20"><div className="shell"><p className="eyebrow">Questions</p><div className="mt-8 grid gap-4 md:grid-cols-2">{faqs.map(({q,a})=><details key={q} className="rounded-[24px] border border-black/[.055] bg-white p-5"><summary className="cursor-pointer font-black text-[#23324a]">{q}</summary><p className="mt-3 text-sm leading-6 text-[#687386]">{a}</p></details>)}</div></div></section>}
  </main>
}
