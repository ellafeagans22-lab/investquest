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
    .select('ticker, price')
    .order('created_at', { ascending: false })
    .limit(100)

  const TICKERS = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN']
  const initialPriceHistory: Record<string, number[]> = {}
  for (const ticker of TICKERS) {
    initialPriceHistory[ticker] = (historyRows ?? [])
      .filter((r) => r.ticker === ticker)
      .slice(0, 10)
      .reverse()
      .map((r) => r.price)
  }

  return (
    <SimulateClient
      userId={user.id}
      initialCash={portfolio?.cash_balance ?? 10000}
      initialPositions={positions}
      initialPriceHistory={initialPriceHistory}
    />
  )
}
