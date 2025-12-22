import { useState, useEffect } from "react";

interface LaunchResult {
  positioning: string;
  core_hook: string;
  product_hunt: string | { headline: string; tagline: string; description: string; makers_comment: string };
  x_threads: (string | object)[];
  linkedin: string;
  followups: string[];
  cta: string;
}

interface User {
  username: string;
  avatarUrl?: string;
}

interface Repo {
  full_name: string;
  html_url: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<LaunchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myRepos, setMyRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/auth/current-user`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Auth check failed", err));
  }, []);

  async function fetchMyRepos() {
    setLoadingRepos(true);
    try {
      const res = await fetch(`${API_URL}/api/my-repos`, { credentials: "include" });
      const data = await res.json();
      setMyRepos(data);
    } catch (err) {
      console.error("Failed to fetch repos", err);
    } finally {
      setLoadingRepos(false);
    }
  }

  async function handleGenerate() {
    if (!github && !website && !description) {
      setError("Add at least one input.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/generate-launch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          github,
          website,
          description,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold">Launch Generator</h1>
          {user ? (
            <div className="flex items-center gap-3">
              {user.avatarUrl && (
                <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full border border-zinc-700" />
              )}
              <div className="text-right">
                <div className="text-sm font-medium">{user.username}</div>
                <a href={`${API_URL}/auth/logout`} className="text-xs text-zinc-500 hover:text-white">Sign out</a>
              </div>
            </div>
          ) : (
            <a
              href={`${API_URL}/auth/github`}
              className="flex items-center gap-2 bg-[#24292e] text-white px-4 py-2 rounded font-medium hover:bg-[#1b1f23] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              Login with GitHub
            </a>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-zinc-400">GitHub URL</label>
              {user && (
                <button
                  onClick={fetchMyRepos}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  {loadingRepos ? "Loading..." : "Select from my repos"}
                </button>
              )}
            </div>

            {myRepos.length > 0 ? (
              <select
                onChange={(e) => {
                  setGithub(e.target.value);
                  setMyRepos([]); // Hide dropdown after selection
                }}
                className="w-full p-2 bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                <option value="">Select a repo...</option>
                {myRepos.map(repo => (
                  <option key={repo.full_name} value={repo.html_url}>{repo.full_name}</option>
                ))}
              </select>
            ) : (
              <input
                placeholder="https://github.com/owner/repo"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full p-2 bg-zinc-900 border border-zinc-800"
              />
            )}
          </div>

          <input
            placeholder="Website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full p-2 bg-zinc-900 border border-zinc-800"
          />

          <textarea
            placeholder="Describe your product in 2–3 sentences"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-zinc-900 border border-zinc-800 h-28"
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 disabled:opacity-50 transition-colors"
        >
          {loading ? "Generating Launch Strategy..." : "Generate Launch Strategy"}
        </button>

        {result && (
          <div className="space-y-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <Section title="🎯 Product Positioning" text={result.positioning} />
            <Section title="🪝 Core Hook" text={result.core_hook} />

            <Section
              title="🐱 Product Hunt Description"
              text={
                typeof result.product_hunt === "string"
                  ? result.product_hunt
                  : `Headline: ${result.product_hunt.headline}\nTagline: ${result.product_hunt.tagline}\n\n${result.product_hunt.description}\n\nMaker's Comment:\n${result.product_hunt.makers_comment}`
              }
            />

            <Section
              title="🧵 X Threads"
              text={
                Array.isArray(result.x_threads)
                  ? result.x_threads.map(t => typeof t === 'string' ? t : JSON.stringify(t)).join("\n\n---\n\n")
                  : String(result.x_threads)
              }
            />

            <Section title="💼 LinkedIn Post" text={result.linkedin} />

            <Section
              title="📅 7-Day Follow-up Plan"
              text={result.followups?.join("\n\n")}
            />

            <Section title="📣 Call to Action" text={result.cta} />
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{title}</h2>
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          className="text-xs text-blue-500 hover:underline"
        >
          Copy
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-sans">
        {text}
      </pre>
    </div>
  );
}
