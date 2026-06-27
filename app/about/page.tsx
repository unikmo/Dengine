export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-gold/30 text-navy px-4 py-2 rounded-full text-sm font-medium mb-6">
          How Dengine works
        </div>
        <h1 className="text-4xl font-bold text-navy mb-4">
          Every event. Already decomposed.
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Dengine holds a knowledge base of 266+ event types — each broken into specific, 
          time-bounded tasks that anyone can claim and complete.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6 mb-16">
        {[
          {
            step: '01', title: 'Find your event',
            desc: 'Search 266+ event types from weddings to city marathons, bake sales to corporate galas. The knowledge base covers virtually every type of human gathering.',
            icon: '🔍'
          },
          {
            step: '02', title: 'Answer 5 quick questions',
            desc: 'Guest count, budget approach (cost-efficient to extravagant), first time running it, volunteer-led or professional team, indoor or outdoor. That\'s it.',
            icon: '❓'
          },
          {
            step: '03', title: 'Dengine loads the blueprint',
            desc: 'Tasks are drawn from the knowledge base and shaped to your answers. No reinventing the wheel — Dengine already knows how to run your event.',
            icon: '⚡'
          },
          {
            step: '04', title: 'Share and distribute',
            desc: 'Volunteers tap to claim individual tasks. No one person carries everything. Every task is 15 minutes or less — so anyone can say yes.',
            icon: '🙌'
          },
        ].map(s => (
          <div key={s.step} className="flex gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex-shrink-0 w-14 h-14 bg-navy rounded-xl flex items-center justify-center text-2xl">
              {s.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-gold mb-1">STEP {s.step}</div>
              <h3 className="text-lg font-bold text-navy mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* The philosophy */}
      <div className="bg-navy text-white rounded-2xl p-10 mb-12">
        <h2 className="text-2xl font-bold mb-4">The Dengine philosophy</h2>
        <div className="space-y-4 text-white/80">
          <p>Most event planning tools tell you <em>what</em> to do. Dengine tells you <em>who does what, for how long</em> — so participation is designed, not hoped for.</p>
          <p>Every task in the knowledge base is 15 minutes or less for volunteer-driven events. That's not arbitrary. It's the threshold at which someone goes from "I can't commit to this" to "yes, I can do that one thing."</p>
          <p>When the whole team carries one task each, no one carries the whole event.</p>
        </div>
      </div>

      {/* Two modes */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-bold text-navy mb-2">Pre-built blueprints</h3>
          <p className="text-gray-600 text-sm">266+ events with tasks already defined, tested, and ready. Select your event and everything loads instantly from the knowledge base.</p>
          <a href="/browse" className="inline-block mt-4 text-navy font-semibold text-sm hover:underline">Browse all events →</a>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="text-3xl mb-3">✨</div>
          <h3 className="text-lg font-bold text-navy mb-2">Custom event builder</h3>
          <p className="text-gray-600 text-sm">Planning something unique? Describe it and Dengine builds a tailored blueprint based on your event type, scale, and budget approach.</p>
          <a href="/custom" className="inline-block mt-4 text-navy font-semibold text-sm hover:underline">Build a custom blueprint →</a>
        </div>
      </div>

      <div className="text-center">
        <a href="/" className="bg-navy text-white px-8 py-4 rounded-xl font-semibold hover:bg-navy/90 transition-colors inline-block text-lg">
          Start planning
        </a>
      </div>
    </main>
  )
}
