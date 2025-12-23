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
        <h1 className="text-4xl md:text-6xl font-semibold max-w-3xl leading-tight">
          Built for people who hate launching.
        </h1>

        <p className="mt-8 text-lg text-gray-400 max-w-xl leading-relaxed">
          Connect a repo or site. Get a complete launch pack. Post it.
        </p>

        {/* Flow */}
        <div className="mt-12 text-sm text-gray-500">
          GitHub / Website / Text <span className="mx-2">→</span>
          Generate Launch <span className="mx-2">→</span>
          Copy & Ship
        </div>

        {/* CTA */}
        <a
          href="/app"
          className="mt-14 px-7 py-3.5 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition"
        >
          Generate my launch
        </a>
      </div>

      {/* What you get */}
      <section className="max-w-2xl mx-auto text-center py-24 border-t border-white/5">
        <h2 className="text-2xl font-semibold">
          What you get
        </h2>

        <p className="mt-8 text-sm text-gray-400 leading-relaxed">
          • Product positioning<br />
          • Hooks & launch copy<br />
          • Product Hunt draft<br />
          • X & LinkedIn posts<br />
          • Optional recording scripts
        </p>
      </section>

      {/* Who it's for */}
      <section className="max-w-xl mx-auto text-center py-24 border-t border-white/5">
        <p className="text-sm text-gray-400">
          Built for indie devs, solo founders, and small teams shipping real products.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Not for agencies, marketers, or growth hackers.
        </p>
      </section>

      {/* Footer */}
      <footer className="pb-10 text-center text-xs text-gray-600">
        No dashboards. No fluff.
      </footer>
    </main>
  );
}
