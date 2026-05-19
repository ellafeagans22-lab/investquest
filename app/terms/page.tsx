import Link from 'next/link'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-white/40 text-sm mb-12">Last updated: May 2026</p>

          <div className="flex flex-col gap-10 text-white/70 text-sm leading-relaxed">

            <section>
              <h2 className="text-white font-bold text-lg mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using InvestQuest, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app. We may update these terms from time to time and will note the date of the most recent revision above.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">2. Not Financial Advice</h2>
              <p>InvestQuest is an educational platform only. Nothing on this app constitutes financial, investment, legal, or tax advice. All content — including lessons, simulations, stock prices, and any AI-generated material — is provided for educational purposes only. You are solely responsible for your own financial decisions. Always consult a qualified financial advisor before making real investment decisions.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">3. AI-Powered Content</h2>
              <p>Some content on InvestQuest, including simulated stock prices and lesson material, is generated or assisted by artificial intelligence (AI) models provided by Anthropic. AI-generated content may contain errors, inaccuracies, or outdated information. InvestQuest makes no guarantees about the accuracy or completeness of AI-generated content. You acknowledge that simulated stock prices do not reflect real market conditions and are not suitable for use in actual investment decisions.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">4. Simulated Trading</h2>
              <p>The investment simulator uses virtual currency only. No real money is involved. Simulated returns do not predict or guarantee actual investment performance. Past simulated performance is not indicative of future real-world results.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">5. No Warranties</h2>
              <p>InvestQuest is provided "as is" without warranties of any kind, express or implied. We do not warrant that the app will be error-free, uninterrupted, or free of harmful components. To the fullest extent permitted by law, InvestQuest disclaims all warranties, including implied warranties of merchantability and fitness for a particular purpose.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">6. Limitation of Liability</h2>
              <p>InvestQuest and its creators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app, including but not limited to financial losses resulting from decisions made based on content found here.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">7. User Conduct</h2>
              <p>You agree not to misuse the platform, attempt to reverse-engineer it, or use it for any unlawful purpose. We reserve the right to suspend or terminate access to any user at our discretion.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">8. Contact</h2>
              <p>Questions about these terms? Contact us at <span className="text-gold">support@investquest.app</span>.</p>
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
