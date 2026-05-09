'use client'

import { useState, useEffect } from 'react'
import type { Question } from '@/lib/worlds'

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
    setTimeout(() => onAnswer(index === question.correctIndex), 800)
  }

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
            className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all ${style} disabled:cursor-default`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── True / False ─────────────────────────────────────────────────────────────

function TrueFalse({ question, onAnswer }: Props & { question: Extract<Question, { type: 'true-false' }> }) {
  const [selected, setSelected] = useState<boolean | null>(null)

  function pick(value: boolean) {
    if (selected !== null) return
    setSelected(value)
    setTimeout(() => onAnswer(value === question.correct), 800)
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

  return (
    <div className="flex gap-4">
      {([true, false] as const).map((value) => (
        <button
          key={String(value)}
          onClick={() => pick(value)}
          disabled={selected !== null}
          className={`flex-1 py-5 rounded-2xl border text-lg font-bold transition-all disabled:cursor-default ${styleFor(value)}`}
        >
          {value ? 'True' : 'False'}
        </button>
      ))}
    </div>
  )
}

// ─── Fill in the Blank ────────────────────────────────────────────────────────

function FillBlank({ question, onAnswer }: Props & { question: Extract<Question, { type: 'fill-blank' }> }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  function check() {
    if (result) return
    const correct = input.trim().toLowerCase() === question.answer.trim().toLowerCase()
    setResult(correct ? 'correct' : 'wrong')
    setTimeout(() => onAnswer(correct), 800)
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
      <button
        onClick={check}
        disabled={!input.trim() || result !== null}
        className="w-full py-3.5 rounded-2xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {result === 'correct' ? '✓ Correct!' : result === 'wrong' ? '✗ Wrong' : 'Check'}
      </button>
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
              className={`text-left px-3 py-3 rounded-xl border text-xs font-semibold transition-all disabled:cursor-default ${
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
              className={`text-left px-3 py-3 rounded-xl border text-xs transition-all disabled:cursor-default leading-snug ${
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
