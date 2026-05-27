import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import UserMenu from './SignOutButton'
import DisplayNameEditor from './DisplayNameEditor'
import BottomNav from '@/components/BottomNav'
import { WORLDS } from '@/lib/worlds'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const BAR_MAX_PX = 44

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const sevenDaysAgo = new Date(Date.now() - 6 * 86_400_000).toISOString().split('T')[0]

  const [{ data: profile }, { data: completions }, { data: xpHistory }] = await Promise.all([
    supabase.from('profiles').select('display_name, xp, streak, hearts, dividends').eq('id', user.id).maybeSingle(),
    supabase.from('lesson_completions').select('lesson_id').eq('user_id', user.id),
    supabase.from('xp_history').select('xp_earned, earned_at').eq('user_id', user.id).gte('earned_at', sevenDaysAgo),
  ])

  const xp = profile?.xp ?? 0
  const streak = profile?.streak ?? 0

  const displayHearts: number = profile?.hearts ?? 5
  const dividends: number = profile?.dividends ?? 0

  const level = Math.floor(xp / 100) + 1
  const xpInLevel = xp % 100
  const xpToNext = 100 - xpInLevel

  const completedIds = new Set((completions ?? []).map((r) => String(r.lesson_id)))

  type NextLesson = { worldId: string; unitId: string; lessonId: string; title: string } | null
  let nextLesson: NextLesson = null
  outer: for (const world of WORLDS) {
    for (const unit of world.units) {
      for (const lesson of unit.lessons) {
        if (!completedIds.has(lesson.id)) {
          nextLesson = { worldId: world.id, unitId: unit.id, lessonId: lesson.id, title: lesson.title }
          break outer
        }
      }
    }
  }

  // Build xp-per-day map
  const xpByDay = new Map<string, number>()
  for (const row of xpHistory ?? []) {
    const date = String(row.earned_at)
    xpByDay.set(date, (xpByDay.get(date) ?? 0) + row.xp_earned)
  }

  // Build ordered 7-day array (oldest → today)
  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86_400_000)
    const dateStr = d.toISOString().split('T')[0]
    return { label: DAY_NAMES[d.getUTCDay()], xp: xpByDay.get(dateStr) ?? 0 }
  })

  const maxXp = Math.max(...chartDays.map((d) => d.xp), 1)

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < displayHearts ? 'text-base' : 'text-base opacity-20'}>❤️</span>
                ))}
              </span>
              <span className="text-gold tabular-nums">💰 {dividends}</span>
            </div>
            <UserMenu name={profile?.display_name} />
          </div>
        </div>
      </nav>

      <main className="flex-1 px-6 pt-12 pb-28">
        <div className="max-w-2xl mx-auto">

          <DisplayNameEditor initialName={profile?.display_name ?? null} />

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
              <span className="inline-block flame-pulse text-4xl" role="img" aria-label="fire">🔥</span>
            </div>

            {/* XP History chart */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-5">
                XP this week
              </p>
              <div className="flex items-end justify-between gap-1" style={{ height: `${BAR_MAX_PX + 24}px` }}>
                {chartDays.map(({ label, xp: dayXp }) => {
                  const barH = dayXp > 0
                    ? Math.max(Math.round((dayXp / maxXp) * BAR_MAX_PX), 6)
                    : 3
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                      {dayXp > 0 && (
                        <span className="text-[10px] text-gold font-semibold">{dayXp} XP</span>
                      )}
                      <div className="w-full flex items-end" style={{ height: `${BAR_MAX_PX}px` }}>
                        <div
                          className={`w-full rounded-t-md ${dayXp > 0 ? 'bg-gold' : 'bg-white/10'}`}
                          style={{ height: `${barH}px` }}
                        />
                      </div>
                      <span className="text-[11px] text-white/40 font-medium">{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Next lesson CTA */}
            {nextLesson ? (
              <Link
                href={`/learn/${nextLesson.worldId}/${nextLesson.unitId}/${nextLesson.lessonId}`}
                className="mt-2 flex items-center justify-between gap-4 bg-gold text-navy font-semibold px-6 py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-0.5">
                    Continue Learning
                  </p>
                  <p className="truncate">{nextLesson.title}</p>
                </div>
                <span className="text-xl shrink-0">→</span>
              </Link>
            ) : (
              <div className="mt-2 flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl px-6 py-4">
                <span className="text-2xl">🎉</span>
                <p className="text-white font-semibold">You&apos;re all caught up!</p>
              </div>
            )}
          </div>

        </div>
      </main>
      <BottomNav />
    </div>
  )
}
