import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import StockChart from './StockChart'

const COMPANY_INFO: Record<string, { name: string; description: string }> = {
  AAPL: {
    name: 'Apple Inc.',
    description: 'Apple designs and sells consumer electronics, software, and services, most notably the iPhone, Mac, and App Store ecosystem.',
  },
  TSLA: {
    name: 'Tesla, Inc.',
    description: 'Tesla designs and manufactures electric vehicles, energy storage systems, and solar products, and is a leader in autonomous driving technology.',
  },
  GOOGL: {
    name: 'Alphabet Inc.',
    description: 'Alphabet is the parent company of Google, whose products include Search, YouTube, Android, and a growing cloud computing business.',
  },
  MSFT: {
    name: 'Microsoft Corp.',
    description: 'Microsoft develops software, cloud services, and hardware including Windows, Azure, Office 365, and the Xbox gaming platform.',
  },
  AMZN: {
    name: 'Amazon.com, Inc.',
    description: 'Amazon operates the world\'s largest e-commerce marketplace and cloud computing platform (AWS), alongside streaming, advertising, and logistics businesses.',
  },
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type Position = { ticker: string; shares: number; price: number; purchasePrice?: number }

export default async function StockDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: rawTicker } = await params
  const ticker = rawTicker.toUpperCase()

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: historyRows }, { data: portfolio }] = await Promise.all([
    supabase
      .from('price_history')
      .select('price, fetched_at')
      .eq('ticker', ticker)
      .order('fetched_at', { ascending: false })
      .limit(50),
    supabase
      .from('portfolios')
      .select('positions')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const prices = (historyRows ?? []).reverse()
  const currentPrice = prices[prices.length - 1]?.price ?? null
  const previousPrice = prices[prices.length - 2]?.price ?? null
  const priceChange = currentPrice != null && previousPrice != null ? currentPrice - previousPrice : null
  const priceChangePct = priceChange != null && previousPrice != null && previousPrice > 0
    ? (priceChange / previousPrice) * 100
    : null
  const up = priceChange != null && priceChange >= 0

  const positions: Position[] = portfolio?.positions ?? []
  const position = positions.find((p) => p.ticker === ticker) ?? null

  const company = COMPANY_INFO[ticker] ?? null

  const unrealizedGL = position && currentPrice != null
    ? (currentPrice - (position.purchasePrice ?? position.price)) * position.shares
    : null
  const unrealizedPct = position && currentPrice != null && (position.purchasePrice ?? position.price) > 0
    ? ((currentPrice - (position.purchasePrice ?? position.price)) / (position.purchasePrice ?? position.price)) * 100
    : null

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

      <main className="flex-1 px-6 pt-10 pb-44">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <Link
            href="/simulate"
            className="inline-flex items-center gap-1.5 text-white/50 text-sm font-medium hover:text-white/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
            Back to Simulator
          </Link>

          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">Stock Detail</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <span className="text-gold text-xs font-bold">{ticker.slice(0, 3)}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white leading-none">{ticker}</h1>
                {company && <p className="text-white/40 text-sm mt-0.5">{company.name}</p>}
              </div>
            </div>
            {currentPrice != null && (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white tabular-nums">${fmt(currentPrice)}</span>
                {priceChange != null && priceChangePct != null && (
                  <span className={`text-base font-semibold tabular-nums ${up ? 'text-green-400' : 'text-red-400'}`}>
                    {up ? '+' : '−'}${fmt(Math.abs(priceChange))} ({up ? '+' : '−'}{Math.abs(priceChangePct).toFixed(2)}%)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Chart */}
          <StockChart ticker={ticker} prices={prices} />

          {/* Company info */}
          {company && (
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-3">About</p>
              <p className="text-white font-semibold mb-1">{company.name}</p>
              <p className="text-white/60 text-sm leading-relaxed">{company.description}</p>
            </div>
          )}

          {/* Your position */}
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
            <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-4">Your Position</p>
            {position ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <p className="text-white/50 text-sm">Shares owned</p>
                  <p className="text-white font-semibold tabular-nums">{position.shares}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white/50 text-sm">Avg purchase price</p>
                  <p className="text-white font-semibold tabular-nums">${fmt(position.purchasePrice ?? position.price)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white/50 text-sm">Current price</p>
                  <p className="text-white font-semibold tabular-nums">
                    {currentPrice != null ? `$${fmt(currentPrice)}` : '—'}
                  </p>
                </div>
                {unrealizedGL != null && unrealizedPct != null && (
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <p className="text-white/50 text-sm">Unrealized G/L</p>
                    <p className={`font-bold tabular-nums ${unrealizedGL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {unrealizedGL >= 0 ? '+' : '−'}${fmt(Math.abs(unrealizedGL))} ({unrealizedGL >= 0 ? '+' : '−'}{Math.abs(unrealizedPct).toFixed(2)}%)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/30 text-sm">You don&apos;t own any {ticker} yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* Action bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-3 bg-navy/95 backdrop-blur border-t border-white/10">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button className="flex-1 py-3 rounded-xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity">
            Buy {ticker}
          </button>
          {position && (
            <button className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 text-sm font-bold hover:bg-white/5 transition-colors">
              Sell {ticker}
            </button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
