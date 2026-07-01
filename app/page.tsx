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
              <span>✓ Every task claimable</span>
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
            <div className="space-y-4 mb-6">
              {[
                { icon: '📣', label: 'Promotion', tasks: 12, width: '30%',  color: 'bg-blue-500' },
                { icon: '🔧', label: 'Setup',     tasks: 38, width: '90%',  color: 'bg-amber-500' },
                { icon: '⚡', label: 'Execution', tasks: 28, width: '70%',  color: 'bg-green-500' },
                { icon: '🧹', label: 'Cleanup',   tasks:  9, width: '22%',  color: 'bg-gray-400'  },
              ].map(layer => (
                <div key={layer.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/70">{layer.icon} {layer.label}</span>
                    <span className="text-xs text-white/40">{layer.tasks} tasks</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${layer.color} rounded-full`} style={{ width: layer.width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-xs text-green-400 font-semibold">✓ Blueprint ready</span>
              <a href="/browse" className="text-gold text-xs font-semibold hover:underline">See tasks →</a>
            </div>
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
              { step: '01', icon: '🔍', title: 'Choose',   desc: 'Pick from 400+ blueprints or describe your own event.' },
              { step: '02', icon: '💬', title: 'Answer',   desc: 'A few quick questions about scale, budget and context.' },
              { step: '03', icon: '⚡', title: 'Generate', desc: 'Dengine builds your complete task blueprint instantly.' },
              { step: '04', icon: '✅', title: 'Execute',  desc: 'Assign tasks, claim them, and deliver a great event.' },
            ].map((s, i) => (
              <div key={s.step} className="text-center relative">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Step {s.step}</div>
                <div className="font-bold text-navy text-lg mb-2">{s.title}</div>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {i < 3 && (
                  <div className="hidden sm:block absolute top-4 -right-4 text-gray-200 text-xl">→</div>
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
            <p className="text-gray-500">400+ pre-tasked events. Professionally decomposed. New events added every week.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🎓', label: 'Schools',        count: '120+' },
              { icon: '💼', label: 'Corporate',      count: '100+' },
              { icon: '🎉', label: 'Private Events', count: '100+' },
              { icon: '💛', label: 'Nonprofits',     count: '80+'  },
              { icon: '🏆', label: 'Sports',         count: '60+'  },
              { icon: '🌴', label: 'Festivals',      count: '40+'  },
            ].map(cat => (
              <a key={cat.label} href="/browse"
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-navy/20 transition-all group">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-bold text-navy text-sm group-hover:text-gold transition-colors">{cat.label}</div>
                <div className="text-xs text-gray-400 mt-1">{cat.count} blueprints</div>
              </a>
            ))}
          </div>
          <div className="text-center">
            <a href="/browse" className="text-gold font-semibold hover:underline">Explore all blueprints →</a>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA CARDS */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-[#f5f0e8] rounded-2xl p-8">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="font-bold text-navy text-xl mb-2">Free blueprint downloads</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Browse 400+ professionally planned event blueprints. Enter your email and download the full task list.
            </p>
            <a href="/browse" className="text-gold font-semibold hover:underline text-sm">Browse free blueprints →</a>
          </div>
          <div className="bg-[#f5f0e8] rounded-2xl p-8">
            <div className="text-3xl mb-4">✏️</div>
            <h3 className="font-bold text-navy text-xl mb-2">Create your own event</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Describe any event — Dengine builds a complete task blueprint in seconds.
            </p>
            <a href="/custom" className="text-gold font-semibold hover:underline text-sm">Start planning now →</a>
          </div>
        </div>
      </section>

    </div>
  )
}
