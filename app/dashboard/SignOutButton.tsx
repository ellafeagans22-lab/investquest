'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="border border-white/30 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
    >
      Sign out
    </button>
  )
}
