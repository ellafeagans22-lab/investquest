const units = [
  {
    title: 'Investing Basics',
    lessons: [
      'What is the Stock Market?',
      'What is a Share?',
      'Bulls vs. Bears',
    ],
  },
]

export default function LearnPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
            <span className="text-navy font-bold text-sm">IQ</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">
            InvestQuest
          </span>
        </div>
      </nav>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">
            Learn
          </p>
          <h1 className="text-3xl font-bold text-white mb-10">Your lessons</h1>

          {units.map((unit) => (
            <section key={unit.title} className="mb-10">
              {/* Unit header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
                  {unit.title}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Lesson cards */}
              <ol className="flex flex-col gap-3">
                {unit.lessons.map((lesson, index) => (
                  <li key={lesson}>
                    <button className="w-full text-left flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/40 rounded-xl px-5 py-4 transition-colors group">
                      <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-sm font-bold shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
                        {index + 1}
                      </span>
                      <span className="text-white font-medium">{lesson}</span>
                      <span className="ml-auto text-white/30 group-hover:text-gold transition-colors">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
