import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import Buck from '@/components/Buck'
import { WORLDS } from '@/lib/worlds'

export default function LearnPage() {
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

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-1">
                Learn
              </p>
              <h1 className="text-3xl font-bold text-white">World Map</h1>
            </div>
            <Buck size="sm" animate={false} />
          </div>

          {/* World cards */}
          <div className="flex flex-col gap-5">
            {WORLDS.map((world) => {
              const totalLessons = world.units.reduce((sum, u) => sum + u.lessons.length, 0)

              const card = (
                <div
                  className={`relative rounded-2xl border overflow-hidden transition-all ${
                    world.unlocked
                      ? 'bg-white/5 border-white/10 hover:border-gold/40 hover:bg-white/8'
                      : 'bg-white/[0.02] border-white/5 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Colour accent strip */}
                  <div className={`${world.color} h-1.5 w-full`} />

                  <div className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`${world.color} bg-opacity-20 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-3xl`}>
                        {world.icon}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h2 className={`text-lg font-bold leading-tight mb-1 ${world.unlocked ? 'text-white' : 'text-white/40'}`}>
                          {world.title}
                        </h2>
                        <p className={`text-sm leading-relaxed ${world.unlocked ? 'text-white/50' : 'text-white/25'}`}>
                          {world.description}
                        </p>

                        {/* Stats row */}
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`text-xs font-semibold ${world.unlocked ? 'text-white/40' : 'text-white/20'}`}>
                            {world.units.length} units
                          </span>
                          <span className="text-white/10">·</span>
                          <span className={`text-xs font-semibold ${world.unlocked ? 'text-white/40' : 'text-white/20'}`}>
                            {totalLessons} lessons
                          </span>
                        </div>
                      </div>

                      {/* Lock or arrow */}
                      <div className="shrink-0 mt-1">
                        {world.unlocked ? (
                          <span className="text-gold/50 text-lg">→</span>
                        ) : (
                          <span className="text-2xl">🔒</span>
                        )}
                      </div>
                    </div>

                    {/* Unit pills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {world.units.map((unit) => (
                        <span
                          key={unit.id}
                          className={`text-xs font-medium px-3 py-1 rounded-full border ${
                            world.unlocked
                              ? 'border-white/10 text-white/40 bg-white/5'
                              : 'border-white/5 text-white/20'
                          }`}
                        >
                          {unit.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )

              return world.unlocked ? (
                <Link key={world.id} href={`/learn/${world.id}`}>
                  {card}
                </Link>
              ) : (
                <div key={world.id}>{card}</div>
              )
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
