'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Buck from '@/components/Buck'
import Confetti from '@/components/Confetti'
import QuestionEngine from '@/components/QuestionEngine'
import { createClient } from '@/lib/supabase-browser'
import type { Question } from '@/lib/worlds'

type Intro = { title: string; body: string }

const ENCOURAGEMENTS = [
  'Keep going!',
  "You've got this!",
  'Nice work!',
  'Almost there!',
]

const COMPLETION_MESSAGES = [
  "You're on a roll! 🐂",
  'Buck is proud of you!',
  "That's how winners learn!",
  'Keep charging forward!',
  'Another one down. Unstoppable.',
  "You're building real knowledge!",
  'The herd is impressed. 🐂',
  'Consistency beats talent. Keep going.',
  "Sharp mind. Buck approves.",
  'One step closer to financial mastery!',
]

const XP_REWARD = 20

interface Props {
  worldId: string
  unitId: string
  lessonId: string
  lessonTitle: string
  lessonIndex: number
  totalLessons: number
  intro?: Intro
  questions: Question[]
  userId: string
}

export default function LessonPlayer({
  worldId, unitId, lessonId, lessonTitle, lessonIndex, totalLessons, intro, questions, userId,
}: Props) {
  const [showIntro, setShowIntro] = useState(!!intro)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [awardingXp, setAwardingXp] = useState(false)
  const [xpDisplay, setXpDisplay] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [outOfHearts, setOutOfHearts] = useState(false)
  const [dividends, setDividends] = useState(0)
  const [refilling, setRefilling] = useState(false)
  const completionMessage = useMemo(
    () => COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)],
    []
  )

  useEffect(() => {
    async function initHearts() {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('hearts, hearts_last_refill, dividends')
        .eq('id', userId)
        .single()
      if (!profile) return

      const fetchedHearts: number = profile.hearts ?? 5
      const lastRefill: string | null = profile.hearts_last_refill ?? null
      let newHearts = fetchedHearts

      if (fetchedHearts < 5 && lastRefill) {
        const hoursSince = (Date.now() - new Date(lastRefill).getTime()) / 3_600_000
        if (hoursSince >= 2) {
          const refilled = Math.min(Math.floor(hoursSince / 2), 5 - fetchedHearts)
          newHearts = fetchedHearts + refilled
          // Advance the timestamp by the hours consumed, preserving leftover progress
          const newRefill = new Date(new Date(lastRefill).getTime() + refilled * 2 * 3_600_000).toISOString()
          await supabase
            .from('profiles')
            .update({ hearts: newHearts, hearts_last_refill: newRefill })
            .eq('id', userId)
        }
      }

      setHearts(newHearts)
      setDividends(profile.dividends ?? 0)
    }
    initHearts()
  }, [userId])

  useEffect(() => {
    if (!done) return
    setXpDisplay(0)
    let current = 0
    const target = 20
    const timer = setInterval(() => {
      current += 1
      setXpDisplay(current)
      if (current >= target) clearInterval(timer)
    }, 40)
    return () => clearInterval(timer)
  }, [done])

  const total = questions.length
  const progress = total > 0 ? Math.round((currentIndex / total) * 100) : 0
  const encouragement = ENCOURAGEMENTS[currentIndex % ENCOURAGEMENTS.length]

  async function awardXp() {
    setAwardingXp(true)
    try {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, streak, last_active, dividends')
        .eq('id', userId)
        .single()

      const currentXp = profile?.xp ?? 0
      const currentStreak = profile?.streak ?? 0
      const lastActive: string | null = profile?.last_active ?? null
      const today = new Date().toISOString().split('T')[0]

      let newStreak: number
      if (lastActive === today) {
        newStreak = currentStreak
      } else if (lastActive === new Date(Date.now() - 86_400_000).toISOString().split('T')[0]) {
        newStreak = currentStreak + 1
      } else {
        newStreak = 1
      }

      const currentDividends = profile?.dividends ?? 0
      const dividendReward = 5 + (newStreak > 0 && newStreak % 7 === 0 ? 10 : 0)
      await supabase
        .from('profiles')
        .update({ xp: currentXp + XP_REWARD, streak: newStreak, last_active: today, dividends: currentDividends + dividendReward })
        .eq('id', userId)
      await supabase
        .from('lesson_completions')
        .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' })
    } catch {
      // non-blocking — XP award and completion recording are best-effort
    } finally {
      setAwardingXp(false)
    }
  }

  async function handleAnswer(correct: boolean) {
    if (!correct) {
      const newHearts = hearts - 1
      setHearts(newHearts)
      const supabase = createClient()
      const { error } = await supabase.from('profiles').update({ hearts: newHearts }).eq('id', userId)
      console.log('hearts update:', newHearts, error)
      if (newHearts <= 0) {
        setOutOfHearts(true)
        return
      }
    }

    if (currentIndex + 1 >= total) {
      awardXp()
      setDone(true)
    } else {
      // Correct answers have an 800ms pause built into the sub-component before
      // onAnswer fires, so add no extra delay. Wrong answers come from an explicit
      // Continue button click, so advance immediately.
      setTimeout(() => setCurrentIndex((i) => i + 1), correct ? 800 : 0)
    }
  }

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (showIntro && intro) {
    return (
      <div className="flex flex-col min-h-screen bg-navy">
        <div className="h-1 w-full bg-white/10" />

        <nav className="px-6 py-4 border-b border-white/10">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-sm">IQ</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">InvestQuest</span>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center px-6 pb-28">
          <div className="max-w-2xl w-full flex flex-col gap-8">
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
                Lesson {lessonIndex + 1} of {totalLessons}
              </p>
              <h1 className="text-3xl font-bold text-white leading-snug mb-6">{intro.title}</h1>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
                <p className="text-white/80 text-sm leading-relaxed">{intro.body}</p>
              </div>
            </div>
            <button
              onClick={() => setShowIntro(false)}
              className="w-full py-4 rounded-2xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Start Lesson →
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ── Completion screen ──────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col min-h-screen bg-navy">
        <Confetti />
        <div className="h-1 w-full bg-gold" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center pb-28">
          <Buck size="md" animate />
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Lesson complete!</p>
            <p className="text-white/50 text-sm mb-3">{completionMessage}</p>
            <h1 className="text-3xl font-bold text-white mb-1">{lessonTitle}</h1>
            <p className="text-white/40 text-sm">You finished all {total} questions.</p>
          </div>
          <div className="bg-gold/10 border border-gold/30 rounded-2xl px-8 py-4 flex flex-col items-center gap-1">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">XP Earned</p>
            <p className="text-gold text-4xl font-bold">+{xpDisplay}</p>
          </div>
          <Link
            href={`/learn/${worldId}`}
            className="w-full max-w-sm py-4 rounded-2xl bg-gold text-navy text-sm font-bold text-center hover:opacity-90 transition-opacity"
          >
            Continue
          </Link>
        </div>
      </div>
    )
  }

  // ── Out of hearts screen ──────────────────────────────────────────────────
  if (outOfHearts) {
    const canRefill = dividends >= 200

    async function handleRefill() {
      if (!canRefill || refilling) return
      setRefilling(true)
      try {
        const supabase = createClient()
        const now = new Date().toISOString()
        await supabase
          .from('profiles')
          .update({ hearts: 5, hearts_last_refill: now, dividends: dividends - 200 })
          .eq('id', userId)
        setHearts(5)
        setDividends(dividends - 200)
        setOutOfHearts(false)
      } finally {
        setRefilling(false)
      }
    }

    return (
      <div className="flex flex-col min-h-screen bg-navy">
        <div className="h-1 w-full bg-red-500" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center pb-28">
          <span className="text-6xl">💔</span>
          <div>
            <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-2">Out of hearts!</p>
            <h1 className="text-3xl font-bold text-white mb-2">You ran out of hearts</h1>
            <p className="text-white/40 text-sm">Hearts refill 1 every 2 hours. Come back soon!</p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={handleRefill}
              disabled={!canRefill || refilling}
              className={`w-full py-4 rounded-2xl text-sm font-bold transition-all ${
                canRefill
                  ? 'bg-gold text-navy hover:opacity-90'
                  : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {canRefill
                ? (refilling ? 'Refilling…' : 'Refill Hearts — 200 Dividends 💰')
                : 'Not enough Dividends (200 required)'}
            </button>
            <Link
              href={`/learn/${worldId}`}
              className="w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-bold text-center hover:bg-white/15 transition-all"
            >
              ← Go Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentIndex]

  // ── Question player ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Progress bar */}
      <div className="h-1 w-full bg-white/10">
        <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-sm">IQ</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">InvestQuest</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gold text-sm font-semibold tabular-nums">💰 {dividends}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < hearts ? 'text-base' : 'text-base opacity-20'}>❤️</span>
              ))}
            </div>
            <span className="text-white/30 text-xs tabular-nums font-semibold">
              {currentIndex + 1} / {total}
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-1 px-6 pt-8 pb-28">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Lesson context */}
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
              Lesson {lessonIndex + 1} of {totalLessons}
            </p>
            <h1 className="text-xl font-bold text-white leading-snug">{lessonTitle}</h1>
          </div>

          {/* Prompt */}
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
            <p className="text-white text-base font-medium leading-relaxed">{question.prompt}</p>
          </div>

          {/* Question engine */}
          <QuestionEngine question={question} onAnswer={handleAnswer} />

          {/* Buck encouragement */}
          <div className="flex items-center gap-3 mt-2">
            <Buck size="sm" animate={false} />
            <p className="text-white/30 text-xs italic">{encouragement}</p>
          </div>

        </div>
      </main>
    </div>
  )
}
