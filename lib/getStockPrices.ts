import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export type StockPrice = {
  ticker: string
  price: number
  change: number
  changePercent: number
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const SYSTEM_PROMPT = `You are a financial data API. Return ONLY valid JSON — no markdown, no code blocks, no explanation.

Return a JSON array of exactly 5 objects with these fields:
- ticker: string
- price: number (realistic current price, slightly randomized each call)
- change: number (today's price change in dollars, can be positive or negative)
- changePercent: number (today's percentage change, can be positive or negative)

Tickers: AAPL, TSLA, GOOGL, MSFT, AMZN

Use realistic market prices with plausible single-day variation. Example shape:
[{"ticker":"AAPL","price":213.49,"change":1.23,"changePercent":0.58}]`

export async function getStockPrices(): Promise<StockPrice[]> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: 'Return current stock prices.' }],
  })
  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '[]'
  const clean = raw.replace(/```json|```/g, '').trim()
  const prices: StockPrice[] = JSON.parse(clean)

  await supabase.from('price_history').insert(
    prices.map((p) => ({ ticker: p.ticker, price: p.price }))
  )

  return prices
}
