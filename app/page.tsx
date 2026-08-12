import { ArrowRight, Check, CircleAlert, GitBranch, Layers3, ShieldCheck } from 'lucide-react'

const faq = [
  ['What is DEngine?', 'DEngine turns an event brief and fixed date into the operational model of what must become true before the event is ready.'],
  ['Is this another project-management tool?', 'No. DEngine constructs the event operating model first. Your team can still execute that model in Asana, Monday, ClickUp or another PM system.'],
  ['Is it just an AI checklist?', 'No. The output is structured around workstreams, dependencies, backward timing, owners, approvals, completion criteria, risk and contingency.'],
  ['What does it cost?', 'The preview is free. Essential is $19 per event and Professional is $39 per event. Teams and agencies can request custom access.'],
]

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DEngine',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dengine.vercel.app',
  description: 'Event Execution Intelligence software that builds dependency-aware plans backwards from a fixed event date.',
  offers: { '@type': 'AggregateOffer', lowPrice: '19', highPrice: '39', priceCurrency: 'USD', offerCount: '2' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

const sampleWorkstreams = [
  ['Venue & logistics', 'Venue contract locked', 'Floorplan approved', 'Load-in window confirmed'],
  ['Production', 'AV scope issued', 'Equipment quantities locked', 'Technical rehearsal ready'],
  ['Content & speakers', 'Agenda frozen', 'Speaker assets approved', 'Show file signed off'],
  ['Guest operations', 'Registration live', 'Final attendance cut-off', 'Arrival flow staffed'],
]

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="bg-[#fbfaf7]">
        <div className="shell grid min-h-[700px] items-center gap-12 py-16 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <p className="eyebrow">Event Execution Intelligence</p>
            <h1 className="display mt-5 text-5xl font-black leading-[.98] sm:text-7xl">
              Your event date is fixed.
              <span className="mt-2 block text-[#9d7c2f]">Build everything backwards.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#647084]">
              Turn your event brief into the complete operational plan — every dependency, deadline, approval and risk mapped backwards from event day.
            </p>
            <p className="mt-4 max-w-2xl text-base font-black leading-7 text-[#23324a]">
              Know what must happen next, what is already late, and what will block the event if it slips.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/custom" className="btn-primary">Build my plan <ArrowRight className="ml-2" size={16} /></a>
              <a href="#sample-plan" className="btn-secondary">See the conference example</a>
            </div>
            <div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold text-[#788395]">
              {['Free preview', 'Complete plans from $19/event', 'No subscription for single events'].map((item) => (
                <span key={item} className="flex items-center gap-2"><Check size={15} className="text-[#a07f31]" />{item}</span>
              ))}
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="bg-[#15233f] p-6 text-white">
              <p className="text-[10px] uppercase tracking-[.14em] text-white/45">350-person customer conference · Berlin · 14 Aug</p>
              <div className="mt-3 flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-[#efcd6d]">One brief becomes</p>
                  <h2 className="mt-1 text-xl font-black">A complete execution model</h2>
                </div>
                <div className="text-right"><p className="text-xs text-white/45">Readiness</p><p className="text-3xl font-black text-[#efcd6d]">72%</p></div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Tasks', '47'],
                  ['Workstreams', '7'],
                  ['Dependencies', '11'],
                  ['Approval gates', '4'],
                ].map(([label, value]) => (
                  <div key={label} className="metric"><p className="text-[9px] uppercase text-[#9299a5]">{label}</p><p className="mt-1 text-lg font-black">{value}</p></div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-black/[.055] bg-[#fbfaf7] p-5">
                <p className="text-[10px] font-black uppercase tracking-[.12em] text-[#9a7b31]">Critical dependency chain</p>
                <div className="mt-4 space-y-3">
                  {['Venue confirmed', 'Floorplan approved', 'AV quantities locked', 'Vendor PO released', 'Technical rehearsal'].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f3ead2] text-[10px] font-black text-[#80631f]">T{String((index + 1) * 6).padStart(2, '0')}</span>
                      <span className="font-bold text-[#23324a]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-[#eadfbd] bg-[#fbf7ea] p-4">
                <div className="flex gap-3"><CircleAlert className="mt-0.5 shrink-0 text-[#9d7c2f]" size={17} /><div><p className="text-sm font-black text-[#5f4b1f]">Floorplan approval is four days late.</p><p className="mt-1 text-xs leading-5 text-[#8b7440]">AV quantities, vendor ordering and rehearsal readiness are now exposed.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/[.055] bg-[#f5f2ea] py-20">
        <div className="shell grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div>
            <p className="eyebrow">The planning problem</p>
            <h2 className="display mt-4 text-4xl font-black sm:text-5xl">Tasks are not the hard part.</h2>
            <p className="display mt-1 text-4xl font-black text-[#7c8797] sm:text-5xl">Knowing what depends on what is.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['A supplier deadline slips', 'What downstream work just became impossible?'],
              ['An approval is late', 'Which teams are now waiting without knowing it?'],
              ['The event date moves', 'Which dates, lead times and hard gates must move with it?'],
            ].map(([title, body]) => (
              <article key={title} className="rounded-[24px] border border-black/[.055] bg-white p-5"><p className="font-black text-[#23324a]">{title}</p><p className="mt-2 text-sm leading-6 text-[#6f7a8b]">{body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section id="sample-plan" className="scroll-mt-24 bg-white py-24">
        <div className="shell">
          <p className="eyebrow">See what DEngine actually produces</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="display max-w-4xl text-4xl font-black sm:text-5xl">From one event brief to a connected operating model.</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#687386]">A planner should not have to invent the task architecture before the project tool becomes useful. DEngine constructs that architecture first.</p>
            </div>
            <a href="/custom" className="btn-primary shrink-0">Try it with my event <ArrowRight className="ml-2" size={15} /></a>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
            <article className="rounded-[30px] border border-black/[.055] bg-[#fbfaf7] p-7">
              <p className="text-[10px] font-black uppercase tracking-[.13em] text-[#9a7b31]">Input brief</p>
              <h3 className="mt-3 text-2xl font-black text-[#23324a]">European Customer Conference</h3>
              <div className="mt-6 space-y-4 text-sm">
                {[
                  ['Fixed date', '14 August'],
                  ['Audience', '350 customers + partners'],
                  ['Objective', 'Launch product roadmap and create qualified pipeline'],
                  ['Format', '1-day conference + evening reception'],
                  ['Venue', 'Shortlist, not contracted'],
                  ['Core team', '5 people'],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-black/[.055] pb-4"><p className="text-[10px] font-black uppercase tracking-[.12em] text-[#9aa2ad]">{label}</p><p className="mt-1 font-bold leading-6 text-[#23324a]">{value}</p></div>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-[30px] border border-black/[.055] bg-white">
              <div className="bg-[#15233f] p-6 text-white">
                <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.13em] text-[#efcd6d]">DEngine output</p><h3 className="mt-2 text-2xl font-black">47 execution items across 7 workstreams</h3></div><div className="text-right"><p className="text-xs text-white/45">Earliest hard decision</p><p className="mt-1 font-black text-[#efcd6d]">Venue contract</p></div></div>
              </div>
              <div className="grid gap-px bg-black/[.055] sm:grid-cols-2">
                {sampleWorkstreams.map(([name, ...tasks]) => (
                  <div key={name} className="bg-white p-5"><div className="flex items-center gap-2"><Layers3 size={15} className="text-[#9a7b31]" /><p className="text-xs font-black uppercase tracking-[.1em] text-[#80631f]">{name}</p></div><div className="mt-4 space-y-3">{tasks.map((task, index) => <div key={task} className="flex gap-3"><span className="mt-0.5 text-[10px] font-black text-[#a07f31]">{String(index + 1).padStart(2, '0')}</span><p className="text-sm font-bold text-[#35445a]">{task}</p></div>)}</div></div>
                ))}
              </div>
              <div className="border-t border-black/[.055] bg-[#fbf7ea] p-5"><p className="text-sm font-black text-[#5f4b1f]">And each item carries its owner, target date, dependencies, completion criteria and risk context — not just a task title.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#15233f] py-24 text-white">
        <div className="shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.14em] text-[#efcd6d]">Where DEngine earns its keep</p>
            <h2 className="display mt-4 text-4xl font-black sm:text-5xl">When one thing slips, see what moves with it.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/60">The value is not another list of tasks. It is knowing the operational consequence of a missed prerequisite before it turns into an event-day problem.</p>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-white/[.04] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              {[
                ['Floorplan approval', '4 days late'],
                ['AV quantities', 'Blocked'],
                ['Technical rehearsal', 'At risk'],
              ].map(([title, state], index) => (
                <div key={title} className="contents">
                  <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><p className="text-xs font-black uppercase tracking-[.1em] text-white/45">{title}</p><p className={`mt-2 text-lg font-black ${index === 0 ? 'text-[#efcd6d]' : 'text-white'}`}>{state}</p></div>
                  {index < 2 && <ArrowRight className="hidden text-[#efcd6d] sm:block" size={18} />}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-[#927b3b]/50 bg-[#efcd6d]/10 p-4"><p className="text-sm font-black text-[#f2d983]">DEngine makes the blocker visible before your team discovers it manually.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2ea] py-24">
        <div className="shell">
          <p className="eyebrow">The product distinction</p>
          <h2 className="display mt-4 max-w-4xl text-4xl font-black sm:text-5xl">AI can suggest tasks. PM software can track them. DEngine builds the event operating model.</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              ['Generic AI', 'Produces plausible lists, but leaves sequencing, completeness and prerequisite logic to the planner.'],
              ['Project-management software', 'Tracks work once the team already knows the work, owners, dates and dependencies.'],
              ['DEngine', 'Constructs the model first: workstreams, dependencies, approvals, completion rules, risks and backward timing.'],
            ].map(([title, body], index) => (
              <article key={title} className={`rounded-[28px] border p-7 ${index === 2 ? 'border-[#c9aa57] bg-[#15233f] text-white' : 'border-black/[.055] bg-white'}`}><h3 className="text-xl font-black">{title}</h3><p className={`mt-3 text-sm leading-6 ${index === 2 ? 'text-white/60' : 'text-[#687386]'}`}>{body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Start with your real event</p>
            <h2 className="display mt-4 text-4xl font-black sm:text-5xl">Preview free. Unlock the complete plan from $19.</h2>
            <p className="mt-5 text-lg leading-8 text-[#687386]">No subscription for a single event. See whether DEngine understands the event before paying.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ['Preview', '$0', 'See the event architecture, workstreams, representative tasks and recommended tier.', 'Build free preview', '/custom'],
              ['Essential', '$19/event', 'Complete right-sized execution plan for a straightforward event.', 'Build my plan', '/custom'],
              ['Professional', '$39/event', 'Adds deeper approval, risk, contingency, vendor and critical-path intelligence.', 'Build my plan', '/custom'],
            ].map(([name, price, copy, cta, href], index) => (
              <article key={name} className={`rounded-[28px] border p-7 ${index === 1 ? 'border-[#c9aa57] bg-[#fbf7ea]' : 'border-black/[.055] bg-[#fbfaf7]'}`}>
                <p className="text-[10px] font-black uppercase tracking-[.13em] text-[#9a7b31]">{name}</p>
                <p className="mt-3 text-3xl font-black text-[#23324a]">{price}</p>
                <p className="mt-3 min-h-20 text-sm leading-6 text-[#687386]">{copy}</p>
                <a href={href} className={index === 1 ? 'btn-primary mt-5 w-full' : 'btn-secondary mt-5 w-full'}>{cta}<ArrowRight className="ml-2" size={15} /></a>
              </article>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#ded2aa] bg-[#fbf6e7] p-5">
            <div><p className="font-black text-[#5f4b1f]">Not ready to buy? You do not have to.</p><p className="mt-1 text-sm text-[#8b7440]">Generate the free preview first and judge the event model yourself.</p></div>
            <a href="/custom" className="btn-primary">Preview my event <ArrowRight className="ml-2" size={15} /></a>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf7] py-24">
        <div className="shell max-w-4xl">
          <p className="eyebrow">FAQ</p>
          <div className="mt-8 divide-y divide-black/[.06] border-y border-black/[.06]">
            {faq.map(([question, answer]) => <div key={question} className="py-6"><h3 className="font-black text-[#23324a]">{question}</h3><p className="mt-2 text-sm leading-6 text-[#687386]">{answer}</p></div>)}
          </div>
        </div>
      </section>
    </main>
  )
}
