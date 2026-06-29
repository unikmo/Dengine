export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-6">Event planning, decomposed</p>
        <h1 className="text-5xl sm:text-6xl font-bold text-navy mb-6 leading-[1.1] max-w-3xl">
          Plan any event.<br />Every task claimable.
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mb-12 leading-relaxed">
          Dengine breaks your event into tasks your whole team can claim — each under 15 minutes. No checklist chaos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <a
            href="/browse"
            className="bg-gold text-navy font-bold px-8 py-4 rounded-xl text-sm hover:bg-yellow-300 transition-colors"
          >
            Browse event blueprints
          </a>
          <a
            href="/custom"
            className="bg-white text-navy font-bold px-8 py-4 rounded-xl text-sm border border-gray-200 hover:border-navy/30 hover:shadow-sm transition-all"
          >
            Describe my event →
          </a>
        </div>

        <div className="flex items-center gap-8 text-sm text-gray-400">
          <span>266 event types</span>
          <span className="text-gray-200">·</span>
          <span>Every task under 15 min</span>
          <span className="text-gray-200">·</span>
          <span>Free to start</span>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-navy text-center mb-14">How Dengine works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              step: '01',
              title: 'Find your event',
              body: 'Browse 266 event types or describe yours. We have weddings, galas, marathons, conferences, school fairs, and more.',
            },
            {
              step: '02',
              title: 'Get the blueprint',
              body: 'Every event breaks into Promotion, Setup, Execution, and Cleanup tasks — each taking 15 minutes or less.',
            },
            {
              step: '03',
              title: 'Assign and track',
              body: 'Your team claims tasks by name. Download as PDF. Everyone knows exactly what they own.',
            },
          ].map(({ step, title, body }) => (
            <div key={step}>
              <div className="text-gold text-sm font-bold mb-3">{step}</div>
              <h3 className="font-bold text-navy text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
