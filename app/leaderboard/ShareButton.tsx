'use client'

import { useState } from 'react'

interface Props {
  rank: number
  gainPct: number
}

export default function ShareButton({ rank, gainPct }: Props) {
  const [copied, setCopied] = useState(false)

  const sign = gainPct >= 0 ? '+' : ''
  const message = `I'm ${sign}${gainPct.toFixed(1)}% on InvestQuest — ranked #${rank}! Can you beat me? investquest-ten.vercel.app`

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text: message })
      } catch {
        // user cancelled — do nothing
      }
      return
    }
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className="w-full py-3 rounded-xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity"
    >
      {copied ? 'Copied!' : 'Share My Rank'}
    </button>
  )
}
