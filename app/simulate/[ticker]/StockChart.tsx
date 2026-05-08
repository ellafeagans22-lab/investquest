'use client'

type PricePoint = { price: number; fetched_at: string }

interface Props {
  ticker: string
  prices: PricePoint[]
}

export default function StockChart({ ticker, prices }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <pre className="text-white/60 text-xs overflow-auto">
        {JSON.stringify({ ticker, count: prices.length, prices }, null, 2)}
      </pre>
    </div>
  )
}
