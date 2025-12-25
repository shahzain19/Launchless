export default function Landing() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
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
            Launch content +
            <br />
            <span className="text-gray-600">customer discovery</span>
            <br />
            <span className="text-2xl md:text-3xl text-gray-500 font-normal">in seconds</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16 font-light leading-relaxed">
            AI generates founder-grade launch content for all platforms, then finds people who already need your product.
            <br />
            <span className="text-gray-500">Complete launch system. Zero marketing experience required.</span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700">
              📝 Launch content
            </div>
            <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700">
              🎬 Video scripts
            </div>
            <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700">
              🔍 Signal finder
            </div>
            <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700">
              🧠 AI insights
            </div>
          </div>

          {/* CTA */}
          <div className="mb-12">
            <a
              href="/projects"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start your launch
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 flex-wrap">
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
              Real APIs
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              GitHub sign-in
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-light text-black mb-4">Complete launch system</h2>
            <p className="text-gray-600">From content creation to customer discovery</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Generate Content</h3>
              <p className="text-gray-600 leading-relaxed">
                AI creates launch content for all platforms: Product Hunt, Twitter, LinkedIn, video scripts, and more.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Find Customers</h3>
              <p className="text-gray-600 leading-relaxed">
                Signal Finder scans GitHub, Reddit, and Twitter to find people who already need your product.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Launch & Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Post your content and reach out to leads with AI-generated conversation starters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Card Preview */}
      <section className="py-24 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-black mb-4">Lead cards, not DMs</h2>
            <p className="text-gray-600">See exactly who to contact and what to say</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🐙</span>
                </div>
                <div>
                  <div className="font-medium">Lead #14</div>
                  <div className="text-sm text-gray-500">GitHub • 2 hours ago</div>
                </div>
              </div>
              <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                92% confidence
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-sm text-gray-600 mb-4">
                <span className="text-black font-medium">Signal:</span> Recent deploy + live demo
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Solo maintainer • No launch post found • 12 stars
              </div>
              <div className="text-black italic leading-relaxed">
                "This looks production-ready. Did you already have a launch post in mind, or is that still on the todo list?"
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Mark contacted
              </button>
              <button className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                Skip
              </button>
              <button className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-24 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-black mb-16">Why this works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-black">No bans (you're not automating)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-black">No spam (you choose who to contact)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-black">High trust (genuine conversations)</span>
              </div>
            </div>
            <div className="text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-black">Perfect timing (they just shipped)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-black">Context provided (you know what to say)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-black">Real data (no mock leads)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Generation Features */}
      <section className="py-24 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-black mb-4">Everything you need to launch</h2>
            <p className="text-gray-600">AI generates founder-grade content in seconds</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Text Content */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black">Text Launch Content</h3>
                  <p className="text-sm text-gray-600">Ready-to-post copy for all platforms</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-black">Product positioning & core hooks</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-black">Product Hunt launch post</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-black">Twitter/X launch threads (3 versions)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-black">LinkedIn launch post</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-black">7-day follow-up campaign</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-black">Call-to-action copy</span>
                </div>
              </div>
            </div>

            {/* Video Content */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎬</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-black">Video Launch Plan</h3>
                  <p className="text-sm text-gray-600">Complete video production roadmap</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-black">Shot list with timing</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-black">Teleprompter notes</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-black">Short-form script (TikTok/Reels)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-black">Long-form script (YouTube)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-black">Visual & audio direction</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-black">Estimated duration planning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Launchless Insights */}
          <div className="mt-16 bg-blue-50 border border-blue-200 rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🧠</span>
              </div>
              <h3 className="text-2xl font-medium text-black mb-2">Launchless Insights</h3>
              <p className="text-gray-600">AI analysis to maximize your launch success</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-lg font-medium text-black mb-2">Buyer Type Detection</div>
                <p className="text-sm text-gray-600">Identifies your ideal customer profile and adjusts messaging tone</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-black mb-2">Demand Reality Check</div>
                <p className="text-sm text-gray-600">Honest assessment of market demand with repositioning suggestions</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-black mb-2">Traffic Light System</div>
                <p className="text-sm text-gray-600">Green/yellow/red signals on whether to ship, pivot, or pause</p>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-lg font-medium text-black mb-2">Objection Pre-emption</div>
                <p className="text-sm text-gray-600">Identifies likely objections and weaves responses into your copy</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-black mb-2">Founder Credibility</div>
                <p className="text-sm text-gray-600">Authentic credibility signals that build trust without bragging</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-24 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-black mb-8">Scans real APIs</h2>
          <p className="text-gray-600 mb-12">Live data from platforms where builders share their work</p>
          
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐙</span>
              </div>
              <div className="font-medium mb-1">GitHub</div>
              <div className="text-sm text-gray-500">Recent deploys</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="font-medium mb-1">Reddit</div>
              <div className="text-sm text-gray-500">Launch posts</div>
            </div>
            <div className="text-center opacity-60">
              <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐦</span>
              </div>
              <div className="font-medium mb-1">X (Twitter)</div>
              <div className="text-sm text-gray-500">Rate limited</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light mb-6">
            Find 3 people today who already need your product
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            No dashboards. No subscriptions. No BS.
          </p>
          
          <a
            href="/projects"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start finding signals
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          Built for indie developers who love building but hate marketing
        </p>
      </footer>
    </main>
  );
}
