export default function Landing() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6">
      <div className="flex flex-col items-center justify-center text-center py-28">

        {/* Logo */}
        <img
          src="/Logo.png"
          alt="Launchless"
          className="w-16 mb-10 opacity-90"
        />

        {/* Hero */}
        <h1 className="text-4xl md:text-6xl font-semibold max-w-4xl leading-tight">
          AI finds people who<br />
          <span className="text-zinc-400">already need your product.</span>
        </h1>

        <p className="mt-8 text-lg text-zinc-400 max-w-2xl leading-relaxed">
          AI Signal Finder scans GitHub, X, and Reddit to surface ranked humans + context. 
          You stay in control—AI does discovery, human does conversation.
        </p>

        {/* Flow */}
        <div className="mt-12 text-sm text-zinc-500 flex items-center gap-4 flex-wrap justify-center">
          <span className="bg-zinc-900 px-3 py-1.5 rounded-lg">Define Product Intent</span>
          <span className="text-zinc-600">→</span>
          <span className="bg-zinc-900 px-3 py-1.5 rounded-lg">AI Scans Platforms</span>
          <span className="text-zinc-600">→</span>
          <span className="bg-zinc-900 px-3 py-1.5 rounded-lg">Get Lead Cards</span>
        </div>

        {/* Key Differentiator */}
        <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg max-w-md">
          <p className="text-sm text-zinc-300 font-medium">The AI does NOT message anyone.</p>
          <p className="text-xs text-zinc-500 mt-1">It only finds signals. You stay in control.</p>
        </div>

        {/* CTA */}
        <a
          href="/projects"
          className="mt-14 px-8 py-4 bg-white text-black text-base font-semibold rounded-lg hover:bg-zinc-200 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
        >
          Find your first signals →
        </a>

        {/* Trust indicator */}
        <p className="mt-6 text-xs text-zinc-600">
          Sign in with GitHub • No automation • No spam
        </p>
      </div>

      {/* Demo Preview - Lead Cards */}
      <section className="max-w-4xl mx-auto py-16 border-t border-white/5">
        <h2 className="text-2xl font-semibold text-center mb-12">
          See what you get: Lead Cards, not DMs
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                🎯 <span>Lead #14</span>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">92% confidence</span>
            </div>
            <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50">
              <div className="text-zinc-300 font-medium mb-2">Platform: GitHub</div>
              <div className="text-zinc-400 mb-2">Signal: Repo pushed 2 days ago + live demo</div>
              <div className="text-zinc-500 text-xs mb-3">Solo maintainer • No launch post found</div>
              <div className="text-zinc-300 italic">"This looks production-ready. Did you already have a launch post in mind?"</div>
              <div className="flex gap-2 mt-3">
                <button className="text-xs bg-white text-black px-3 py-1 rounded">Mark contacted</button>
                <button className="text-xs text-zinc-400 hover:text-zinc-200">Skip</button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                🐦 <span>Lead #7</span>
              </div>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">78% confidence</span>
            </div>
            <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50">
              <div className="text-zinc-300 font-medium mb-2">Platform: X</div>
              <div className="text-zinc-400 mb-2">Signal: "just shipped" + screenshot</div>
              <div className="text-zinc-500 text-xs mb-3">Low engagement • First-time announcement</div>
              <div className="text-zinc-300 italic">"Congrats on shipping! How are you planning to get the word out?"</div>
              <div className="flex gap-2 mt-3">
                <button className="text-xs bg-white text-black px-3 py-1 rounded">Mark contacted</button>
                <button className="text-xs text-zinc-400 hover:text-zinc-200">Save</button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                🔴 <span>Lead #23</span>
              </div>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">85% confidence</span>
            </div>
            <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50">
              <div className="text-zinc-300 font-medium mb-2">Platform: Reddit</div>
              <div className="text-zinc-400 mb-2">Signal: "I built" + feedback request</div>
              <div className="text-zinc-500 text-xs mb-3">Show HN style post • 3 comments</div>
              <div className="text-zinc-300 italic">"This is exactly what I was looking for! Mind if I ask about your tech stack?"</div>
              <div className="flex gap-2 mt-3">
                <button className="text-xs bg-white text-black px-3 py-1 rounded">Mark contacted</button>
                <button className="text-xs text-zinc-400 hover:text-zinc-200">Skip</button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              ⚡ <span>Why This Works</span>
            </div>
            <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50 space-y-2">
              <div>✅ No bans (you're not automating)</div>
              <div>✅ No spam (you choose who to contact)</div>
              <div>✅ High trust (genuine conversations)</div>
              <div>✅ Perfect timing (they just shipped)</div>
              <div>✅ Context provided (you know what to say)</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-zinc-500 mb-6">Find 3 people today who already need your product</p>
          <a
            href="/projects"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Start finding signals →
          </a>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-2xl mx-auto text-center py-24 border-t border-white/5">
        <h2 className="text-2xl font-semibold mb-8">
          Everything you need to launch
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 text-left">
          <div className="space-y-3">
            <div className="text-sm text-gray-300">📍 Product positioning</div>
            <div className="text-sm text-gray-300">🪝 Core hooks & messaging</div>
            <div className="text-sm text-gray-300">🐱 Product Hunt description</div>
            <div className="text-sm text-gray-300">🧵 X launch threads (3 versions)</div>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-300">💼 LinkedIn launch post</div>
            <div className="text-sm text-gray-300">📅 7-day follow-up plan</div>
            <div className="text-sm text-gray-300">📣 Call-to-action copy</div>
            <div className="text-sm text-gray-300">🎬 Video recording scripts</div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-xl mx-auto text-center py-24 border-t border-white/5">
        <p className="text-sm text-gray-400 leading-relaxed">
          Built for indie developers, solo founders, and small teams who love building but hate marketing.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Not for agencies, growth hackers, or people who already love writing launch copy.
        </p>
      </section>

      {/* Footer */}
      <footer className="pb-10 text-center text-xs text-gray-600">
        No dashboards. No subscriptions. No BS.
      </footer>
    </main>
  );
}
