import { getStockPrices } from '@/lib/getStockPrices'

export async function GET() {
  try {
    const data = await getStockPrices()
    console.log(data)
    return Response.json(data)
  } catch (err) {
    console.error('Stock price fetch error:', err)
    return Response.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
