import Link from 'next/link'
import { notFound } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import Buck from '@/components/Buck'
import { WORLDS } from '@/lib/worlds'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ worldId: string; unitId: string; lessonId: string }>
}) {
  const { worldId, unitId, lessonId } = await params
  const world = WORLDS.find((w) => w.id === worldId)
  if (!world) notFound()
  const unit = world.units.find((u) => u.id === unitId)
  if (!unit) notFound()
  const lesson = unit.lessons.find((l) => l.id === lessonId)
  if (!lesson) notFound()

  const lessonIndex = unit.lessons.indexOf(lesson)
  const progress = 0

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Progress bar */}
      <div className="h-1 w-full bg-white/10">
        <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
      </div>

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
        <div className="max-w-2xl mx-auto flex flex-col">

          {/* Back link */}
          <Link
            href={`/learn/${worldId}/${unitId}`}
            className="inline-flex items-center gap-1.5 text-white/50 text-sm font-medium hover:text-white/80 transition-colors mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
            {unit.title}
          </Link>

          {/* Lesson header */}
          <div className="mb-10">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
              Lesson {lessonIndex + 1} of {unit.lessons.length}
            </p>
            <h1 className="text-2xl font-bold text-white leading-snug">{lesson.title}</h1>
          </div>

          {/* Coming soon */}
          <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
            <Buck size="md" animate />
            <p className="text-white/40 text-sm text-center">
              Lesson coming soon — check back shortly!
            </p>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  )
}
