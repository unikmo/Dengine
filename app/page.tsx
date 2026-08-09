const executionModel = [
  { label: 'Venue confirmed', meta: 'Owner · Events Lead' },
  { label: 'Floorplan locked', meta: 'Approval gate' },
  { label: 'AV design final', meta: 'Depends on floorplan' },
  { label: 'Supplier scope issued', meta: 'Procurement-ready' },
  { label: 'Technical rehearsal', meta: 'Critical path' },
  { label: 'Event ready', meta: 'Completion evidence' },
]

const eventModels = [
  ['Corporate conference', 'Agenda, speakers, registration, production, venue, sponsors'],
  ['Executive retreat', 'Confidentiality, facilitation, travel, accommodation, follow-up'],
  ['Customer event', 'Audience, content, CRM, production, hospitality, post-event'],
  ['Training / workshop', 'Curriculum, materials, facilitators, logistics, evaluation'],
  ['Gala / fundraiser', 'Donors, auction, entertainment, catering, payments, stewardship'],
  ['Product launch', 'Product readiness, press, creators, content, event, reporting'],
]

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#0f1729] text-white">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-[1.08fr_.92fr] gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-gold uppercase mb-6">
              Event Execution Intelligence
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight mb-7">
              Your event date is fixed.
              <span className="block text-gold mt-2">DEngine works backwards.</span>
            </h1>
            <p className="text-white/68 text-lg sm:text-xl leading-relaxed max-w-2xl mb-9">
              Turn one event brief into the workstreams, dependencies, owners, deadlines,
              approvals, risks and completion criteria required to make the event ready.
            </p>
            <div className="flex flex-wrap gap-3 mb-9">
              <a href="/custom" className="bg-gold text-navy font-bold px-6 py-3.5 rounded-xl hover:bg-yellow-300 transition-all">
                Build my execution plan →
              </a>
              <a href="#product" className="border border-white/25 text-white font-semibold px-6 py-3.5 rounded-xl hover:border-white/55 transition-all">
                See how it works
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/45">
              <span>Dependency-aware</span>
              <span>Backward scheduled</span>
              <span>Built for professional events</span>
            </div>
          </div>

          <div className="bg-[#17223b] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-white/40 mb-1">Customer Conference · 420 attendees</p>
                <h2 className="font-bold text-xl">Execution readiness</h2>
              </div>
              <span className="text-3xl font-bold text-gold">72%</span>
            </div>
            <div className="p-6">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gold rounded-full" style={{ width: '72%' }} />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  ['Critical path', 'At risk'],
                  ['Approvals', '6 open'],
                  ['Next hard date', 'Tue 14:00'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white/[0.045] rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wide text-white/35 mb-1">{k}</p>
                    <p className="text-sm font-semibold text-white/85">{v}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  ['Floorplan approval', '4 days late · blocks AV design', 'Critical'],
                  ['Speaker content', 'blocks show file + rehearsal', 'Approval'],
                  ['Catering guarantee', 'due in 48 hours', 'Deadline'],
                ].map(([title, desc, tag]) => (
                  <div key={title} className="flex items-start gap-3 bg-white/[0.035] rounded-xl p-3.5">
                    <span className="mt-1 w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm">{title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                    </div>
                    <span className="text-[10px] border border-white/10 text-white/45 rounded-full px-2 py-1">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-7 grid sm:grid-cols-3 gap-4 text-sm">
          <div><strong className="text-navy">Not a checklist.</strong> <span className="text-gray-500">A structured execution model.</span></div>
          <div><strong className="text-navy">Not another PM tool.</strong> <span className="text-gray-500">Export into the tools you already use.</span></div>
          <div><strong className="text-navy">Not generic AI.</strong> <span className="text-gray-500">Event-specific operating logic.</span></div>
        </div>
      </section>

      <section id="product" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">From brief to operating model</p>
            <h2 className="text-4xl font-bold text-navy tracking-tight mb-4">DEngine determines what must become true.</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Templates provide reliable event logic. AI adapts that structure to your event,
              rather than inventing an entire plan from a blank prompt.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              ['01', 'Describe', 'Event type, date, scale, format, venue status and constraints.'],
              ['02', 'Model', 'DEngine builds workstreams, tasks, dependencies, approvals and risks.'],
              ['03', 'Schedule', 'Every prerequisite receives a backward-calculated deadline from event day.'],
              ['04', 'Execute', 'Track readiness, blockers and completion evidence as the event moves forward.'],
            ].map(([step, title, desc]) => (
              <div key={step} className="rounded-2xl border border-gray-100 p-6 bg-[#fcfbf8]">
                <span className="text-xs font-bold text-gold">{step}</span>
                <h3 className="font-bold text-navy text-lg mt-5 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">The Event Execution Graph</p>
            <h2 className="text-4xl font-bold text-navy tracking-tight mb-5">Tasks are useful. Relationships are valuable.</h2>
            <p className="text-gray-600 leading-relaxed mb-7">
              DEngine models prerequisites, approval gates, completion criteria, risk and procurement context.
              That means a deadline is not an isolated date — it sits inside a chain of consequences.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {['Dependencies', 'Owner roles', 'Lead times', 'Approval gates', 'Completion evidence', 'Risks + contingencies', 'Critical-path flags', 'Vendor-ready scopes'].map(item => (
                <div key={item} className="bg-white rounded-xl px-4 py-3 text-navy font-medium border border-black/[0.04]">✓ {item}</div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-black/[0.05] p-6 sm:p-8 shadow-sm">
            {executionModel.map((node, i) => (
              <div key={node.label} className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={`w-4 h-4 rounded-full border-4 ${i === executionModel.length - 1 ? 'bg-gold border-gold' : 'bg-white border-navy'}`} />
                  {i < executionModel.length - 1 && <span className="w-px h-14 bg-gray-200" />}
                </div>
                <div className="-mt-1 pb-7">
                  <p className="font-bold text-navy">{node.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{node.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Built for change</p>
            <h2 className="text-4xl font-bold text-navy tracking-tight mb-4">When the event moves, the plan should move with it.</h2>
            <p className="text-gray-500 text-lg">DEngine treats event assumptions as inputs to the operating model, not static notes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              ['Date moves', 'Shift event day and backward deadlines recalculate from the same execution logic.'],
              ['Attendance changes', 'Identify workstreams affected by scale: room setup, catering, staffing, registration and security.'],
              ['Venue changes', 'Activate or remove venue-specific requirements, risks, procurement and contingency work.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl p-7 border border-gray-100">
                <h3 className="font-bold text-navy text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#0f1729] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Depth before breadth</p>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Start with events where operational detail matters.</h2>
            <p className="text-white/50 text-lg">
              The reference library remains useful, but the core product is built around deep professional event models.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventModels.map(([title, desc]) => (
              <a href="/custom" key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 hover:bg-white/[0.07] transition-colors">
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Pricing</p>
            <h2 className="text-4xl font-bold text-navy tracking-tight mb-4">Pay for the plan. Subscribe when you repeat.</h2>
            <p className="text-gray-500">Low-friction single-event planning, with team and agency workflows as the recurring layer.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              ['Preview', '$0', 'See the event architecture, sample dependencies and high-level timeline.', 'Build a preview'],
              ['Execution Plan', '$39', 'Full tailored plan, backward schedule, risks, approvals, critical tasks and exports.', 'Build my plan'],
              ['Teams & Agencies', 'Custom', 'Multiple events, reusable company logic, approvals, history and integrations.', 'Talk to us'],
            ].map(([name, price, desc, cta], i) => (
              <div key={name} className={`rounded-2xl p-7 border ${i === 1 ? 'border-gold shadow-sm' : 'border-gray-100'}`}>
                <p className="font-bold text-navy mb-5">{name}</p>
                <p className="text-4xl font-bold text-navy mb-4">{price}{price === '$39' && <span className="text-sm font-medium text-gray-400"> / event</span>}</p>
                <p className="text-sm text-gray-500 leading-relaxed min-h-20">{desc}</p>
                <a href={i === 2 ? 'mailto:hello@dengine.app' : '/custom'} className={`mt-7 block text-center rounded-xl py-3 font-bold text-sm ${i === 1 ? 'bg-gold text-navy' : 'bg-navy text-white'}`}>{cta} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 bg-white">
        <div className="max-w-5xl mx-auto bg-[#f5f0e8] rounded-3xl p-10 sm:p-14 text-center">
          <h2 className="text-4xl font-bold text-navy tracking-tight mb-4">Build the event before you manage the tasks.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Give DEngine the event objective, fixed date and operating constraints. Get the execution architecture back.
          </p>
          <a href="/custom" className="inline-block bg-navy text-white font-bold px-7 py-3.5 rounded-xl">Build my execution plan →</a>
        </div>
      </section>
    </main>
  )
}
