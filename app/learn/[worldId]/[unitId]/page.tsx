import Link from 'next/link'
import { notFound } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { WORLDS } from '@/lib/worlds'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getUnlockState } from '@/lib/unlocks'

export default async function UnitPage({ params }: { params: Promise<{ worldId: string; unitId: string }> }) {
  const { worldId, unitId } = await params
  const world = WORLDS.find((w) => w.id === worldId)
  if (!world) notFound()
  const unit = world.units.find((u) => u.id === unitId)
  if (!unit) notFound()

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let completedIds = new Set<string>()
  if (user) {
    const { data: completions } = await supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', user.id)
    completedIds = new Set((completions ?? []).map((r) => String(r.lesson_id)))
  }

  const unlocks = getUnlockState(completedIds)

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
            <span className="text-navy font-bold text-sm">IQ</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">InvestQuest</span>
        </div>
      </nav>

      <main className="flex-1 px-6 pt-10 pb-28">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            href={`/learn/${worldId}`}
            className="inline-flex items-center gap-1.5 text-white/50 text-sm font-medium hover:text-white/80 transition-colors mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
            {world.title}
          </Link>

          {/* Unit header */}
          <div className="mb-8">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
              {world.icon} {world.title}
            </p>
            <h1 className="text-3xl font-bold text-white leading-tight">{unit.title}</h1>
            <p className="text-white/40 text-sm mt-1">{unit.lessons.length} lessons</p>
          </div>

          {/* Lesson list */}
          <ol className="flex flex-col gap-3">
            {unit.lessons.map((lesson, index) => {
              const lessonUnlocked = unlocks.isLessonUnlocked(worldId, unitId, lesson.id)

              const lessonInner = (
                <>
                  <div className={`w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 ${lessonUnlocked ? 'group-hover:bg-gold group-hover:border-gold transition-all' : ''}`}>
                    <span className={`text-gold text-sm font-bold ${lessonUnlocked ? 'group-hover:text-navy transition-colors' : ''}`}>
                      {index + 1}
                    </span>
                  </div>
                  <span className={`flex-1 text-sm font-medium ${lessonUnlocked ? 'text-white group-hover:text-gold transition-colors' : 'text-white'}`}>
                    {lesson.title}
                  </span>
                  <span className={`shrink-0 ${lessonUnlocked ? 'text-white/30 group-hover:text-gold transition-colors' : 'text-white/30'}`}>
                    {lessonUnlocked ? '→' : '🔒'}
                  </span>
                </>
              )

              return (
                <li key={lesson.id}>
                  {lessonUnlocked ? (
                    <Link
                      href={`/learn/${worldId}/${unitId}/${lesson.id}`}
                      className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/8 hover:border-gold/30 transition-all group"
                    >
                      {lessonInner}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 opacity-50 cursor-not-allowed">
                      {lessonInner}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>

        </div>
      </main>

      <BottomNav />
    </div>
  )
}
