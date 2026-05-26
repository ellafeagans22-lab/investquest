'use client'

import { useState, useEffect } from 'react'
import type { Question } from '@/lib/worlds'

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[a.length][b.length]
}

function isFuzzyMatch(input: string, answer: string): boolean {
  const a = input.trim().toLowerCase()
  const b = answer.trim().toLowerCase()
  if (a === b) return true
  const maxLen = Math.max(a.length, b.length)
  if (maxLen <= 4) return a === b
  const dist = levenshtein(a, b)
  return dist <= Math.floor(maxLen * 0.2)
}

interface Props {
  question: Question
  onAnswer: (correct: boolean) => void
}

// ─── Multiple Choice ──────────────────────────────────────────────────────────

function MultipleChoice({ question, onAnswer }: Props & { question: Extract<Question, { type: 'multiple-choice' }> }) {
  const [selected, setSelected] = useState<number | null>(null)

  function pick(index: number) {
    if (selected !== null) return
    setSelected(index)
    if (index === question.correctIndex) {
      setTimeout(() => onAnswer(true), 800)
    }
    // wrong: wait for the Continue button
  }

  const wrong = selected !== null && selected !== question.correctIndex

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((opt, i) => {
        const isCorrect = i === question.correctIndex
        const isPicked = selected === i
        const revealed = selected !== null

        let style = 'bg-white/5 border-white/10 text-white'
        if (revealed && isPicked && isCorrect) style = 'bg-green-500/20 border-green-400 text-green-300'
        else if (revealed && isPicked && !isCorrect) style = 'bg-red-500/20 border-red-400 text-red-300'
        else if (revealed && isCorrect) style = 'bg-green-500/10 border-green-400/40 text-green-400/70'

        return (
          <button
            key={i}
            onClick={() => pick(i)}
            disabled={selected !== null}
            className={`btn-press w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all ${style} disabled:cursor-default`}
          >
            {opt}
          </button>
        )
      })}
      {wrong && (
        <button
          onClick={() => onAnswer(false)}
          className="w-full py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition-all"
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ─── True / False ─────────────────────────────────────────────────────────────

function TrueFalse({ question, onAnswer }: Props & { question: Extract<Question, { type: 'true-false' }> }) {
  const [selected, setSelected] = useState<boolean | null>(null)

  function pick(value: boolean) {
    if (selected !== null) return
    setSelected(value)
    if (value === question.correct) {
      setTimeout(() => onAnswer(true), 800)
    }
    // wrong: wait for the Continue button
  }

  function styleFor(value: boolean) {
    if (selected === null) {
      return value
        ? 'bg-gold text-navy border-gold hover:opacity-90'
        : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
    }
    const correct = value === question.correct
    const picked = selected === value
    if (picked && correct) return 'bg-green-500/20 border-green-400 text-green-300'
    if (picked && !correct) return 'bg-red-500/20 border-red-400 text-red-300'
    if (!picked && correct) return 'bg-green-500/10 border-green-400/40 text-green-400/70'
    return 'bg-white/5 border-white/10 text-white/30'
  }

  const wrong = selected !== null && selected !== question.correct

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        {([true, false] as const).map((value) => (
          <button
            key={String(value)}
            onClick={() => pick(value)}
            disabled={selected !== null}
            className={`btn-press flex-1 py-5 rounded-2xl border text-lg font-bold transition-all disabled:cursor-default ${styleFor(value)}`}
          >
            {value ? 'True' : 'False'}
          </button>
        ))}
      </div>
      {wrong && (
        <button
          onClick={() => onAnswer(false)}
          className="w-full py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition-all"
        >
          Continue →
        </button>
      )}
    </div>
  )
}

// ─── Fill in the Blank ────────────────────────────────────────────────────────

function FillBlank({ question, onAnswer }: Props & { question: Extract<Question, { type: 'fill-blank' }> }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  function check() {
    if (result) return
    const correct = isFuzzyMatch(input, question.answer)
    setResult(correct ? 'correct' : 'wrong')
    if (correct) {
      setTimeout(() => onAnswer(true), 800)
    }
    // wrong: wait for the Continue button
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') check()
  }

  return (
    <div className="flex flex-col gap-4">
      {question.hint && (
        <p className="text-white/30 text-xs italic">Hint: {question.hint}</p>
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        disabled={result !== null}
        placeholder="Type your answer…"
        className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white text-sm font-medium placeholder:text-white/25 focus:outline-none transition-all disabled:opacity-60 ${
          result === 'correct' ? 'border-green-400 bg-green-500/10' :
          result === 'wrong'   ? 'border-red-400 bg-red-500/10' :
                                 'border-white/10 focus:border-gold/50'
        }`}
      />
      {result === 'wrong' && (
        <p className="text-red-400 text-xs">
          Correct answer: <span className="font-semibold">{question.answer}</span>
        </p>
      )}
      {result === 'wrong' ? (
        <button
          onClick={() => onAnswer(false)}
          className="w-full py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition-all"
        >
          Continue →
        </button>
      ) : (
        <button
          onClick={check}
          disabled={!input.trim() || result !== null}
          className="btn-press w-full py-3.5 rounded-2xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {result === 'correct' ? '✓ Correct!' : 'Check'}
        </button>
      )}
    </div>
  )
}

// ─── Word Bank ────────────────────────────────────────────────────────────────

function WordBank({ question, onAnswer }: Props & { question: Extract<Question, { type: 'word-bank' }> }) {
  const [shuffledDefs] = useState(() => [...question.pairs].sort(() => Math.random() - 0.5))
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({}) // term -> definition
  const [wrong, setWrong] = useState<string | null>(null) // term that was wrong

  const matchedTerms = new Set(Object.keys(matched))
  const matchedDefs = new Set(Object.values(matched))

  function pickTerm(term: string) {
    if (matchedTerms.has(term)) return
    setSelectedTerm(term === selectedTerm ? null : term)
    setWrong(null)
  }

  function pickDef(def: string) {
    if (!selectedTerm || matchedDefs.has(def)) return
    const correctDef = question.pairs.find((p) => p.term === selectedTerm)?.definition
    if (def === correctDef) {
      const next = { ...matched, [selectedTerm]: def }
      setMatched(next)
      setSelectedTerm(null)
      setWrong(null)
      if (Object.keys(next).length === question.pairs.length) {
        setTimeout(() => onAnswer(true), 600)
      }
    } else {
      setWrong(selectedTerm)
      setTimeout(() => { setWrong(null); setSelectedTerm(null) }, 700)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Terms column */}
      <div className="flex flex-col gap-2">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-1">Term</p>
        {question.pairs.map((p) => {
          const isMatched = matchedTerms.has(p.term)
          const isSelected = selectedTerm === p.term
          const isWrong = wrong === p.term
          return (
            <button
              key={p.term}
              onClick={() => pickTerm(p.term)}
              disabled={isMatched}
              className={`btn-press text-left px-3 py-3 rounded-xl border text-xs font-semibold transition-all disabled:cursor-default ${
                isMatched  ? 'bg-green-500/15 border-green-400/40 text-green-400' :
                isWrong    ? 'bg-red-500/15 border-red-400 text-red-300' :
                isSelected ? 'bg-gold/20 border-gold text-gold' :
                             'bg-white/5 border-white/10 text-white hover:border-gold/40'
              }`}
            >
              {p.term}
            </button>
          )
        })}
      </div>

      {/* Definitions column */}
      <div className="flex flex-col gap-2">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-1">Definition</p>
        {shuffledDefs.map((p) => {
          const isMatched = matchedDefs.has(p.definition)
          return (
            <button
              key={p.definition}
              onClick={() => pickDef(p.definition)}
              disabled={isMatched || !selectedTerm}
              className={`btn-press text-left px-3 py-3 rounded-xl border text-xs transition-all disabled:cursor-default leading-snug ${
                isMatched ? 'bg-green-500/15 border-green-400/40 text-green-400' :
                selectedTerm ? 'bg-white/5 border-white/10 text-white hover:border-gold/40 hover:bg-gold/5' :
                              'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {p.definition}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function QuestionEngine({ question, onAnswer }: Props) {
  // Reset internal state when question changes
  const [key, setKey] = useState(question.id)
  useEffect(() => { setKey(question.id) }, [question.id])

  switch (question.type) {
    case 'multiple-choice':
      return <MultipleChoice key={key} question={question} onAnswer={onAnswer} />
    case 'true-false':
      return <TrueFalse key={key} question={question} onAnswer={onAnswer} />
    case 'fill-blank':
      return <FillBlank key={key} question={question} onAnswer={onAnswer} />
    case 'word-bank':
      return <WordBank key={key} question={question} onAnswer={onAnswer} />
  }
}
