import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from './SignOutButton'
import DisplayNameEditor from './DisplayNameEditor'
import BottomNav from '@/components/BottomNav'

const allLessons = [
  { id: '1', title: 'What is the Stock Market?' },
  { id: '2', title: 'What is a Share?' },
  { id: '3', title: 'Bulls vs. Bears' },
  { id: '4', title: 'What is Compound Interest?' },
  { id: '5', title: 'What is Inflation?' },
  { id: '6', title: 'What is a Dividend?' },
  { id: '7', title: 'What is Market Cap?' },
  { id: '8', title: 'How to Read a Stock Chart?' },
]

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, { data: completions }] = await Promise.all([
    supabase.from('profiles').select('display_name, xp, streak').eq('id', user.id).maybeSingle(),
    supabase.from('lesson_completions').select('lesson_id').eq('user_id', user.id),
  ])

  const xp = profile?.xp ?? 0
  const streak = profile?.streak ?? 0

  const level = Math.floor(xp / 100) + 1
  const xpInLevel = xp % 100
  const xpToNext = 100 - xpInLevel

  const completedIds = new Set((completions ?? []).map((r) => String(r.lesson_id)))
  const nextLesson = allLessons.find((l) => !completedIds.has(l.id))

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
              <span className="text-4xl" role="img" aria-label="fire">🔥</span>
            </div>

            {/* Next lesson CTA */}
            {nextLesson ? (
              <Link
                href={`/learn/${nextLesson.id}`}
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
