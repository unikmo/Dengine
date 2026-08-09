import {
  ArrowRight,
  Check,
  CircleAlert,
  GitBranch,
  Layers3,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dengine.vercel.app'

const faq = [
  {
    q: 'What is DEngine?',
    a: 'DEngine is event planning software for professional teams. It converts an event brief and fixed date into an execution model with workstreams, dependencies, owners, backward deadlines, approvals, risks and completion criteria.',
  },
  {
    q: 'How is DEngine different from Asana, Monday or ClickUp?',
    a: 'Project-management tools are excellent at managing work once the work is known. DEngine focuses on constructing the event operating model first, then that plan can be executed in the workflow system a team already uses.',
  },
  {
    q: 'Does DEngine just use AI to create a checklist?',
    a: 'No. The product is designed around structured event logic and event-specific operating models. AI adapts that structure to the event context instead of treating the task as a blank-prompt checklist request.',
  },
  {
    q: 'Who is DEngine designed for?',
    a: 'The primary users are event agencies, in-house event and marketing teams, conference organizers and lean teams responsible for complex professional events.',
  },
  {
    q: 'Can DEngine plan backwards from an event date?',
    a: 'Yes. The event date is a first-class input. Tasks receive timing relative to event day so target dates can be recalculated when the fixed date moves.',
  },
  {
    q: 'What event types does DEngine support?',
    a: 'The strongest use cases include conferences, executive retreats, customer events, training workshops, galas, fundraising events, product launches and grand openings. The reference library covers additional event types.',
  },
]

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DEngine',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: siteUrl,
  description:
    'Event planning and execution intelligence software that builds dependency-aware plans backwards from a fixed event date.',
  offers: {
    '@type': 'Offer',
    price: '39',
    priceCurrency: 'USD',
    description: 'Single-event execution plan',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

const graphNodes = [
  ['T07', 'Venue confirmed', 'Event lead', '12w'],
  ['T12', 'Floorplan locked', 'Ops lead', '8w'],
  ['T18', 'AV scope issued', 'Production', '7w'],
  ['T26', 'Show file approved', 'Content lead', '2w'],
  ['T31', 'Technical rehearsal', 'Production', '1d'],
]

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="overflow-hidden bg-[#fbfaf7]">
        <div className="shell grid min-h-[690px] items-center gap-14 py-16 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
          <div className="max-w-[650px]">
            <p className="eyebrow">Event planning software for professional teams</p>
            <h1 className="display mt-5 text-[48px] font-black leading-[0.98] sm:text-[64px] lg:text-[72px]">
              Your event date is fixed.
              <span className="mt-2 block text-[#9d7c2f]">Build everything backwards.</span>
            </h1>
            <p className="mt-7 max-w-[610px] text-[18px] leading-8 text-[#647084] sm:text-[20px]">
              DEngine turns one event brief into the operational plan: workstreams, dependencies,
              owners, deadlines, approvals, risks and the evidence required to call each item done.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/custom" className="btn-primary">
                Build my execution plan <ArrowRight className="ml-2" size={16} />
              </a>
              <a href="#example-plan" className="btn-secondary">
                See an example plan
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#788395]">
              {['No blank-page planning', 'Fixed-date scheduling', 'No PM-tool migration required'].map(item => (
                <span key={item} className="flex items-center gap-2">
                  <Check size={15} className="text-[#a07f31]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div id="example-plan" className="relative lg:pl-5">
            <div className="absolute -inset-8 rounded-[48px] bg-[#d8b65b]/10 blur-3xl" />
            <div className="panel relative overflow-hidden">
              <div className="border-b border-black/[0.06] bg-[#15233f] px-6 py-5 text-white">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/45">
                      Customer Conference · Berlin
                    </p>
                    <h2 className="mt-2 text-lg font-black tracking-[-0.02em]">Event execution model</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-white/45">Readiness</p>
                    <p className="mt-1 text-3xl font-black text-[#efcd6d]">72%</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    ['Critical path', '2 at risk'],
                    ['Approvals', '6 open'],
                    ['Next hard date', '14 Aug'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-black/[0.06] bg-[#f7f5ef] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9299a5]">{label}</p>
                      <p className="mt-1.5 text-[13px] font-black text-[#1f2e48]">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-[0.13em] text-[#9097a4]">Dependency chain</p>
                  <span className="rounded-full bg-[#f4ecd6] px-2.5 py-1 text-[10px] font-black text-[#8e6d25]">
                    Critical path
                  </span>
                </div>

                <div className="mt-4">
                  {graphNodes.map(([id, title, owner, timing], index) => (
                    <div key={id} className="relative grid grid-cols-[30px_1fr_auto] gap-3">
                      <div className="flex flex-col items-center">
                        <span className={`mt-1 h-3.5 w-3.5 rounded-full border-[3px] ${
                          index === graphNodes.length - 1
                            ? 'border-[#d8b65b] bg-[#d8b65b]'
                            : 'border-[#15233f] bg-white'
                        }`} />
                        {index !== graphNodes.length - 1 && <span className="h-[54px] w-px bg-[#dcd9d1]" />}
                      </div>
                      <div className="pb-5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#a2a8b2]">{id}</span>
                          <p className="text-[14px] font-black text-[#23324a]">{title}</p>
                        </div>
                        <p className="mt-1 text-xs text-[#8a93a2]">{owner}</p>
                      </div>
                      <p className="pt-0.5 text-xs font-bold text-[#727d8e]">{timing}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-2 rounded-2xl border border-[#eadfbd] bg-[#fbf7ea] p-4">
                  <div className="flex gap-3">
                    <CircleAlert className="mt-0.5 shrink-0 text-[#9d7c2f]" size={17} />
                    <div>
                      <p className="text-sm font-black text-[#5f4b1f]">Floorplan approval is four days late.</p>
                      <p className="mt-1 text-xs leading-5 text-[#8b7440]">
                        AV design, equipment quantities and supplier load-in remain blocked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-[#959ca8]">
              Illustrative interface. Your plan is generated from your event context.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/[0.055] bg-white">
        <div className="shell grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Event agencies', 'Repeatable operational architecture'],
            ['In-house event teams', 'Fewer missed prerequisites'],
            ['Conference organizers', 'Dependency-aware timelines'],
            ['Lean project teams', 'Senior-planner structure without the blank page'],
          ].map(([title, desc], i) => (
            <div key={title} className={`py-6 ${i ? 'lg:border-l lg:border-black/[0.055] lg:pl-6' : ''}`}>
              <p className="text-sm font-black text-[#23324a]">{title}</p>
              <p className="mt-1 text-xs leading-5 text-[#88919f]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="bg-[#f5f2ea] py-24 sm:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow">The product distinction</p>
              <h2 className="display mt-4 text-4xl font-black leading-[1.04] sm:text-5xl">
                Tasks are not the hard part.
                <span className="block text-[#7c8797]">Knowing what depends on what is.</span>
              </h2>
              <p className="mt-6 text-base leading-7 text-[#687386]">
                Generic AI can produce plausible lists. Project-management tools can organize known work.
                DEngine is designed to construct the event operating model before execution begins.
              </p>
            </div>

            <div className="space-y-4">
              {[
                ['01', 'Generic AI', 'Useful for ideas', 'Produces plausible tasks, but the planner still has to verify sequencing, prerequisites, lead times and completeness.'],
                ['02', 'Project-management software', 'Useful for execution', 'Tracks work once the team already knows what the work is, who owns it and when it is due.'],
                ['03', 'DEngine', 'Builds the event operating model', 'Maps workstreams, dependencies, approvals, completion rules, risks and backward timing from the fixed date.'],
              ].map(([no, title, kicker, desc], i) => (
                <article key={title} className={`rounded-[28px] border p-6 sm:p-8 ${
                  i === 2 ? 'border-[#c9aa57] bg-[#15233f] text-white' : 'border-black/[0.055] bg-white'
                }`}>
                  <div className="flex items-start gap-5">
                    <span className={`text-xs font-black ${i === 2 ? 'text-[#efcd6d]' : 'text-[#a58b51]'}`}>{no}</span>
                    <div>
                      <p className={`text-xs font-black uppercase tracking-[0.12em] ${i === 2 ? 'text-white/45' : 'text-[#9198a4]'}`}>{kicker}</p>
                      <h3 className="mt-2 text-xl font-black tracking-[-0.025em]">{title}</h3>
                      <p className={`mt-3 text-sm leading-6 ${i === 2 ? 'text-white/60' : 'text-[#687386]'}`}>{desc}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">The Event Execution Graph</p>
            <h2 className="display mt-4 text-4xl font-black leading-[1.04] sm:text-5xl">
              One operational model. Every prerequisite connected.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#687386]">
              Each item can carry the information a real event team needs to act with confidence—not just a task title.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [GitBranch, 'Dependencies', 'What must happen first, and which downstream work becomes blocked when it slips.'],
              [Layers3, 'Workstreams', 'Venue, production, content, guests, suppliers and other operational domains stay structurally separated.'],
              [ShieldCheck, 'Definition of done', 'Completion criteria and evidence make “finished” observable rather than subjective.'],
              [CircleAlert, 'Risk + contingency', 'The consequence of delay is visible, with a specific fallback when possible.'],
            ].map(([Icon, title, desc]: any) => (
              <article key={title} className="rounded-[26px] border border-black/[0.055] bg-[#fbfaf7] p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#15233f] text-[#efcd6d]">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 text-lg font-black tracking-[-0.02em] text-[#23324a]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#707b8c]">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#15233f] py-24 text-white sm:py-28">
        <div className="shell grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#efcd6d]">Backward scheduling</p>
            <h2 className="mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
              Start with event day.
              <span className="block text-white/48">Work backwards to today.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/58">
              The fixed date anchors the plan. When event day moves, target dates can be recalculated from the same timing logic instead of manually editing dozens of disconnected tasks.
            </p>
            <a href="/custom" className="btn-signal mt-8">
              Build a backward plan <ArrowRight className="ml-2" size={16} />
            </a>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-bold text-white/40">Product launch</p>
                <p className="mt-1 font-black">Planning window</p>
              </div>
              <span className="rounded-full border border-[#efcd6d]/30 bg-[#efcd6d]/10 px-3 py-1.5 text-xs font-black text-[#efcd6d]">
                Event day · 18 Sep
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {[
                ['12 weeks', 'Venue + commercial lock', 'Sponsor scope · venue contract'],
                ['8 weeks', 'Production architecture', 'Floorplan · AV design · content requirements'],
                ['4 weeks', 'Operational freeze', 'Guest journey · staffing · supplier confirmations'],
                ['1 week', 'Readiness gates', 'Final files · rehearsals · contingency checks'],
                ['0', 'Event execution', 'Live operations · issue escalation · handover'],
              ].map(([time, title, desc], i) => (
                <div key={title} className="grid grid-cols-[72px_18px_1fr] gap-3">
                  <p className="pt-0.5 text-xs font-black text-white/45">{time}</p>
                  <div className="flex flex-col items-center">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${i === 4 ? 'bg-[#efcd6d]' : 'bg-white/50'}`} />
                    {i !== 4 && <span className="mt-1 h-10 w-px bg-white/12" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-black">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/38">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf7] py-24 sm:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="eyebrow">Change propagation</p>
              <h2 className="display mt-4 text-4xl font-black leading-[1.04] sm:text-5xl">
                Events change.
                <span className="block text-[#7f8998]">The plan cannot stay static.</span>
              </h2>
            </div>
            <div className="grid gap-4">
              {[
                ['The date moves', 'Recalculate backward target dates from the same execution logic.'],
                ['Attendance changes', 'Regenerate the plan to reassess venue, catering, staffing, security, registration and production assumptions.'],
                ['The venue changes', 'Regenerate venue-dependent work, risks, supplier requirements and contingency planning.'],
              ].map(([title, desc], i) => (
                <div key={title} className="flex gap-5 rounded-[24px] border border-black/[0.055] bg-white p-5 sm:p-6">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f0e5c5] text-[#80631f]">
                    {i === 0 ? <RefreshCw size={16} /> : i === 1 ? <Layers3 size={16} /> : <GitBranch size={16} />}
                  </span>
                  <div>
                    <h3 className="font-black tracking-[-0.02em] text-[#23324a]">{title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-[#707b8c]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="bg-white py-24 sm:py-28">
        <div className="shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Professional event models</p>
              <h2 className="display mt-4 text-4xl font-black leading-[1.04] sm:text-5xl">
                Depth where operational failure is expensive.
              </h2>
            </div>
            <a href="/browse" className="text-sm font-black text-[#786027] hover:text-[#15233f]">
              Explore the event library →
            </a>
          </div>

          <div className="mt-12 grid border-y border-black/[0.07] md:grid-cols-2 lg:grid-cols-3">
            {[
              ['Corporate conference', 'Program, speakers, registration, production, venue and sponsors.'],
              ['Executive retreat', 'Confidentiality, facilitation, travel, accommodation and follow-up.'],
              ['Customer event', 'Audience, content, CRM, production, hospitality and post-event actions.'],
              ['Training workshop', 'Curriculum, materials, facilitators, logistics and evaluation.'],
              ['Gala / fundraiser', 'Donors, auction, entertainment, catering, payments and stewardship.'],
              ['Product launch', 'Product readiness, press, content, production, event operations and reporting.'],
            ].map(([title, desc], i) => (
              <a
                key={title}
                href="/custom"
                className={`group p-7 transition-colors hover:bg-[#f8f5ec] ${
                  i % 3 ? 'lg:border-l lg:border-black/[0.07]' : ''
                } ${i > 2 ? 'lg:border-t lg:border-black/[0.07]' : ''}`}
              >
                <p className="text-lg font-black tracking-[-0.025em] text-[#23324a] group-hover:text-[#80631f]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#758092]">{desc}</p>
                <span className="mt-5 inline-block text-sm font-black text-[#9a7b31]">Build this plan →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f2ea] py-24 sm:py-28">
        <div className="shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Simple entry point</p>
            <h2 className="display mt-4 text-4xl font-black sm:text-5xl">
              See the structure first. Pay for the complete execution plan.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#6e798a]">
              DEngine is designed to prove value before asking a team to change its workflow.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-black/[0.055] bg-white p-7">
              <p className="text-sm font-black text-[#23324a]">Free preview</p>
              <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#15233f]">$0</p>
              <p className="mt-4 text-sm leading-6 text-[#737e8f]">
                See the event architecture, sample workstreams, dependency logic and high-level timing.
              </p>
              <a href="/custom" className="btn-secondary mt-7 w-full">Build a preview</a>
            </div>
            <div className="rounded-[28px] border border-[#c8aa5a] bg-[#15233f] p-7 text-white shadow-xl shadow-[#15233f]/10">
              <p className="text-sm font-black text-[#efcd6d]">Complete execution plan</p>
              <p className="mt-3 text-4xl font-black tracking-[-0.04em]">$39 <span className="text-sm font-bold text-white/35">/ event</span></p>
              <p className="mt-4 text-sm leading-6 text-white/58">
                Full tailored plan with backward dates, owners, dependencies, risks, approvals and completion criteria.
              </p>
              <a href="/custom" className="btn-signal mt-7 w-full">Build my plan</a>
            </div>
          </div>

          <div className="mt-7 text-center">
            <a href="/pricing" className="text-sm font-black text-[#80631f] hover:text-[#15233f]">See pricing for teams and agencies →</a>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 className="display mt-4 text-4xl font-black">What teams need to know.</h2>
          </div>
          <div className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
            {faq.map(item => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-black text-[#23324a]">
                  {item.q}
                  <span className="text-xl font-light text-[#9a7b31] group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pb-2 pt-3 text-sm leading-7 text-[#707b8c]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf7] pb-24">
        <div className="shell">
          <div className="overflow-hidden rounded-[36px] bg-[#15233f] px-7 py-12 text-center text-white sm:px-12 sm:py-16">
            <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#efcd6d]">Start with the fixed date</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-[1.03] tracking-[-0.04em] sm:text-5xl">
              Build the event operating model before you manage the tasks.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55">
              Give DEngine the event objective, date and operating context. Get the execution architecture back.
            </p>
            <a href="/custom" className="btn-signal mt-8">
              Build my execution plan <ArrowRight className="ml-2" size={16} />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
