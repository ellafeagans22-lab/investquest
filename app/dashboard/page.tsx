import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-sm">IQ</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              InvestQuest
            </span>
          </div>
          <SignOutButton />
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Dashboard
          </p>
          <h1 className="text-4xl font-bold text-white">
            Welcome back!
          </h1>
          <p className="mt-3 text-white/60 text-lg">{user.email}</p>
        </div>
      </main>
    </div>
  )
}
