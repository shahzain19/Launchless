export default function Landing() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
          {/* Logo */}
          <div className="mb-16">
            <img
              src="/Logo.png"
              alt="Launchless"
              className="w-12 h-12 mx-auto opacity-90"
            />
          </div>

          {/* Hero Text */}
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
            AI finds people who
            <br />
            <span className="text-zinc-500">already need your product</span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
            Signal Finder scans GitHub, Reddit, and Twitter to surface ranked leads with context.
            <br />
            <span className="text-zinc-500">AI does discovery. You do conversation.</span>
          </p>

          {/* CTA */}
          <div className="mb-12">
            <a
              href="/projects"
              className="inline-flex items-center px-8 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-zinc-100 transition-all duration-300 hover:scale-105 shadow-2xl shadow-white/10"
            >
              Find your first signals
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-zinc-600">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              No automation
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              No spam
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              GitHub sign-in
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-light text-zinc-300 mb-4">How it works</h2>
            <p className="text-zinc-500">Three steps to find your ideal customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-800 transition-colors">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Define Intent</h3>
              <p className="text-zinc-500 leading-relaxed">
                Describe your product, target audience, and pain points. AI generates signal patterns.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-800 transition-colors">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-medium mb-3">AI Scans</h3>
              <p className="text-zinc-500 leading-relaxed">
                Real-time scanning of GitHub repos, Reddit posts, and Twitter for launch signals.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-800 transition-colors">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Get Leads</h3>
              <p className="text-zinc-500 leading-relaxed">
                Receive ranked lead cards with context and AI-generated conversation starters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Card Preview */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-zinc-300 mb-4">Lead cards, not DMs</h2>
            <p className="text-zinc-500">See exactly who to contact and what to say</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">🐙</span>
                </div>
                <div>
                  <div className="font-medium">Lead #14</div>
                  <div className="text-sm text-zinc-500">GitHub • 2 hours ago</div>
                </div>
              </div>
              <div className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                92% confidence
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl p-6 mb-6">
              <div className="text-sm text-zinc-400 mb-4">
                <span className="text-zinc-300 font-medium">Signal:</span> Recent deploy + live demo
              </div>
              <div className="text-sm text-zinc-500 mb-4">
                Solo maintainer • No launch post found • 12 stars
              </div>
              <div className="text-zinc-300 italic leading-relaxed">
                "This looks production-ready. Did you already have a launch post in mind, or is that still on the todo list?"
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-white text-black py-3 rounded-xl font-medium hover:bg-zinc-100 transition-colors">
                Mark contacted
              </button>
              <button className="px-6 py-3 text-zinc-400 hover:text-zinc-200 transition-colors">
                Skip
              </button>
              <button className="px-6 py-3 text-zinc-400 hover:text-zinc-200 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-zinc-300 mb-16">Why this works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-zinc-300">No bans (you're not automating)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-zinc-300">No spam (you choose who to contact)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-zinc-300">High trust (genuine conversations)</span>
              </div>
            </div>
            <div className="text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-zinc-300">Perfect timing (they just shipped)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-zinc-300">Context provided (you know what to say)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-zinc-300">Real data (no mock leads)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-zinc-300 mb-8">Scans real APIs</h2>
          <p className="text-zinc-500 mb-12">Live data from platforms where builders share their work</p>
          
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐙</span>
              </div>
              <div className="font-medium mb-1">GitHub</div>
              <div className="text-sm text-zinc-500">Recent deploys</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="font-medium mb-1">Reddit</div>
              <div className="text-sm text-zinc-500">Launch posts</div>
            </div>
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐦</span>
              </div>
              <div className="font-medium mb-1">Twitter</div>
              <div className="text-sm text-zinc-500">Requires API key</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light mb-6">
            Find 3 people today who already need your product
          </h2>
          <p className="text-xl text-zinc-500 mb-12">
            No dashboards. No subscriptions. No BS.
          </p>
          
          <a
            href="/projects"
            className="inline-flex items-center px-8 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-zinc-100 transition-all duration-300 hover:scale-105 shadow-2xl shadow-white/10"
          >
            Start finding signals
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 text-center">
        <p className="text-sm text-zinc-600">
          Built for indie developers who love building but hate marketing
        </p>
      </footer>
    </main>
  );
}
