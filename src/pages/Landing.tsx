export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      
      {/* Headline */}
      <h1 className="text-4xl md:text-6xl font-semibold text-center max-w-3xl">
        Built for people who hate launching.
      </h1>

      {/* Subtext */}
      <p className="mt-6 text-lg text-gray-400 text-center max-w-xl">
        Connect a repo or site. Get a complete launch pack. Post it.
      </p>

      {/* Flow */}
      <div className="mt-10 text-sm text-gray-500 text-center">
        GitHub / Website / Text <span className="mx-2">→</span>
        Generate Launch <span className="mx-2">→</span>
        Copy & Ship
      </div>

      {/* CTA */}
      <a
        href="/app"
        className="mt-10 px-6 py-3 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition"
      >
        Generate my launch
      </a>

      {/* Footer */}
      <footer className="absolute bottom-6 text-xs text-gray-600">
        No dashboards. No fluff.
      </footer>
    </main>
  );
}
