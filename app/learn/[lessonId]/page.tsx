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
  '4': {
    title: 'What is Compound Interest?',
    intro:
      'Compound interest is interest earned not just on your original investment, but also on the interest you\'ve already accumulated. ' +
      'Over time, this "interest on interest" effect causes wealth to grow exponentially — making it one of the most powerful forces in personal finance.',
    questions: [
      {
        prompt: 'What makes compound interest different from simple interest?',
        options: [
          'It is only available to institutional investors',
          'It earns interest on both the principal and previously earned interest',
          'It pays out a fixed amount regardless of the balance',
          'It is calculated only at the end of a loan term',
        ],
        answer: 'It earns interest on both the principal and previously earned interest',
      },
      {
        prompt: 'You invest $1,000 at 10% annual compound interest. What is your balance after 2 years?',
        options: ['$1,100', '$1,200', '$1,210', '$1,020'],
        answer: '$1,210',
      },
      {
        prompt: 'Which habit best takes advantage of compound interest?',
        options: [
          'Withdrawing interest earnings every month',
          'Investing a lump sum only once',
          'Starting to invest as early as possible and reinvesting returns',
          'Keeping savings in cash to avoid risk',
        ],
        answer: 'Starting to invest as early as possible and reinvesting returns',
      },
    ],
  },
  '5': {
    title: 'What is Inflation?',
    intro:
      'Inflation is the rate at which the general level of prices for goods and services rises over time, reducing the purchasing power of money. ' +
      'This means that £100 today will buy less in the future — which is why simply holding cash can quietly erode your wealth.',
    questions: [
      {
        prompt: 'What does inflation measure?',
        options: [
          'The total value of a country\'s stock market',
          'The rate at which average prices rise over time',
          'The speed at which banks lend money',
          'The difference between import and export values',
        ],
        answer: 'The rate at which average prices rise over time',
      },
      {
        prompt: 'If inflation is 5% and your savings account pays 2% interest, what happens to your purchasing power?',
        options: [
          'It increases by 7%',
          'It stays the same',
          'It decreases by approximately 3%',
          'It doubles over 10 years',
        ],
        answer: 'It decreases by approximately 3%',
      },
      {
        prompt: 'Which of these is a common way investors try to outpace inflation?',
        options: [
          'Holding large amounts of cash',
          'Investing in assets that historically grow faster than inflation, like stocks',
          'Spending money as quickly as possible',
          'Keeping money in a zero-interest current account',
        ],
        answer: 'Investing in assets that historically grow faster than inflation, like stocks',
      },
    ],
  },
  '6': {
    title: 'What is a Dividend?',
    intro:
      'A dividend is a portion of a company\'s profits paid out to its shareholders, usually on a regular basis such as quarterly or annually. ' +
      'Not all companies pay dividends — fast-growing firms often reinvest profits instead — but dividend-paying stocks are popular with investors seeking steady income.',
    questions: [
      {
        prompt: 'What is a dividend?',
        options: [
          'A fee charged when you sell a stock',
          'A portion of a company\'s profits distributed to shareholders',
          'The price difference between buying and selling a stock',
          'A penalty for holding shares too long',
        ],
        answer: 'A portion of a company\'s profits distributed to shareholders',
      },
      {
        prompt: 'Which type of company is most likely to pay regular dividends?',
        options: [
          'A fast-growing tech startup reinvesting all profits',
          'A new company that has never turned a profit',
          'A large, established company with stable earnings',
          'A company that has just gone public via an IPO',
        ],
        answer: 'A large, established company with stable earnings',
      },
      {
        prompt: 'What is a dividend yield?',
        options: [
          'The total number of dividends paid over a company\'s lifetime',
          'The annual dividend payment expressed as a percentage of the share price',
          'The tax rate applied to dividend income',
          'The minimum dividend a company must pay by law',
        ],
        answer: 'The annual dividend payment expressed as a percentage of the share price',
      },
    ],
  },
  '7': {
    title: 'What is Market Cap?',
    intro:
      'Market capitalisation (market cap) is the total market value of a company\'s outstanding shares, calculated by multiplying the share price by the number of shares. ' +
      'It is used to compare company sizes — firms are typically grouped as large-cap, mid-cap, or small-cap based on this figure.',
    questions: [
      {
        prompt: 'How is a company\'s market cap calculated?',
        options: [
          'Annual revenue minus total expenses',
          'Share price multiplied by total number of outstanding shares',
          'Total assets minus total liabilities',
          'Net profit divided by the number of employees',
        ],
        answer: 'Share price multiplied by total number of outstanding shares',
      },
      {
        prompt: 'A company has 10 million shares outstanding and a share price of £50. What is its market cap?',
        options: ['£5 million', '£50 million', '£500 million', '£5 billion'],
        answer: '£500 million',
      },
      {
        prompt: 'Which of these is generally considered a large-cap company?',
        options: [
          'A local bakery that just sold its first shares',
          'A regional retailer with a £200 million market cap',
          'A global technology company with a £1 trillion market cap',
          'A startup valued at £10 million in its seed round',
        ],
        answer: 'A global technology company with a £1 trillion market cap',
      },
    ],
  },
  '8': {
    title: 'How to Read a Stock Chart?',
    intro:
      'A stock chart is a visual representation of a share\'s price history over time, and is one of the most fundamental tools used by investors and traders. ' +
      'Learning to read a chart helps you spot trends, understand volatility, and make more informed decisions about when to buy or sell.',
    questions: [
      {
        prompt: 'On a basic stock chart, what does the x-axis typically represent?',
        options: ['Share price', 'Trading volume', 'Time', 'Market cap'],
        answer: 'Time',
      },
      {
        prompt: 'What does a candlestick on a stock chart show?',
        options: [
          'Only the closing price for that period',
          'The open, high, low, and close price for a given period',
          'The average price across all exchanges',
          'The number of shares traded that day',
        ],
        answer: 'The open, high, low, and close price for a given period',
      },
      {
        prompt: 'If a stock\'s price has been making higher highs and higher lows over several weeks, what does this suggest?',
        options: [
          'The stock is in a downtrend',
          'The stock price is flat and going sideways',
          'The stock is in an uptrend',
          'The company is about to go bankrupt',
        ],
        answer: 'The stock is in an uptrend',
      },
    ],
  },
}

async function awardXp(lessonId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

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

  await Promise.all([
    supabase
      .from('profiles')
      .update({ xp: (profile?.xp ?? 0) + 10, streak: newStreak, last_active: today })
      .eq('id', user.id),
    supabase
      .from('lesson_completions')
      .upsert({ user_id: user.id, lesson_id: lessonId }, { ignoreDuplicates: true }),
  ])
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
      await awardXp(lessonId)
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
