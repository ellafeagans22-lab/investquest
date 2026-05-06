export type { StockPrice } from './getStockPrices'
import type { StockPrice } from './getStockPrices'

export async function fetchLivePrices(): Promise<StockPrice[]> {
  const res = await fetch('/api/stocks', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch stock prices')
  return res.json()
}
