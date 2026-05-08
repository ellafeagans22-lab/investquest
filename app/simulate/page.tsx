import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SimulateClient from './SimulateClient'

export default async function SimulatePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let { data: portfolio } = await supabase
    .from('portfolios')
    .select('cash_balance, positions')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!portfolio) {
    const { data } = await supabase
      .from('portfolios')
      .insert({ user_id: user.id, cash_balance: 10000, positions: [] })
      .select('cash_balance, positions')
      .single()
    portfolio = data
  }

  const positions = portfolio?.positions ?? []
  positions.forEach((pos: unknown) => console.log('[portfolio position]', pos))

  const { data: historyRows } = await supabase
    .from('price_history')
    .select('ticker, price, fetched_at')
    .order('fetched_at', { ascending: true })

  const TICKERS = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN']
  const initialPriceHistory: Record<string, number[]> = {}
  const latestPriceByTicker: Record<string, number> = {}
  for (const ticker of TICKERS) {
    const rows = (historyRows ?? []).filter((r) => r.ticker === ticker)
    initialPriceHistory[ticker] = rows.slice(-10).map((r) => r.price)
    if (rows.length > 0) latestPriceByTicker[ticker] = rows[rows.length - 1].price
  }

  type RawPosition = { ticker: string; shares: number; price: number; purchasePrice?: number }
  const cash = portfolio?.cash_balance ?? 10000
  const positionsValue = (positions as RawPosition[]).reduce((sum, pos) => {
    const price = latestPriceByTicker[pos.ticker] ?? pos.purchasePrice ?? pos.price ?? 0
    return sum + pos.shares * price
  }, 0)
  const initialTotalValue = cash + positionsValue

  const [{ data: transactions }, { data: snapshots, error: snapshotsErr }] = await Promise.all([
    supabase
      .from('transactions')
      .select('id, ticker, action, shares, price_per_share, total_value, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('portfolio_snapshots')
      .select('total_value, recorded_at')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: true }),
  ])

  console.log('[snapshots] user_id:', user.id, 'rows:', snapshots ?? [], 'error:', snapshotsErr)

  return (
    <SimulateClient
      userId={user.id}
      initialCash={portfolio?.cash_balance ?? 10000}
      initialPositions={positions}
      initialPriceHistory={initialPriceHistory}
      initialTransactions={transactions ?? []}
      initialTotalValue={initialTotalValue}
      initialSnapshots={snapshots ?? []}
    />
  )
}
