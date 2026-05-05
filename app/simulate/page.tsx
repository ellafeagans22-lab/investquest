import BottomNav from '@/components/BottomNav'

const stocks = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: 213.49 },
  { ticker: 'TSLA', name: 'Tesla, Inc.', price: 174.82 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 172.63 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: 415.30 },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.', price: 196.11 },
]

export default function SimulatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
            <span className="text-navy font-bold text-sm">IQ</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">
            InvestQuest
          </span>
        </div>
      </nav>

      <main className="flex-1 px-6 pt-12 pb-28">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">
            Simulate
          </p>
          <h1 className="text-3xl font-bold text-white mb-8">
            Investment Simulator
          </h1>

          <div className="flex flex-col gap-4">
            {/* Cash balance card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                  Virtual Cash
                </p>
                <p className="text-3xl font-bold text-gold">$10,000.00</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gold">
                  <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
                  <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                </svg>
              </div>
            </div>

            {/* Portfolio section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-4">
                Your Portfolio
              </p>
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <span className="text-3xl">📭</span>
                <p className="text-white/30 text-sm font-medium">No positions yet</p>
                <p className="text-white/20 text-xs">Buy a stock below to get started</p>
              </div>
            </div>

            {/* Market section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-4">
                Market
              </p>
              <ul className="flex flex-col divide-y divide-white/5">
                {stocks.map((stock) => (
                  <li key={stock.ticker} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold text-[10px] font-bold">{stock.ticker.slice(0, 3)}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{stock.ticker}</p>
                        <p className="text-white/40 text-xs">{stock.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-semibold tabular-nums">
                        ${stock.price.toFixed(2)}
                      </p>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-gold text-navy text-xs font-bold hover:opacity-90 transition-opacity"
                        disabled
                      >
                        Buy
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
