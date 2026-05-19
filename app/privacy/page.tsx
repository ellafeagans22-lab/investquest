import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy">
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-sm">IQ</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">InvestQuest</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/40 text-sm mb-12">Last updated: May 2026</p>

          <div className="flex flex-col gap-10 text-white/70 text-sm leading-relaxed">

            <section>
              <h2 className="text-white font-bold text-lg mb-3">1. What We Collect</h2>
              <p className="mb-3">When you use InvestQuest, we collect the following information:</p>
              <ul className="flex flex-col gap-2 pl-4 list-disc list-outside marker:text-gold/60">
                <li><span className="text-white/90 font-medium">Email address</span> — provided when you sign in via Google, used to identify your account.</li>
                <li><span className="text-white/90 font-medium">Display name</span> — optionally set by you within the app.</li>
                <li><span className="text-white/90 font-medium">Lesson progress</span> — which lessons you have completed, stored to track your curriculum progress.</li>
                <li><span className="text-white/90 font-medium">XP and streaks</span> — your experience points, level, and daily streak, used to power the progress system.</li>
                <li><span className="text-white/90 font-medium">Simulated portfolio data</span> — virtual cash balance, simulated trades, and portfolio snapshots. This involves no real money.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">2. How We Use Your Data</h2>
              <p className="mb-3">Your data is used solely to operate and improve InvestQuest:</p>
              <ul className="flex flex-col gap-2 pl-4 list-disc list-outside marker:text-gold/60">
                <li>To authenticate you and maintain your account across sessions.</li>
                <li>To display your progress, XP, streaks, and completed lessons.</li>
                <li>To power the investment simulator with your virtual portfolio.</li>
                <li>To improve the app experience based on aggregate, anonymized usage patterns.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">3. Data Storage</h2>
              <p>Your data is stored securely using <span className="text-white/90">Supabase</span>, a third-party database provider. Data is stored in the United States. Supabase's own privacy policy governs their handling of infrastructure-level data.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">4. We Do Not Sell Your Data</h2>
              <p>We do not sell, rent, or share your personal information with third parties for marketing or advertising purposes. Period.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">5. AI-Generated Content</h2>
              <p>Some features of InvestQuest use AI models provided by Anthropic to generate educational content and simulated stock prices. Your lesson interactions and usage patterns may be used to improve app features, but individual user data is not shared with Anthropic for training purposes.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">6. Cookies & Local Storage</h2>
              <p>InvestQuest uses browser local storage to save preferences such as your watchlist. Authentication sessions use secure cookies managed by Supabase. We do not use third-party tracking or advertising cookies.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">7. Account Deletion</h2>
              <p>You can request deletion of your account and all associated data at any time by emailing <span className="text-gold">support@investquest.app</span>. We will process your request within 30 days.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">8. Contact</h2>
              <p>Questions about this policy? Reach us at <span className="text-gold">support@investquest.app</span>.</p>
            </section>

          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-6">
        <div className="max-w-2xl mx-auto flex gap-4 text-white/30 text-xs">
          <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
          <span>© 2026 InvestQuest</span>
        </div>
      </footer>
    </div>
  )
}
