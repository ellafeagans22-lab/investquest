import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a financial data API. Return ONLY valid JSON — no markdown, no code blocks, no explanation.

Return a JSON array of exactly 5 objects with these fields:
- ticker: string
- price: number (realistic current price, slightly randomized each call)
- change: number (today's price change in dollars, can be positive or negative)
- changePercent: number (today's percentage change, can be positive or negative)

Tickers: AAPL, TSLA, GOOGL, MSFT, AMZN

Use realistic market prices with plausible single-day variation. Example shape:
[{"ticker":"AAPL","price":213.49,"change":1.23,"changePercent":0.58}]`

export async function GET() {
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: 'Return current stock prices.' }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '[]'
    const data = JSON.parse(raw)
    return Response.json(data)
  } catch (err) {
    console.error('Stock price fetch error:', err)
    return Response.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
