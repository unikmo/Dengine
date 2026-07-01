export default function HomePage() {
  return (
    <div className="bg-white">

      {/* HERO */}
      <section className="bg-[#0f1729] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-widest text-gold uppercase mb-6">
              Event Planning, Decomposed
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Choose one.<br />
              Create one.<br />
              <span className="text-gold">Execute both.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
              Start with one of 400+ professionally planned event blueprints —
              or describe your own. Dengine breaks it all down into clear tasks,
              owners, timelines, and dependencies.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="/browse"
                className="bg-gold text-navy font-bold px-6 py-3.5 rounded-xl hover:bg-yellow-300 transition-all">
                Browse 400+ Blueprints →
              </a>
              <a href="/custom"
                className="border-2 border-white/30 text-white font-bold px-6 py-3.5 rounded-xl hover:border-white/60 transition-all">
                Create My Event →
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/40">
              <span>⚡ 400+ event blueprints</span>
              <span>✓ Every detail mapped</span>
              <span>🆓 Free to start</span>
            </div>
          </div>

          {/* Blueprint preview card */}
          <div className="bg-[#1a2540] rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-gold/20 rounded-lg flex items-center justify-center text-lg">☀️</div>
              <div>
                <div className="font-bold text-white">School Sports Day</div>
                <div className="text-xs text-white/40">87 tasks · 4 layers · 4–6 weeks</div>
              </div>
            </div>
            <div className="space-y-3 py-4">
              {[
                { label: 'Promotion', count: 12 },
                { label: 'Setup',     count: 38 },
                { label: 'Execution', count: 28 },
                { label: 'Cleanup',   count:  9 },
              ].map(layer => (
                <div key={layer.label} className="flex items-center justify-between text-sm">
                  <span className="text-white/70 flex items-center gap-2">
                    <span className="text-gold/60 text-xs">✓</span>
                    {layer.label}
                  </span>
                  <span className="text-white/30">{layer.count} tasks</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10">
              <span className="text-white/40">↓ Download Blueprint</span>
              <span className="text-gold font-medium">✏ Customise →</span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR BLUEPRINTS STRIP */}
      <section className="bg-white py-12 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-navy mb-1">Popular blueprints</p>
          <p className="text-xs text-gray-400 mb-5">See what others are planning.</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {[
              'Sports Day','Walkathon','Wedding','Product Launch',
              'Charity Gala','Conference','Music Festival','School Fair',
              'Team Building','Hackathon','Fun Run','Gala Dinner',
            ].map(name => (
              <a key={name} href="/browse"
                className="flex-shrink-0 px-5 py-2.5 rounded-full border border-navy text-navy text-sm font-medium hover:bg-navy hover:text-white transition-all whitespace-nowrap">
                {name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">How Dengine works</h2>
          <p className="text-gray-500 mb-14">From idea to execution blueprint in minutes.</p>
          <div className="grid sm:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choose',   desc: 'Pick from 400+ blueprints or describe your own event.' },
              { step: '02', title: 'Answer',   desc: 'A few quick questions about scale, budget and context.' },
              { step: '03', title: 'Generate', desc: 'Dengine builds your complete task blueprint instantly.' },
              { step: '04', title: 'Download', desc: 'Take your blueprint and run with it. Every task is clear, owned, and ready to action.' },
            ].map((s, i) => (
              <div key={s.step} className="text-center relative">
                <div className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Step {s.step}</div>
                <div className="font-bold text-navy text-lg mb-2">{s.title}</div>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {i < 3 && (
                  <div className="hidden sm:block absolute top-1 -right-4 text-gray-200 text-xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLUEPRINT LIBRARY */}
      <section className="bg-[#f5f0e8] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-3">The world's largest event blueprint library</h2>
            <p className="text-gray-500">400+ pre-tasked events. Professionally built execution blueprints. New events added every week.</p>
          </div>
          <div className="max-w-3xl mx-auto divide-y divide-gray-100">
            {[
              { name: 'Schools',        count: '120+' },
              { name: 'Corporate',      count: '95+'  },
              { name: 'Private Events', count: '110+' },
              { name: 'Nonprofits',     count: '80+'  },
              { name: 'Sports',         count: '60+'  },
              { name: 'Festivals',      count: '40+'  },
            ].map(cat => (
              <div key={cat.name} className="flex items-center justify-between py-5">
                <span className="font-semibold text-navy text-lg">{cat.name}</span>
                <div className="flex items-center gap-8">
                  <span className="text-gray-400 text-sm">{cat.count} blueprints</span>
                  <a href="/browse" className="text-gold font-semibold text-sm hover:underline">Browse →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-2">Simple pricing. No subscriptions.</h2>
          <p className="text-gray-400 text-sm mb-8">Pay once per event. Start free, always.</p>
          <div className="divide-y divide-gray-100">
            {[
              { tier: 'Free',         desc: 'Browse everything. Email required.',                 price: 'Free'          },
              { tier: 'Personal',     desc: 'Customise any personal event blueprint.',            price: '$9.99 / event' },
              { tier: 'Community',    desc: 'Charity, civic and community events.',               price: '$15 / event'   },
              { tier: 'Professional', desc: 'Full toolkit for corporate and large-scale events.', price: '$59 / event'   },
            ].map(row => (
              <div key={row.tier} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-6">
                  <span className="font-semibold text-navy w-28">{row.tier}</span>
                  <span className="text-gray-400 text-sm">{row.desc}</span>
                </div>
                <span className="font-bold text-navy text-sm flex-shrink-0 ml-4">{row.price}</span>
              </div>
            ))}
          </div>
          <a href="/pricing" className="text-gold font-semibold text-sm hover:underline block mt-6">
            See full pricing →
          </a>
        </div>
      </section>

      {/* BOTTOM CTA CARDS */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-[#f5f0e8] rounded-2xl p-8">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="font-bold text-navy text-xl mb-2">Need inspiration?</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Explore 400+ professionally built blueprints. Enter your email and download the full task list.
            </p>
            <a href="/browse" className="text-gold font-semibold hover:underline text-sm">Browse the Library →</a>
          </div>
          <div className="bg-[#f5f0e8] rounded-2xl p-8">
            <div className="text-3xl mb-4">✏️</div>
            <h3 className="font-bold text-navy text-xl mb-2">Already know your event?</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Describe it — Dengine builds a complete execution blueprint in seconds.
            </p>
            <a href="/custom" className="text-gold font-semibold hover:underline text-sm">Create your Blueprint →</a>
          </div>
        </div>
      </section>

    </div>
  )
}
