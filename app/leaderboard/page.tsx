import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

const medals = ['🥇', '🥈', '🥉']

const STARTING_BALANCE = 10_000

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: rows } = await supabase
    .from('leaderboard')
    .select('user_id, display_name, total_value')

  const entries = rows ?? []

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
