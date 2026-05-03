'use client'

import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const supabase = createClient()

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 sm:px-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center shrink-0">
              <span className="text-navy font-bold text-base">IQ</span>
            </div>
            <span className="text-navy font-bold text-2xl tracking-tight">
              InvestQuest
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-foreground">
            Start your journey
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Learn to invest smarter. Sign in to track your progress and unlock
            every lesson.
          </p>

          {/* Divider */}
          <div className="my-7 border-t border-foreground/10" />

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-green hover:bg-green-dark text-white font-semibold px-5 py-3.5 rounded-xl transition-colors duration-150 shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-foreground/40">
            By continuing, you agree to our{' '}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground/60">
              Terms
            </span>{' '}
            and{' '}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground/60">
              Privacy Policy
            </span>
            .
          </p>
        </div>

        {/* Below-card tagline */}
        <p className="mt-6 text-center text-sm text-white/40">
          The smart way to grow your financial confidence.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 h-5 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#ffffff"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        opacity=".9"
      />
      <path
        fill="#ffffff"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        opacity=".75"
      />
      <path
        fill="#ffffff"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        opacity=".6"
      />
      <path
        fill="#ffffff"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        opacity=".85"
      />
    </svg>
  )
}
