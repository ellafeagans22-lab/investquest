'use client'

import { useState } from 'react'

interface Props {
  ticker: string
  currentPrice: number | null
  sharesOwned: number | null
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function TradeActions({ ticker, currentPrice, sharesOwned }: Props) {
  const [mode, setMode] = useState<'buy' | 'sell' | null>(null)
  const [shareInput, setShareInput] = useState('1')

  const shareCount = Math.max(0, parseInt(shareInput, 10) || 0)
  const total = currentPrice != null ? shareCount * currentPrice : 0
  const overShares = mode === 'sell' && sharesOwned != null && shareCount > sharesOwned
  const canConfirm = shareCount > 0 && !overShares

  function open(m: 'buy' | 'sell') {
    setShareInput('1')
    setMode(m)
  }

  function close() {
    setMode(null)
  }

  return (
    <>
      {/* Action bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-3 bg-navy/95 backdrop-blur border-t border-white/10">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={() => open('buy')}
            className="flex-1 py-3 rounded-xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Buy {ticker}
          </button>
          {sharesOwned != null && (
            <button
              onClick={() => open('sell')}
              className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 text-sm font-bold hover:bg-white/5 transition-colors"
            >
              Sell {ticker}
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {mode && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-6 sm:pb-0"
          onClick={close}
        >
          <div
            className="w-full max-w-sm bg-[#1B2E4B] border border-white/10 rounded-2xl p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">
                {mode === 'buy' ? 'Buy' : 'Sell'} {ticker}
              </p>
              <p className="text-gold font-bold text-xl">
                {currentPrice != null ? `$${fmt(currentPrice)} / share` : '—'}
              </p>
              {mode === 'sell' && sharesOwned != null && (
                <p className="text-white/40 text-xs mt-0.5">
                  You own {sharesOwned} {sharesOwned === 1 ? 'share' : 'shares'}
                </p>
              )}
            </div>

            {/* Share input */}
            <div>
              <label className="text-xs text-white/50 font-semibold uppercase tracking-widest block mb-2">
                How many shares?
              </label>
              <input
                type="number"
                min="1"
                max={mode === 'sell' && sharesOwned != null ? sharesOwned : undefined}
                value={shareInput}
                onChange={(e) => setShareInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-gold/50 transition-colors"
                autoFocus
              />
            </div>

            {/* Total */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">{mode === 'buy' ? 'Total cost' : 'You receive'}</span>
              <span className={`font-semibold tabular-nums ${overShares ? 'text-red-400' : 'text-white'}`}>
                ${fmt(total)}
              </span>
            </div>

            {overShares && (
              <p className="text-red-400 text-xs -mt-2">
                You only own {sharesOwned} {sharesOwned === 1 ? 'share' : 'shares'}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={close}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!canConfirm}
                className="flex-1 py-3 rounded-xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
