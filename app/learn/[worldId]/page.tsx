import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import { WORLDS } from '@/lib/worlds'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getUnlockState } from '@/lib/unlocks'

export default async function WorldPage({ params }: { params: Promise<{ worldId: string }> }) {
  const { worldId } = await params
  const world = WORLDS.find((w) => w.id === worldId)
  if (!world) notFound()

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
          <span className="text-white font-semibold text-xl tracking-tight">
            InvestQuest
          </span>
        </div>
      </nav>

      <main className="flex-1 px-6 pt-10 pb-28">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-white/50 text-sm font-medium hover:text-white/80 transition-colors mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
            World Map
          </Link>

          {/* World header */}
          <div className="flex items-start gap-4 mb-10">
            <div className={`${world.color} bg-opacity-20 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-4xl`}>
              {world.icon}
            </div>
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">World {world.id.replace('w', '')}</p>
              <h1 className="text-3xl font-bold text-white leading-tight">{world.title}</h1>
              <p className="text-white/50 text-sm mt-1 leading-relaxed">{world.description}</p>
            </div>
          </div>

          {/* Unit trail */}
          <div className="flex flex-col">
            {world.units.map((unit, index) => {
              const isLast = index === world.units.length - 1
              const unitUnlocked = unlocks.isUnitUnlocked(world.id, unit.id)
              const unitComplete = unit.lessons.every((l) => completedIds.has(l.id))

              const cardInner = (
                <>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight group-hover:text-gold transition-colors">
                      {unit.title}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {unit.lessons.length} lessons
                    </p>
                  </div>
                  <span className="shrink-0">
                    {unitComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : unitUnlocked ? (
                      <span className="text-white/30 group-hover:text-gold transition-colors">→</span>
                    ) : (
                      <span>🔒</span>
                    )}
                  </span>
                </>
              )

              return (
                <div key={unit.id} className="flex gap-4">
                  {/* Connector column */}
                  <div className="flex flex-col items-center w-8 shrink-0">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${world.color} border-transparent`}>
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 bg-white/10 my-1" />
                    )}
                  </div>

                  {/* Unit card */}
                  <div className={`flex-1 ${isLast ? '' : 'mb-4'}`}>
                    {unitUnlocked ? (
                      <Link
                        href={`/learn/${world.id}/${unit.id}`}
                        className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/8 hover:border-gold/30 transition-all group"
                      >
                        {cardInner}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 opacity-50 cursor-not-allowed">
                        {cardInner}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  )
}
