import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-navy px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-sm">IQ</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              InvestQuest
            </span>
          </div>
          <Link href="/login" className="text-white/70 text-sm font-semibold hover:text-white transition-colors">
            Log in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="bg-navy flex items-center justify-center px-6 py-32">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold text-white leading-tight sm:text-6xl">
            Learn money.{" "}
            <span className="text-gold">Build wealth.</span>{" "}
            Beat the market.
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto">
            The smart way to grow your financial knowledge and confidence —
            one lesson at a time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-gold text-navy font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </Link>
            <a href="#features" className="border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="bg-navy border-t border-white/10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest text-center mb-3">
            Why InvestQuest
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-14">
            Everything you need to invest with confidence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-8 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-2xl">
                📚
              </div>
              <h3 className="text-white font-bold text-lg">Bite-sized lessons</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Master investing concepts in minutes, not hours. Learn at your own pace with short, focused lessons designed to stick.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-8 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-2xl">
                📈
              </div>
              <h3 className="text-white font-bold text-lg">Practice with real stocks</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Simulate trades using $10,000 in virtual cash and live-ish prices. Build your instincts without risking a dollar.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-8 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-2xl">
                🏆
              </div>
              <h3 className="text-white font-bold text-lg">Track your progress</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Earn XP, maintain streaks, and level up as you learn. Stay motivated with a system that rewards consistency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-[10px]">IQ</span>
            </div>
            <span className="text-white/40 text-sm">InvestQuest</span>
          </div>
          <p className="text-white/30 text-sm">© 2026 InvestQuest</p>
        </div>
      </footer>
    </div>
  )
}
