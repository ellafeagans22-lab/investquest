export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-navy px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          {/* Logo placeholder */}
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
            <span className="text-navy font-bold text-sm">IQ</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">
            InvestQuest
          </span>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 bg-navy flex items-center justify-center px-6 py-32">
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
            <button className="bg-gold text-navy font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <button className="border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
