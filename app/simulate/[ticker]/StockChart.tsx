'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

type PricePoint = { price: number; fetched_at: string }

interface Props {
  ticker: string
  prices: PricePoint[]
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function StockChart({ ticker, prices }: Props) {
  const data = prices.map((p) => ({ time: formatTime(p.fetched_at), price: p.price }))

  if (data.length < 2) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center h-48">
        <p className="text-white/30 text-sm font-medium">Not enough data yet</p>
      </div>
    )
  }

  const prices_ = data.map((d) => d.price)
  const min = Math.min(...prices_)
  const max = Math.max(...prices_)
  const pad = (max - min) * 0.1 || 1

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 pt-5 pb-3">
      <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-4 px-2">
        {ticker} Price History
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[min - pad, max + pad]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            width={48}
          />
          <Tooltip
            contentStyle={{ background: '#0F2137', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            itemStyle={{ color: '#F59E0B', fontWeight: 600 }}
            formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#F59E0B' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
