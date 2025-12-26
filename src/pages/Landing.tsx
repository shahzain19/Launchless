import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white pointer-events-none"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Logo */}
          <div className="mb-12 fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="heading-font text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 fade-in">
            Ship your SaaS.
            <br />
            <span className="gradient-text">We handle the launch.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed fade-in">
            AI generates launch content for all platforms, then finds people who already need your product.
            <br />
            <span className="text-gray-500">Zero marketing experience required.</span>
          </p>

          {/* CTA */}
          <div className="mb-16 fade-in">
            <Link
              to="/projects"
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              Start your launch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 fade-in">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Real APIs
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              No automation
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Personal tool
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="heading-font text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-600">Three steps to launch</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Generate Content</h3>
              <p className="text-gray-600 leading-relaxed">
                AI creates launch content for Product Hunt, Twitter, LinkedIn, and video scripts.
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Find Customers</h3>
              <p className="text-gray-600 leading-relaxed">
                Signal Finder scans GitHub and Reddit to find people who need your product.
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Launch & Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Post your content and reach out to leads with AI-generated conversation starters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Card Preview */}
      <section className="py-20 border-t border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light text-black mb-3">Lead cards, not spam</h2>
            <p className="text-gray-600">See exactly who to contact and what to say</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🐙</span>
                </div>
                <div>
                  <div className="font-medium text-sm">Lead #14</div>
                  <div className="text-xs text-gray-500">GitHub • 2 hours ago</div>
                </div>
              </div>
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                92% confidence
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Signal:</span> Recent deploy + live demo
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Solo maintainer • No launch post found • 12 stars
              </div>
              <div className="text-sm text-black italic leading-relaxed">
                "This looks production-ready. Did you already have a launch post in mind, or is that still on the todo list?"
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Mark contacted
              </button>
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
                Skip
              </button>
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-light text-black mb-3">Everything you need</h2>
            <p className="text-gray-600">Complete launch system in one tool</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Text Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
                <div>
                  <h3 className="font-medium">Launch Content</h3>
                  <p className="text-sm text-gray-600">Ready-to-post copy</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                <div>• Product positioning & hooks</div>
                <div>• Product Hunt description</div>
                <div>• Twitter launch threads</div>
                <div>• LinkedIn posts</div>
                <div>• Follow-up campaigns</div>
              </div>
            </div>

            {/* Video Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎬</span>
                </div>
                <div>
                  <h3 className="font-medium">Video Scripts</h3>
                  <p className="text-sm text-gray-600">Complete production plan</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                <div>• Shot list with timing</div>
                <div>• Teleprompter notes</div>
                <div>• Short-form scripts</div>
                <div>• Long-form scripts</div>
                <div>• Visual direction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light mb-4 text-black">
            Find your first customers today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            No dashboards. No subscriptions. Just results.
          </p>
          
          <a
            href="/projects"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start finding signals
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Built for developers who love building but hate marketing
        </p>
      </footer>
    </main>
  );
}