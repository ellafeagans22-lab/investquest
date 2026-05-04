'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

type Question = {
  prompt: string
  options: string[]
  answer: string
}

type Lesson = {
  title: string
  intro: string
  questions: Question[]
}

const lessons: Record<string, Lesson> = {
  '1': {
    title: 'What is the Stock Market?',
    intro:
      'The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. ' +
      'It plays a central role in the economy by helping businesses raise capital and giving everyday people a way to grow their wealth.',
    questions: [
      {
        prompt: 'What is the primary purpose of the stock market?',
        options: [
          'To allow companies to raise money by selling shares to the public',
          'To store physical currency for governments',
          'To set interest rates for bank loans',
          'To manage pension funds on behalf of employees',
        ],
        answer: 'To allow companies to raise money by selling shares to the public',
      },
      {
        prompt: 'Which of these is a real stock exchange?',
        options: ['IKEA', 'IMF', 'NYSE', 'SWIFT'],
        answer: 'NYSE',
      },
      {
        prompt: 'What does it mean when a company "goes public"?',
        options: [
          'It moves its headquarters to another country',
          'It sells shares to the public for the first time via an IPO',
          'It publishes its financial results online',
          'It stops paying dividends to shareholders',
        ],
        answer: 'It sells shares to the public for the first time via an IPO',
      },
    ],
  },
  '2': {
    title: 'What is a Share?',
    intro:
      'A share (or stock) represents a unit of ownership in a company. ' +
      'When you buy a share, you become a part-owner of that business and are entitled to a portion of its profits and assets.',
    questions: [
      {
        prompt: 'What does owning a share of a company mean?',
        options: [
          'You have lent money to the company',
          'You own a small piece of the company',
          'You work for the company',
          'You are guaranteed a fixed return',
        ],
        answer: 'You own a small piece of the company',
      },
      {
        prompt: 'What is a dividend?',
        options: [
          'A fee charged for buying shares',
          'A tax on investment profits',
          'A share of a company\'s profits paid to shareholders',
          'The price at which a share is first sold',
        ],
        answer: 'A share of a company\'s profits paid to shareholders',
      },
      {
        prompt: 'If a company has 1,000 shares and you own 100, what percentage of the company do you own?',
        options: ['1%', '5%', '10%', '100%'],
        answer: '10%',
      },
    ],
  },
  '3': {
    title: 'Bulls vs. Bears',
    intro:
      'In financial markets, a "bull market" describes a period of rising prices and investor optimism, ' +
      'while a "bear market" refers to a prolonged period of falling prices and pessimism.',
    questions: [
      {
        prompt: 'What does a "bull market" refer to?',
        options: [
          'A market dominated by large institutional investors',
          'A period of rising stock prices and investor confidence',
          'A market where only bonds are traded',
          'A period of high inflation and falling wages',
        ],
        answer: 'A period of rising stock prices and investor confidence',
      },
      {
        prompt: 'A bear market is generally defined as a decline of what percentage from recent highs?',
        options: ['5%', '10%', '20%', '50%'],
        answer: '20%',
      },
      {
        prompt: 'Which best describes investor sentiment during a bear market?',
        options: [
          'Optimism and increased buying',
          'Pessimism and increased selling',
          'Indifference to market conditions',
          'Excitement about new IPOs',
        ],
        answer: 'Pessimism and increased selling',
      },
    ],
  },
}

async function awardXp() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak, last_active')
    .eq('id', user.id)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
  const lastActive: string | null = profile?.last_active ?? null

  let newStreak: number
  if (lastActive === today) {
    newStreak = profile?.streak ?? 1
  } else if (lastActive === yesterday) {
    newStreak = (profile?.streak ?? 0) + 1
  } else {
    newStreak = 1
  }

  await supabase
    .from('profiles')
    .update({ xp: (profile?.xp ?? 0) + 10, streak: newStreak, last_active: today })
    .eq('id', user.id)
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = use(params)
  const lesson = lessons[lessonId]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!lesson) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center text-white">
        Lesson not found.
      </div>
    )
  }

  const question = lesson.questions[currentIndex]
  const isCorrect = selected === question.answer
  const isLast = currentIndex === lesson.questions.length - 1

  function handleSelect(option: string) {
    if (isCorrect) return
    setSelected(option)
  }

  async function handleNext() {
    if (isLast) {
      setSaving(true)
      await awardXp()
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelected(null)
    }
  }

  function optionStyle(option: string) {
    if (selected === null) {
      return 'border-white/15 bg-white/5 text-white hover:border-gold/50 hover:bg-white/10'
    }
    if (option === question.answer) {
      return 'border-green-500 bg-green-500/20 text-green-300'
    }
    if (option === selected) {
      return 'border-red-500 bg-red-500/20 text-red-300'
    }
    return 'border-white/10 bg-white/5 text-white/40'
  }

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
          <Link
            href="/learn"
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            ← Back to lessons
          </Link>
        </div>
      </nav>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {finished ? (
            /* Completion screen */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mx-auto mb-6">
                <span className="text-gold text-2xl">★</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Lesson complete!
              </h2>
              <p className="text-white/60 mb-2">
                You finished &ldquo;{lesson.title}&rdquo;
              </p>
              <p className="text-gold font-semibold mb-8">+10 XP</p>
              <Link
                href="/learn"
                className="inline-block bg-gold text-navy font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to lessons
              </Link>
            </div>
          ) : (
            <>
              {/* Lesson header */}
              <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">
                Lesson {lessonId}
              </p>
              <h1 className="text-2xl font-bold text-white mb-4">
                {lesson.title}
              </h1>

              {/* Intro — only show before question 1 */}
              {currentIndex === 0 && (
                <p className="text-white/60 leading-relaxed mb-8">
                  {lesson.intro}
                </p>
              )}

              {/* Progress bar */}
              <div className="flex gap-1.5 mb-8">
                {lesson.questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < currentIndex
                        ? 'bg-gold'
                        : i === currentIndex
                        ? 'bg-gold/50'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-3">
                Question {currentIndex + 1} of {lesson.questions.length}
              </p>
              <h2 className="text-xl font-bold text-white mb-6">
                {question.prompt}
              </h2>

              {/* Options */}
              <ul className="flex flex-col gap-3 mb-8">
                {question.options.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-5 py-4 rounded-xl border font-medium transition-colors ${optionStyle(option)}`}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Feedback + Next */}
              {selected && (
                <div className="flex items-center justify-between">
                  <p
                    className={`font-semibold ${
                      isCorrect ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isCorrect ? '✓ Correct!' : '✗ Not quite — try again.'}
                  </p>
                  {isCorrect && (
                    <button
                      onClick={handleNext}
                      disabled={saving}
                      className="bg-gold text-navy font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {saving ? 'Saving…' : isLast ? 'Finish' : 'Next →'}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
