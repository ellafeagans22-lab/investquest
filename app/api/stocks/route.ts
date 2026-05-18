import { getStockPrices } from '@/lib/getStockPrices'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

type Position = { ticker: string; shares: number; price: number; purchasePrice?: number }

export async function GET() {
  try {
    const data = await getStockPrices()

    const priceMap = new Map(data.map((p) => [p.ticker, p.price]))

    const { data: portfolios } = await supabase
      .from('portfolios')
      .select('user_id, cash_balance, positions')

    if (portfolios && portfolios.length > 0) {
      const snapshots = portfolios.map((portfolio) => {
        const positions: Position[] = portfolio.positions ?? []
        const positionsValue = positions.reduce((sum, pos) => {
          const price = priceMap.get(pos.ticker)
          if (price === undefined) return sum
          return sum + pos.shares * price
        }, 0)
        return { user_id: portfolio.user_id, total_value: portfolio.cash_balance + positionsValue }
      })
      await supabase.from('portfolio_snapshots').insert(snapshots)
    }

    return Response.json(data)
  } catch (err) {
    console.error('Stock price fetch error:', err)
    return Response.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
