'use client'

import { useState, useEffect } from 'react'
import BottomNav from '@/components/BottomNav'
import { createClient } from '@/lib/supabase-browser'
import { fetchLivePrices, type StockPrice } from '@/lib/stockPrices'

const STOCK_META: Record<string, string> = {
  AAPL: 'Apple Inc.',
  TSLA: 'Tesla, Inc.',
  GOOGL: 'Alphabet Inc.',
  MSFT: 'Microsoft Corp.',
  AMZN: 'Amazon.com, Inc.',
}

const TICKERS = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN']

type Position = { ticker: string; shares: number; price: number; purchasePrice?: number }
type ModalTarget = { ticker: string; name: string; price: number; mode: 'buy' | 'sell'; maxShares?: number }

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const w = 100, h = 32
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ')
  const up = values[values.length - 1] >= values[0]
  return (
    <div className="rounded-lg bg-white/5 px-2 py-1">
      <svg width={w} height={h}>
        <polyline
          points={points}
          fill="none"
          stroke={up ? '#22c55e' : '#ef4444'}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

interface Props {
  userId: string
  initialCash: number
  initialPositions: Position[]
  initialPriceHistory: Record<string, number[]>
}

export default function SimulateClient({ userId, initialCash, initialPositions, initialPriceHistory }: Props) {
  const [cash, setCash] = useState(initialCash)
  const [portfolio, setPortfolio] = useState<Position[]>(initialPositions)
  const [modal, setModal] = useState<ModalTarget | null>(null)
  const [shareInput, setShareInput] = useState('1')
  const [prices, setPrices] = useState<StockPrice[]>([])
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>(initialPriceHistory)

  async function fetchHistory(): Promise<Record<string, number[]>> {
    const supabase = createClient()
    const { data } = await supabase
      .from('price_history')
      .select('ticker, price')
      .order('created_at', { ascending: false })
      .limit(100)
    const history: Record<string, number[]> = {}
    for (const ticker of TICKERS) {
      history[ticker] = (data ?? [])
        .filter((r) => r.ticker === ticker)
        .slice(0, 10)
        .reverse()
        .map((r) => r.price)
    }
    return history
  }

  async function refreshPrices() {
    setLoadingPrices(true)
    try {
      const data = await fetchLivePrices()
      setPrices(data)
      setLastFetched(new Date())
      console.log(prices)
      const history = await fetchHistory()
      setPriceHistory(history)
    } catch {
      // keep existing prices on error
    } finally {
      setLoadingPrices(false)
    }
  }

  useEffect(() => {
    refreshPrices()
    const interval = setInterval(refreshPrices, 30_000)
    return () => clearInterval(interval)
  }, [])

  const shareCount = Math.max(0, parseInt(shareInput, 10) || 0)
  const tradeValue = modal ? shareCount * modal.price : 0
  const overCash = modal?.mode === 'buy' && tradeValue > cash
  const overShares = modal?.mode === 'sell' && modal.maxShares !== undefined && shareCount > modal.maxShares
  const canConfirm = shareCount > 0 && !overCash && !overShares

  async function persist(newCash: number, newPositions: Position[]) {
    const supabase = createClient()
    await supabase
      .from('portfolios')
      .update({ cash_balance: newCash, positions: newPositions })
      .eq('user_id', userId)
  }

  function openBuy(stock: { ticker: string; name: string; price: number }) {
    setShareInput('1')
    setModal({ ...stock, mode: 'buy' })
  }

  function openSell(pos: Position) {
    const livePrice = prices.find((s) => s.ticker === pos.ticker)
    setShareInput('1')
    setModal({ ticker: pos.ticker, name: STOCK_META[pos.ticker] ?? pos.ticker, price: livePrice?.price ?? pos.price, mode: 'sell', maxShares: pos.shares })
  }

  function closeModal() {
    setModal(null)
  }

  async function confirmTrade() {
    if (!modal || !canConfirm) return

    let newCash: number
    let newPositions: Position[]

    if (modal.mode === 'buy') {
      newCash = cash - tradeValue
      const existing = portfolio.find((p) => p.ticker === modal.ticker)
      newPositions = existing
        ? portfolio.map((p) => {
            if (p.ticker !== modal.ticker) return p
            const newShares = p.shares + shareCount
            const newAvgPrice = (p.shares * (p.purchasePrice ?? p.price ?? 0) + shareCount * modal.price) / newShares
            return { ...p, shares: newShares, price: newAvgPrice, purchasePrice: newAvgPrice }
          })
        : [...portfolio, { ticker: modal.ticker, shares: shareCount, price: modal.price, purchasePrice: modal.price }]
    } else {
      newCash = cash + tradeValue
      newPositions = portfolio
        .map((p) => p.ticker === modal.ticker ? { ...p, shares: p.shares - shareCount } : p)
        .filter((p) => p.shares > 0)
    }

    setCash(newCash)
    setPortfolio(newPositions)
    closeModal()
    await persist(newCash, newPositions)
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
            {/* Summary card */}
            {(() => {
              const positionsValue = portfolio.reduce((sum, pos) => {
                const currentPrice = prices.find((p) => p.ticker === pos.ticker)?.price ?? pos.purchasePrice ?? pos.price ?? 0
                return sum + pos.shares * currentPrice
              }, 0)
              const totalValue = cash + positionsValue
              const totalGL = totalValue - 10_000
              const pctReturn = (totalGL / 10_000) * 100
              const up = totalGL >= 0
              return (
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-3">
                    Total Portfolio
                  </p>
                  <p className="text-3xl font-bold text-white mb-1">${fmt(totalValue)}</p>
                  <p className={`text-sm font-semibold tabular-nums ${up ? 'text-green-400' : 'text-red-400'}`}>
                    {up ? '+' : ''}{fmt(totalGL)} ({up ? '+' : ''}{pctReturn.toFixed(2)}%) vs $10,000 start
                  </p>
                </div>
              )
            })()}

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
                  {portfolio.map((pos) => {
                    const costBasis = pos.purchasePrice ?? pos.price ?? 0
                    const currentPrice = prices.find((p) => p.ticker === pos.ticker)?.price ?? costBasis
                    const unrealizedGL = (currentPrice - costBasis) * pos.shares
                    const pctChange = costBasis > 0 ? ((currentPrice - costBasis) / costBasis) * 100 : 0
                    const up = unrealizedGL >= 0
                    return (
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
                          <div className="text-right">
                            <p className="text-gold font-semibold tabular-nums text-sm">
                              ${fmt(pos.shares * currentPrice)}
                            </p>
                            <p className={`text-xs tabular-nums ${up ? 'text-green-400' : 'text-red-400'}`}>
                              {up ? '+' : ''}{fmt(unrealizedGL)} ({up ? '+' : ''}{pctChange.toFixed(2)}%)
                            </p>
                          </div>
                          <button
                            onClick={() => openSell(pos)}
                            className="px-3 py-1.5 rounded-lg border border-white/20 text-white/70 text-xs font-bold hover:bg-white/10 transition-colors"
                          >
                            Sell
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Market section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-white/50 font-semibold uppercase tracking-widest">
                  Market
                </p>
                <button
                  onClick={refreshPrices}
                  disabled={loadingPrices}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs font-semibold hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loadingPrices ? (
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                    </svg>
                  )}
                  Refresh Prices
                </button>
              </div>
              {loadingPrices && prices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <svg className="w-6 h-6 animate-spin text-gold/40" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-white/30 text-xs">Fetching live prices…</p>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-white/5">
                  {TICKERS.map((ticker) => {
                    const live = prices.find((p) => p.ticker === ticker)
                    const up = (live?.change ?? 0) >= 0
                    return (
                      <li key={ticker} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                            <span className="text-gold text-[10px] font-bold">{ticker.slice(0, 3)}</span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">{ticker}</p>
                            <p className="text-white/40 text-xs">{STOCK_META[ticker]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-white text-xs">SPARK</span>
                          <Sparkline values={priceHistory[ticker] ?? []} />
                          <div className="text-right">
                            <p className="text-white font-semibold tabular-nums text-sm">
                              {live ? `$${live.price.toFixed(2)}` : '—'}
                            </p>
                            {live && (
                              <p className={`text-xs tabular-nums ${up ? 'text-green-400' : 'text-red-400'}`}>
                                {up ? '+' : ''}{live.change.toFixed(2)} ({up ? '+' : ''}{live.changePercent.toFixed(2)}%)
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => live && openBuy({ ticker, name: STOCK_META[ticker], price: live.price })}
                            disabled={!live || loadingPrices}
                            className="px-3 py-1.5 rounded-lg bg-gold text-navy text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Buy
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
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
              {modal.mode === 'buy' && lastFetched && (
                <p className="text-white/30 text-xs mt-0.5">
                  Buying at ${modal.price.toFixed(2)} · as of {lastFetched.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              )}
              {modal.mode === 'sell' && modal.maxShares !== undefined && (
                <p className="text-white/40 text-xs mt-0.5">
                  You own {modal.maxShares} {modal.maxShares === 1 ? 'share' : 'shares'}
                </p>
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
            {overShares && (
              <p className="text-red-400 text-xs -mt-2">
                You only own {modal.maxShares} {modal.maxShares === 1 ? 'share' : 'shares'}
              </p>
            )}

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
