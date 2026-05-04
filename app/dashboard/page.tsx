import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from './SignOutButton'

export default async function DashboardPage() {
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
  const displayName = profile?.display_name
    ? profile.display_name.charAt(0).toUpperCase() + profile.display_name.slice(1)
    : null

  const level = Math.floor(xp / 100) + 1
  const xpInLevel = xp % 100
  const xpToNext = 100 - xpInLevel

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-sm">IQ</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              InvestQuest
            </span>
          </div>
          <SignOutButton />
        </div>
      </nav>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">

          {/* Welcome */}
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-white mb-8">
            Welcome back{displayName ? `, ${displayName}` : ''}!
          </h1>

          <div className="flex flex-col gap-4">
            {/* XP & Level card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                    Level
                  </p>
                  <p className="text-2xl font-bold text-white">{level}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                    Total XP
                  </p>
                  <p className="text-2xl font-bold text-gold">{xp}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all"
                  style={{ width: `${xpInLevel}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-white/40 text-right">
                {xpToNext} XP to level {level + 1}
              </p>
            </div>

            {/* Streak card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                  Daily streak
                </p>
                <p className="text-2xl font-bold text-white">
                  {streak} {streak === 1 ? 'day' : 'days'}
                </p>
              </div>
              <span className="text-4xl" role="img" aria-label="fire">🔥</span>
            </div>

            {/* CTA */}
            <Link
              href="/learn"
              className="mt-2 flex items-center justify-center gap-2 bg-gold text-navy font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Continue Learning →
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
