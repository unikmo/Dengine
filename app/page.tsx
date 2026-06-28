export default function HomePage() {
  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">Dengine</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-navy mb-6 leading-tight">
          Plan any event.<br />Every task claimable.
        </h1>
        <div className="bg-navy rounded-2xl px-8 py-5 mb-10 max-w-xl mx-auto">
          <p className="text-white/70 text-base leading-relaxed">
            Others hand you a checklist.{' '}
            <span className="text-white font-semibold">
              Dengine gives you a blueprint where every task takes 15 minutes —
              so your whole team can help.
            </span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
          <a
            href="/browse"
            className="bg-gold text-navy rounded-2xl p-8 text-left hover:bg-yellow-300 transition-all group min-h-[260px] flex flex-col justify-between"
          >
            <div>
              <div className="font-bold text-xl mb-2">Find my event</div>
              <div className="text-navy/60 text-sm leading-relaxed">
                Wedding, gala, marathon, conference — if it's been done before, we've decomposed it.
              </div>
            </div>
            <div className="text-navy text-sm font-bold group-hover:underline">Browse blueprints →</div>
          </a>

          <a
            href="/custom"
            className="bg-white border-2 border-navy text-navy rounded-2xl p-8 text-left hover:bg-navy/5 transition-all group min-h-[260px] flex flex-col justify-between"
          >
            <div>
              <div className="font-bold text-xl mb-2">Describe my event</div>
              <div className="text-navy/60 text-sm leading-relaxed">
                Tell Dengine what you're planning. It builds your task blueprint in seconds.
              </div>
            </div>
            <div className="text-navy text-sm font-bold group-hover:underline">Build a blueprint →</div>
          </a>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <span>266 event types</span>
          <span className="text-gray-200">·</span>
          <span>Every task under 15 minutes</span>
          <span className="text-gray-200">·</span>
          <span>Free to start</span>
        </div>
      </div>
    </main>
  )
}
