import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

export default async function StockDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
            <span className="text-navy font-bold text-sm">IQ</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">
            InvestQuest
          </span>
        </div>
      </nav>

      <main className="flex-1 px-6 pt-10 pb-28">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/simulate"
            className="inline-flex items-center gap-1.5 text-white/50 text-sm font-medium hover:text-white/80 transition-colors mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
            Back to Simulator
          </Link>

          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">
            Stock Detail
          </p>
          <h1 className="text-5xl font-bold text-white mb-2">{ticker.toUpperCase()}</h1>

          {/* Chart placeholder */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center h-48">
            <p className="text-white/30 text-sm font-medium">Chart coming soon</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
