export default function Landing() {
  return (
    <main className="min-h-screen bg-black text-white px-6">
      <div className="flex flex-col items-center justify-center text-center py-28">

        {/* Logo */}
        <img
          src="/Logo.png"
          alt="Launch Generator"
          className="w-16 mb-10 opacity-90"
        />

        {/* Hero */}
        <h1 className="text-4xl md:text-6xl font-semibold max-w-4xl leading-tight">
          Ship your Product.<br />
          <span className="text-gray-400">We handle the launch.</span>
        </h1>

        <p className="mt-8 text-lg text-gray-400 max-w-2xl leading-relaxed">
          Connect your GitHub repo, paste a URL, or describe your product. Get instant marketing copy that actually converts—no prompting, no fluff.
        </p>

        {/* Flow */}
        <div className="mt-12 text-sm text-gray-500 flex items-center gap-4">
          <span className="bg-gray-900 px-3 py-1.5 rounded-lg">GitHub / Website / Text</span>
          <span className="text-gray-600">→</span>
          <span className="bg-gray-900 px-3 py-1.5 rounded-lg">AI Generate</span>
          <span className="text-gray-600">→</span>
          <span className="bg-gray-900 px-3 py-1.5 rounded-lg">Copy & Ship</span>
        </div>

        {/* CTA */}
        <a
          href="/app"
          className="mt-14 px-8 py-4 bg-white text-black text-base font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
        >
          Generate my launch →
        </a>

        {/* Trust indicator */}
        <p className="mt-6 text-xs text-gray-600">
          No signup required • Takes 30 seconds
        </p>
      </div>

      {/* Demo Preview */}
      <section className="max-w-4xl mx-auto py-16 border-t border-white/5">
        <h2 className="text-2xl font-semibold text-center mb-12">
          See what you get
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              🎯 <span>Product Positioning</span>
            </div>
            <div className="text-sm text-gray-400 leading-relaxed bg-gray-950/50 p-4 rounded-lg border border-gray-800/50">
              "TaskFlow is the project management tool for developers who hate project management. Skip the meetings, skip the overhead—just ship faster."
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              🧵 <span>X Launch Thread</span>
            </div>
            <div className="text-sm text-gray-400 leading-relaxed bg-gray-950/50 p-4 rounded-lg border border-gray-800/50">
              "1/7 I built TaskFlow because I was tired of spending more time in Slack than in my code editor.

              Here's how it works..."
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              🐱 <span>Product Hunt</span>
            </div>
            <div className="text-sm text-gray-400 leading-relaxed bg-gray-950/50 p-4 rounded-lg border border-gray-800/50">
              "Project management for developers who code more than they meet. TaskFlow integrates with GitHub, tracks what matters, and stays out of your way."
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              💼 <span>LinkedIn Post</span>
            </div>
            <div className="text-sm text-gray-400 leading-relaxed bg-gray-950/50 p-4 rounded-lg border border-gray-800/50">
              "After 5 years of wrestling with project management tools that felt like they were built for MBAs, I built TaskFlow..."
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-6">Plus 7-day follow-up plan, call-to-action copy, and more</p>
          <a
            href="/app"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Try it with your product →
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
