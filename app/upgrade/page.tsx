import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import UpgradeButton from './UpgradeButton'

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const { success, canceled } = await searchParams

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .maybeSingle()

  const isPro = profile?.is_pro === true

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
            <span className="text-navy font-bold text-sm">IQ</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">InvestQuest</span>
        </div>
      </nav>

      <main className="flex-1 px-6 pt-12 pb-28">
        <div className="max-w-md mx-auto flex flex-col gap-4">

          {/* Success banner */}
          {success === 'true' && (
            <div className="bg-green-400/10 border border-green-400/30 rounded-2xl px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <p className="text-green-400 font-semibold text-sm">You&apos;re now Pro! Welcome to InvestQuest Pro.</p>
            </div>
          )}

          {/* Canceled banner */}
          {canceled === 'true' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <p className="text-white/50 text-sm">Payment canceled — no charge was made.</p>
            </div>
          )}

          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Upgrade</p>
            <h1 className="text-3xl font-bold text-white">InvestQuest Pro</h1>
          </div>

          {isPro ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-10 flex flex-col items-center gap-4 text-center">
              <span className="text-5xl">🎉</span>
              <div>
                <p className="text-white font-bold text-xl mb-1">You&apos;re already Pro!</p>
                <p className="text-white/50 text-sm">You have full access to all InvestQuest content.</p>
              </div>
              <Link
                href="/learn"
                className="mt-2 px-6 py-2.5 rounded-xl bg-gold text-navy text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Back to Learning
              </Link>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-8 flex flex-col gap-6">
              {/* Price */}
              <div>
                <p className="text-5xl font-bold text-white tabular-nums leading-none">
                  $7.99
                  <span className="text-lg font-normal text-white/40 ml-1">/ month</span>
                </p>
                <p className="text-white/40 text-xs mt-2">Cancel anytime. No lock-in.</p>
              </div>

              {/* Benefits */}
              <ul className="flex flex-col gap-3">
                {[
                  'Unlock all worlds',
                  'Unlimited lessons',
                  'Support indie development',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gold">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              <UpgradeButton />
            </div>
          )}

        </div>
      </main>

      <BottomNav />
    </div>
  )
}
