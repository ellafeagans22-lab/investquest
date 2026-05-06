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

  return (
    <SimulateClient
      userId={user.id}
      initialCash={portfolio?.cash_balance ?? 10000}
      initialPositions={positions}
    />
  )
}
