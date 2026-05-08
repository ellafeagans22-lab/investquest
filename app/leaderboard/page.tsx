import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { getStockPrices, type StockPrice } from '@/lib/getStockPrices'

const medals = ['🥇', '🥈', '🥉']

const STARTING_BALANCE = 10_000

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  type RawPosition = { ticker: string; shares: number; price: number; purchasePrice?: number }

  const [{ data: rows }, { data: portfolios }, livePrices] = await Promise.all([
    supabase.from('leaderboard').select('user_id, display_name'),
    supabase.from('portfolios').select('user_id, cash_balance, positions'),
    getStockPrices().catch(() => [] as StockPrice[]),
  ])

  const entries = (rows ?? [])
    .map((row) => {
      const portfolio = (portfolios ?? []).find((p) => p.user_id === row.user_id)
      const cash: number = portfolio?.cash_balance ?? 0
      const positions: RawPosition[] = portfolio?.positions ?? []
      const positionsValue = positions.reduce((sum, pos) => {
        const livePrice = livePrices.find((p) => p.ticker === pos.ticker)?.price ?? pos.purchasePrice ?? pos.price ?? 0
        return sum + pos.shares * livePrice
      }, 0)
      return { user_id: row.user_id, display_name: row.display_name, total_value: cash + positionsValue }
    })
    .sort((a, b) => b.total_value - a.total_value)

  const myEntry = entries.find((e) => e.user_id === user.id)
  const myTotal = myEntry?.total_value ?? STARTING_BALANCE
  const myGainPct = ((myTotal - STARTING_BALANCE) / STARTING_BALANCE) * 100

  type LeagueTier = { name: string; emoji: string; min: number; max: number | null; barColor: string; bgClass: string }
  const LEAGUES: LeagueTier[] = [
    { name: 'Bronze League',  emoji: '🥉', min: -Infinity, max: 0,    barColor: '#92400e', bgClass: 'from-amber-900/40 to-amber-800/10 border-amber-700/40' },
    { name: 'Silver League',  emoji: '🥈', min: 0,         max: 5,    barColor: '#94a3b8', bgClass: 'from-slate-500/30 to-slate-400/10 border-slate-400/30' },
    { name: 'Gold League',    emoji: '🥇', min: 5,         max: 15,   barColor: '#F59E0B', bgClass: 'from-amber-500/25 to-amber-400/10 border-amber-400/30' },
    { name: 'Diamond League', emoji: '💎', min: 15,        max: null,  barColor: '#38bdf8', bgClass: 'from-sky-500/25 to-sky-400/10 border-sky-400/30' },
  ]
  const currentLeague = LEAGUES.findLast((l) => myGainPct >= l.min) ?? LEAGUES[0]
  const nextLeague = currentLeague.max !== null ? LEAGUES[LEAGUES.indexOf(currentLeague) + 1] : null

  const BRONZE_FLOOR = -20
  const progressPct = nextLeague === null
    ? 100
    : currentLeague.name === 'Bronze League'
      ? Math.max(0, Math.min(100, ((myGainPct - BRONZE_FLOOR) / (0 - BRONZE_FLOOR)) * 100))
      : Math.min(100, ((myGainPct - currentLeague.min) / (currentLeague.max! - currentLeague.min)) * 100)
  const pctToNext = nextLeague ? Math.max(0, (nextLeague.min - myGainPct)).toFixed(1) : null

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
            Rankings
          </p>
          <h1 className="text-3xl font-bold text-white mb-8">Leaderboard</h1>

          {/* League banner */}
          <div className={`bg-gradient-to-br ${currentLeague.bgClass} border rounded-2xl px-6 py-5 mb-6`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">{currentLeague.emoji}</span>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{currentLeague.name}</p>
                  <p className="text-white/40 text-xs">
                    {myGainPct >= 0 ? '+' : ''}{myGainPct.toFixed(2)}% return
                  </p>
                </div>
              </div>
              {nextLeague ? (
                <div className="text-right">
                  <p className="text-white/30 text-xs font-medium">Next tier</p>
                  <p className="text-white/60 text-sm font-semibold">
                    {nextLeague.emoji} {nextLeague.name.replace(' League', '')}
                  </p>
                  <p className="text-white/30 text-xs">+{pctToNext}% to go</p>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-sky-400 text-xs font-bold uppercase tracking-widest">Max tier</p>
                </div>
              )}
            </div>
            {/* Progress bar */}
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, backgroundColor: currentLeague.barColor }}
              />
            </div>
            {nextLeague && (
              <div className="flex justify-between mt-1.5">
                <span className="text-white/20 text-[10px]">{currentLeague.name.replace(' League', '')}</span>
                <span className="text-white/20 text-[10px]">{nextLeague.name.replace(' League', '')}</span>
              </div>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="text-4xl">📊</span>
              <p className="text-white/30 text-sm font-medium">No portfolios yet</p>
            </div>
          ) : (
            <ol className="flex flex-col gap-3">
              {entries.map((entry, index) => {
                const isCurrentUser = entry.user_id === user.id
                const medal = medals[index] ?? null
                const rank = index + 1

                const totalValue = entry.total_value ?? 0
                const gl = totalValue - STARTING_BALANCE
                const glPct = (gl / STARTING_BALANCE) * 100
                const up = gl >= 0
                const glStr = `${up ? '+' : '−'}$${fmt(Math.abs(gl))} (${up ? '+' : '−'}${Math.abs(glPct).toFixed(1)}%)`

                return (
                  <li key={entry.user_id}>
                    <div
                      className={`flex items-center gap-4 rounded-2xl px-5 py-4 border transition-colors ${
                        isCurrentUser
                          ? 'bg-gold/10 border-gold/40'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-8 shrink-0 flex items-center justify-center">
                        {medal ? (
                          <span className="text-2xl">{medal}</span>
                        ) : (
                          <span className={`text-sm font-bold tabular-nums ${isCurrentUser ? 'text-gold' : 'text-white/30'}`}>
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar initial */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                        isCurrentUser
                          ? 'bg-gold/30 border-2 border-gold/60 text-gold'
                          : 'bg-white/10 border border-white/10 text-white/40'
                      }`}>
                        {(entry.display_name ?? '?')[0].toUpperCase()}
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${isCurrentUser ? 'text-gold' : 'text-white'}`}>
                          {entry.display_name ?? 'Anonymous'}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs font-normal text-gold/60">you</span>
                          )}
                        </p>
                      </div>

                      {/* Total value + gain/loss */}
                      <div className="text-right shrink-0">
                        <p className={`font-bold tabular-nums ${isCurrentUser ? 'text-gold' : 'text-white'}`}>
                          ${fmt(totalValue)}
                        </p>
                        <p className={`text-xs tabular-nums font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>
                          {glStr}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
