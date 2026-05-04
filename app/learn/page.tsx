import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const units = [
  {
    title: 'Investing Basics',
    startId: 1,
    lessons: [
      'What is the Stock Market?',
      'What is a Share?',
      'Bulls vs. Bears',
      'What is Compound Interest?',
      'What is Inflation?',
    ],
  },
  {
    title: 'Stock Market Deep Dive',
    startId: 6,
    lessons: [
      'What is a Dividend?',
      'What is Market Cap?',
      'How to Read a Stock Chart?',
    ],
  },
]

export default async function LearnPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let completedIds = new Set<string>()
  if (user) {
    const { data } = await supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', user.id)
    if (data) completedIds = new Set(data.map((r) => String(r.lesson_id)))
  }

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
            Learn
          </p>
          <h1 className="text-3xl font-bold text-white mb-10">Your lessons</h1>

          {units.map((unit) => (
            <section key={unit.title} className="mb-10">
              {/* Unit header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
                  {unit.title}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Lesson cards */}
              <ol className="flex flex-col gap-3">
                {unit.lessons.map((lesson, index) => {
                  const lessonId = String(unit.startId + index)
                  const done = completedIds.has(lessonId)
                  return (
                    <li key={lesson}>
                      <Link
                        href={`/learn/${lessonId}`}
                        className={`flex items-center gap-4 border rounded-xl px-5 py-4 transition-colors group ${
                          done
                            ? 'bg-gold/5 border-gold/20 hover:bg-gold/10'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold/40'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                            done
                              ? 'bg-gold text-navy'
                              : 'bg-gold/10 border border-gold/30 text-gold group-hover:bg-gold group-hover:text-navy'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span
                          className={`font-medium ${done ? 'text-white/50' : 'text-white'}`}
                        >
                          {lesson}
                        </span>
                        <span className="ml-auto shrink-0">
                          {done ? (
                            <CheckIcon />
                          ) : (
                            <span className="text-white/30 group-hover:text-gold transition-colors">
                              →
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-gold"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
