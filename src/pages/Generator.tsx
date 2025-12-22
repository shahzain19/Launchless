import { useState, useEffect } from "react";

interface Shot {
    type: "Talking Head" | "Screen Record";
    duration: string;
    visual: string;
    audio: string;
}

interface LaunchResult {
    // Text Mode Results
    positioning?: string;
    core_hook?: string;
    product_hunt?: string | { headline: string; tagline: string; description: string; makers_comment: string };
    x_threads?: (string | object)[];
    linkedin?: string;
    followups?: string[];
    cta?: string;

    // Record Mode Results
    shot_list?: Shot[];
    teleprompter?: string[];
    total_estimated_duration?: string;
    shorts_script?: string;
    youtube_script?: string;
}

interface User {
    username: string;
    avatarUrl?: string;
}

interface Repo {
    full_name: string;
    html_url: string;
}

export default function Generator() {
    const [user, setUser] = useState<User | null>(null);
    const [github, setGithub] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [result, setResult] = useState<LaunchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [myRepos, setMyRepos] = useState<Repo[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [mode, setMode] = useState<'text' | 'video'>('text');

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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
                    mode,
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

    async function handleRegenerate(sectionKey: keyof LaunchResult, currentContent: string, instruction: string) {
        if (!result) return;

        try {
            const res = await fetch(`${API_URL}/regenerate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    section: sectionKey,
                    currentContent,
                    instruction,
                    context: { github, website, description }
                })
            });

            const data = await res.json();
            if (data.newContent) {
                let contentToSet = data.newContent;
                try {
                    // Basic attempt to keep JSON structure if needed, though regenerate primarily returns text
                    if (typeof result[sectionKey] === 'object') {
                        contentToSet = JSON.parse(data.newContent);
                    }
                } catch (e) {
                    // Ignore JSON parse error, use text
                }

                setResult(prev => prev ? ({ ...prev, [sectionKey]: contentToSet }) : null);
            }
        } catch (err) {
            console.error("Regeneration failed", err);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header & Auth */}
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

                {/* Mode Toggle */}
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button
                        onClick={() => setMode('text')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'text'
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                            }`}
                    >
                        Text Launch
                    </button>
                    <button
                        onClick={() => setMode('video')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'video'
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                            }`}
                    >
                        Record Mode (Execution)
                    </button>
                </div>

                {/* Inputs */}
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
                    {loading
                        ? "Generating Plan..."
                        : mode === 'video' ? "Generate Recording Plan" : "Generate Launch Strategy"
                    }
                </button>

                {/* Results */}
                {result && (
                    <div className="space-y-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Text Mode Results */}
                        {mode === 'text' && (
                            <>
                                <Section
                                    title="🎯 Product Positioning"
                                    text={result.positioning || ''}
                                    onRegenerate={(instr) => handleRegenerate('positioning', result.positioning || '', instr)}
                                />

                                <Section
                                    title="🪝 Core Hook"
                                    text={result.core_hook || ''}
                                    onRegenerate={(instr) => handleRegenerate('core_hook', result.core_hook || '', instr)}
                                />

                                <Section
                                    title="🐱 Product Hunt Description"
                                    text={
                                        typeof result.product_hunt === "string"
                                            ? result.product_hunt
                                            : result.product_hunt
                                                ? `Headline: ${result.product_hunt.headline}\nTagline: ${result.product_hunt.tagline}\n\n${result.product_hunt.description}\n\nMaker's Comment:\n${result.product_hunt.makers_comment}`
                                                : ''
                                    }
                                    onRegenerate={(instr) => handleRegenerate('product_hunt', JSON.stringify(result.product_hunt), instr)}
                                />

                                <Section
                                    title="🧵 X Threads"
                                    text={
                                        Array.isArray(result.x_threads)
                                            ? result.x_threads.map(t => typeof t === 'string' ? t : JSON.stringify(t)).join("\n\n---\n\n")
                                            : String(result.x_threads || '')
                                    }
                                    onRegenerate={(instr) => handleRegenerate('x_threads', JSON.stringify(result.x_threads), instr)}
                                />

                                <Section
                                    title="💼 LinkedIn Post"
                                    text={result.linkedin || ''}
                                    onRegenerate={(instr) => handleRegenerate('linkedin', result.linkedin || '', instr)}
                                />

                                <Section
                                    title="📅 7-Day Follow-up Plan"
                                    text={result.followups?.join("\n\n") || ''}
                                    onRegenerate={(instr) => handleRegenerate('followups', JSON.stringify(result.followups), instr)}
                                />

                                <Section
                                    title="📣 Call to Action"
                                    text={result.cta || ''}
                                    onRegenerate={(instr) => handleRegenerate('cta', result.cta || '', instr)}
                                />
                            </>
                        )}

                        {/* Record Mode Results */}
                        {mode === 'video' && (
                            <>
                                {/* SHOT LIST RENDERER */}
                                <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-semibold text-white">1️⃣ Shot List ({result.total_estimated_duration || '60s'})</h2>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(JSON.stringify(result.shot_list, null, 2))}
                                            className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                                        >
                                            Copy JSON
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {result.shot_list?.map((shot, idx) => (
                                            <div key={idx} className="flex gap-4 p-3 bg-zinc-950/50 rounded border border-zinc-800">
                                                <div className="flex flex-col items-center min-w-[60px] pt-1">
                                                    <span className="text-xl font-bold text-zinc-600">#{idx + 1}</span>
                                                    <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded mt-1 border border-zinc-800">
                                                        {shot.duration}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${shot.type.includes('Head') ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'
                                                            }`}>
                                                            {shot.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-zinc-300 font-medium">👁️ {shot.visual}</p>
                                                    <p className="text-sm text-zinc-400 italic">🗣️ "{shot.audio}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* TELEPROMPTER RENDERER */}
                                <Section
                                    title="2️⃣ Teleprompter Bullets"
                                    text={
                                        Array.isArray(result.teleprompter)
                                            ? result.teleprompter.map(b => `• ${b}`).join("\n\n")
                                            : (typeof result.teleprompter === 'string' ? result.teleprompter : "No bullets generated.")
                                    }
                                    onRegenerate={(instr) => handleRegenerate('teleprompter', JSON.stringify(result.teleprompter), instr)}
                                />

                                {/* SCRIPTS RENDERER */}
                                <div className="mt-8 pt-8 border-t border-zinc-800">
                                    <h2 className="text-zinc-500 text-sm font-semibold mb-4 uppercase tracking-wider">Reference Scripts</h2>

                                    <Section
                                        title="📱 60s TikTok/Reels Script"
                                        text={result.shorts_script || "No script generated."}
                                        onRegenerate={(instr) => handleRegenerate('shorts_script', result.shorts_script || '', instr)}
                                    />

                                    <Section
                                        title="📺 3-5 Min YouTube Script"
                                        text={result.youtube_script || "No script generated."}
                                        onRegenerate={(instr) => handleRegenerate('youtube_script', result.youtube_script || '', instr)}
                                    />
                                </div>

                            </>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

function Section({ title, text, onRegenerate }: { title: string; text: string; onRegenerate?: (instruction: string) => void }) {
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [instruction, setInstruction] = useState("");
    const [loading, setLoading] = useState(false);

    if (!text) return null;

    function handleSubmit() {
        if (!instruction.trim() || !onRegenerate) return;
        setLoading(true);
        onRegenerate(instruction);
        setLoading(false);
        setIsRegenerating(false);
        setInstruction("");
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-2 group">
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-zinc-200">{title}</h2>
                <div className="flex gap-2">

                    {/* Regenerate Trigger */}
                    {onRegenerate && !isRegenerating && (
                        <button
                            onClick={() => setIsRegenerating(true)}
                            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                        >
                            Refine
                        </button>
                    )}

                    <button
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        Copy
                    </button>
                </div>
            </div>

            {isRegenerating && (
                <div className="flex gap-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                        autoFocus
                        className="flex-1 bg-zinc-800 border-zinc-700 text-xs p-1.5 rounded text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                        placeholder="Ex: Make it shorter, add more humor..."
                        value={instruction}
                        onChange={e => setInstruction(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-zinc-100 text-black text-xs px-3 py-1.5 rounded font-medium hover:bg-zinc-200"
                    >
                        {loading ? "..." : "Go"}
                    </button>
                    <button
                        onClick={() => setIsRegenerating(false)}
                        className="text-zinc-500 text-xs px-2 hover:text-zinc-300"
                    >
                        ✕
                    </button>
                </div>
            )}

            <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-sans leading-relaxed">
                {text}
            </pre>
        </div>
    );
}
