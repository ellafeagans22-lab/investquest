'use client'

import { useState } from 'react'
import BottomNav from '@/components/BottomNav'

const stocks = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: 213.49 },
  { ticker: 'TSLA', name: 'Tesla, Inc.', price: 174.82 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 172.63 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: 415.30 },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.', price: 196.11 },
]

type Position = { ticker: string; shares: number; price: number }
type ModalTarget = { ticker: string; name: string; price: number; mode: 'buy' | 'sell'; maxShares?: number }

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function SimulatePage() {
  const [cash, setCash] = useState(10_000)
  const [portfolio, setPortfolio] = useState<Position[]>([])
  const [modal, setModal] = useState<ModalTarget | null>(null)
  const [shareInput, setShareInput] = useState('1')

  const shareCount = Math.max(0, parseInt(shareInput, 10) || 0)
  const tradeValue = modal ? shareCount * modal.price : 0
  const overCash = modal?.mode === 'buy' && tradeValue > cash
  const overShares = modal?.mode === 'sell' && modal.maxShares !== undefined && shareCount > modal.maxShares
  const canConfirm = shareCount > 0 && !overCash && !overShares

  function openBuy(stock: { ticker: string; name: string; price: number }) {
    setShareInput('1')
    setModal({ ...stock, mode: 'buy' })
  }

  function openSell(pos: Position) {
    const stock = stocks.find((s) => s.ticker === pos.ticker)
    setShareInput('1')
    setModal({ ticker: pos.ticker, name: stock?.name ?? pos.ticker, price: pos.price, mode: 'sell', maxShares: pos.shares })
  }

  function closeModal() {
    setModal(null)
  }

  function confirmTrade() {
    if (!modal || !canConfirm) return
    if (modal.mode === 'buy') {
      setCash((prev) => prev - tradeValue)
      setPortfolio((prev) => {
        const existing = prev.find((p) => p.ticker === modal.ticker)
        if (existing) {
          return prev.map((p) =>
            p.ticker === modal.ticker ? { ...p, shares: p.shares + shareCount } : p
          )
        }
        return [...prev, { ticker: modal.ticker, shares: shareCount, price: modal.price }]
      })
    } else {
      setCash((prev) => prev + tradeValue)
      setPortfolio((prev) =>
        prev
          .map((p) => p.ticker === modal.ticker ? { ...p, shares: p.shares - shareCount } : p)
          .filter((p) => p.shares > 0)
      )
    }
    closeModal()
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
            Simulate
          </p>
          <h1 className="text-3xl font-bold text-white mb-8">
            Investment Simulator
          </h1>

          <div className="flex flex-col gap-4">
            {/* Cash balance card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                  Virtual Cash
                </p>
                <p className="text-3xl font-bold text-gold">${fmt(cash)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gold">
                  <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
                  <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                </svg>
              </div>
            </div>

            {/* Portfolio section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-4">
                Your Portfolio
              </p>
              {portfolio.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <span className="text-3xl">📭</span>
                  <p className="text-white/30 text-sm font-medium">No positions yet</p>
                  <p className="text-white/20 text-xs">Buy a stock below to get started</p>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-white/5">
                  {portfolio.map((pos) => (
                    <li key={pos.ticker} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                          <span className="text-gold text-[10px] font-bold">{pos.ticker.slice(0, 3)}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{pos.ticker}</p>
                          <p className="text-white/40 text-xs">{pos.shares} {pos.shares === 1 ? 'share' : 'shares'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-gold font-semibold tabular-nums">
                          ${fmt(pos.shares * pos.price)}
                        </p>
                        <button
                          onClick={() => openSell(pos)}
                          className="px-3 py-1.5 rounded-lg border border-white/20 text-white/70 text-xs font-bold hover:bg-white/10 transition-colors"
                        >
                          Sell
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Market section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-4">
                Market
              </p>
              <ul className="flex flex-col divide-y divide-white/5">
                {stocks.map((stock) => (
                  <li key={stock.ticker} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold text-[10px] font-bold">{stock.ticker.slice(0, 3)}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{stock.ticker}</p>
                        <p className="text-white/40 text-xs">{stock.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-semibold tabular-nums">
                        ${stock.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => openBuy(stock)}
                        className="px-3 py-1.5 rounded-lg bg-gold text-navy text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        Buy
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Trade modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-6 sm:pb-0"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-sm bg-[#1B2E4B] border border-white/10 rounded-2xl p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-1">
                {modal.mode === 'buy' ? 'Buy' : 'Sell'} {modal.ticker}
              </p>
              <p className="text-white/60 text-sm">{modal.name}</p>
              <p className="text-gold font-bold text-xl mt-1">${modal.price.toFixed(2)} / share</p>
              {modal.mode === 'sell' && modal.maxShares !== undefined && (
                <p className="text-white/40 text-xs mt-0.5">You own {modal.maxShares} {modal.maxShares === 1 ? 'share' : 'shares'}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-white/50 font-semibold uppercase tracking-widest block mb-2">
                How many shares?
              </label>
              <input
                type="number"
                min="1"
                max={modal.mode === 'sell' ? modal.maxShares : undefined}
                value={shareInput}
                onChange={(e) => setShareInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-gold/50 transition-colors"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">{modal.mode === 'buy' ? 'Total cost' : 'You receive'}</span>
              <span className={`font-semibold tabular-nums ${overCash || overShares ? 'text-red-400' : 'text-white'}`}>
                ${fmt(tradeValue)}
              </span>
            </div>

            {overCash && <p className="text-red-400 text-xs -mt-2">Not enough cash</p>}
            {overShares && <p className="text-red-400 text-xs -mt-2">You only own {modal.maxShares} {modal.maxShares === 1 ? 'share' : 'shares'}</p>}

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmTrade}
                disabled={!canConfirm}
                className="flex-1 py-3 rounded-xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
