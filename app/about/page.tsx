export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-navy mb-4">Every event. Already decomposed.</h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">Dengine holds a knowledge base of 266+ event types — each broken into specific, time-bounded tasks that anyone can claim and complete.</p>
      </div>
      <div className="space-y-6 mb-16">
        {[{step:'01',title:'Find your event',desc:'Search 266+ event types from weddings to city marathons, bake sales to corporate galas.',icon:'🔍'},{step:'02',title:'Answer 5 quick questions',desc:'Guest count, budget approach, first time, volunteer-led or professional, indoor or outdoor.',icon:'❓'},{step:'03',title:'Dengine loads the blueprint',desc:'Tasks are drawn from the knowledge base and shaped to your answers. No reinventing the wheel.',icon:'⚡'},{step:'04',title:'Share and distribute',desc:'Volunteers tap to claim tasks. Every task is 15 minutes or less — so anyone can say yes.',icon:'🙌'}].map(s=>(
          <div key={s.step} className="flex gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex-shrink-0 w-14 h-14 bg-navy rounded-xl flex items-center justify-center text-2xl">{s.icon}</div>
            <div><div className="text-xs font-bold text-gold mb-1">STEP {s.step}</div><h3 className="text-lg font-bold text-navy mb-2">{s.title}</h3><p className="text-gray-600">{s.desc}</p></div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <a href="/" className="bg-navy text-white px-8 py-4 rounded-xl font-semibold hover:bg-navy/90 transition-colors inline-block text-lg">Start planning</a>
      </div>
    </main>
  )
}
