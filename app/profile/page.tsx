import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

const badges = [
  {
    id: 'first-step',
    emoji: '🥇',
    name: 'First Step',
    description: 'Complete your first lesson.',
    earned: (completedCount: number, _streak: number, completedIds: Set<string>) =>
      completedCount >= 1,
  },
  {
    id: 'on-fire',
    emoji: '🔥',
    name: 'On Fire',
    description: 'Maintain a streak of 3 or more days.',
    earned: (_completedCount: number, streak: number, _completedIds: Set<string>) =>
      streak >= 3,
  },
  {
    id: 'unit-1-graduate',
    emoji: '📚',
    name: 'Unit 1 Graduate',
    description: 'Complete all 5 lessons in Investing Basics.',
    earned: (_completedCount: number, _streak: number, completedIds: Set<string>) =>
      ['1', '2', '3', '4', '5'].every((id) => completedIds.has(id)),
  },
  {
    id: 'investquest-pro',
    emoji: '⭐',
    name: 'InvestQuest Pro',
    description: 'Complete all 8 lessons.',
    earned: (completedCount: number, _streak: number, _completedIds: Set<string>) =>
      completedCount >= 8,
  },
]

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

export default async function ProfilePage() {
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
  const displayName = profile?.display_name ?? null

  const level = Math.floor(xp / 100) + 1
  const xpInLevel = xp % 100
  const xpToNext = 100 - xpInLevel

  const completedIds = new Set((completions ?? []).map((r) => String(r.lesson_id)))
  const completedCount = completedIds.size

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

            {/* Lessons completed */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest">
                  Lessons completed
                </p>
                <span className="text-xs font-semibold text-gold">
                  {completedCount} / {allLessons.length}
                </span>
              </div>
              <p className="text-sm text-gold/70 font-medium mb-4">
                {completedCount} of {allLessons.length} lessons
              </p>

              <ul className="flex flex-col gap-2">
                {allLessons.map((lesson) => {
                  const done = completedIds.has(lesson.id)
                  return (
                    <li key={lesson.id} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        done ? 'bg-gold' : 'bg-white/10'
                      }`}>
                        {done && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-navy">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${done ? 'text-white/60' : 'text-white/30'}`}>
                        {lesson.title}
                      </span>
                    </li>
                  )
                })}
              </ul>

              {/* Progress bar */}
              <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full"
                  style={{ width: `${(completedCount / allLessons.length) * 100}%` }}
                />
              </div>
            </div>
            {/* Badges */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-4">
                Badges
              </p>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => {
                  const isEarned = badge.earned(completedCount, streak, completedIds)
                  return (
                    <div
                      key={badge.id}
                      className={`rounded-xl px-4 py-4 border flex flex-col gap-2 ${
                        isEarned
                          ? 'bg-gold/15 border-gold/60'
                          : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl ${isEarned ? '' : 'grayscale opacity-30'}`}>
                          {badge.emoji}
                        </span>
                        {!isEarned && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white/20">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isEarned ? 'text-white' : 'text-white/30'}`}>
                          {badge.name}
                        </p>
                        <p className={`text-xs mt-0.5 leading-snug ${isEarned ? 'text-white/50' : 'text-white/20'}`}>
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
