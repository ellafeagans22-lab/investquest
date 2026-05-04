import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, xp, streak')
    .eq('id', user.id)
    .maybeSingle()

  const xp = profile?.xp ?? 0
  const streak = profile?.streak ?? 0
  const displayName = profile?.display_name ?? null

  const level = Math.floor(xp / 100) + 1
  const xpInLevel = xp % 100
  const xpToNext = 100 - xpInLevel

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
            Profile
          </p>
          <h1 className="text-3xl font-bold text-white mb-8">
            {displayName ?? user.email}
          </h1>

          <div className="flex flex-col gap-4">
            {/* Avatar + name card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shrink-0">
                <span className="text-gold text-2xl font-bold">
                  {(displayName ?? user.email ?? '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-lg truncate">
                  {displayName ?? '—'}
                </p>
                <p className="text-white/50 text-sm truncate">{user.email}</p>
              </div>
            </div>

            {/* Level & XP card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                    Level
                  </p>
                  <p className="text-3xl font-bold text-white">{level}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                    Total XP
                  </p>
                  <p className="text-3xl font-bold text-gold">{xp}</p>
                </div>
              </div>

              {/* XP progress bar */}
              <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all"
                  style={{ width: `${xpInLevel}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                <span>Level {level}</span>
                <span>{xpToNext} XP to level {level + 1}</span>
              </div>
            </div>

            {/* Streak card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                  Daily streak
                </p>
                <p className="text-3xl font-bold text-white">
                  {streak}{' '}
                  <span className="text-lg font-medium text-white/60">
                    {streak === 1 ? 'day' : 'days'}
                  </span>
                </p>
              </div>
              <span className="text-5xl" role="img" aria-label="fire">🔥</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
