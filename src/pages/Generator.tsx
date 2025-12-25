import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LaunchlessInsights from "../components/LaunchlessInsights";
import LaunchlessDemo from "../components/LaunchlessDemo";
import LoadingSpinner from "../components/LoadingSpinner";
import { ToastContainer } from "../components/Toast";
import { useToast } from "../hooks/useToast";

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

    // Launchless Insights
    launchless_insights?: any;
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
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const projectId = searchParams.get('projectId');
    
    const [user, setUser] = useState<User | null>(null);
    const [project, setProject] = useState<any>(null);
    const [github, setGithub] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [result, setResult] = useState<LaunchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [myRepos, setMyRepos] = useState<Repo[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [mode, setMode] = useState<'text' | 'video'>('text');

    const { toasts, removeToast, success: showSuccess, error: showError } = useToast();
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

        // If projectId is provided, fetch project details
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    async function fetchProject() {
        if (!projectId) return;
        
        try {
            const res = await fetch(`${API_URL}/api/projects/${projectId}`, { credentials: "include" });
            if (res.ok) {
                const projectData = await res.json();
                setProject(projectData);
                // Pre-fill form with project data
                setGithub(projectData.github || "");
                setWebsite(projectData.website || "");
                setDescription(projectData.description || "");
            }
        } catch (err) {
            console.error("Failed to fetch project", err);
        }
    }

    async function fetchMyRepos() {
        setLoadingRepos(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}/api/my-repos`, { credentials: "include" });
            
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Please log in with GitHub to access your repositories.");
                }
                throw new Error("Failed to fetch repositories. Please try again.");
            }
            
            const data = await res.json();
            setMyRepos(data);
        } catch (err) {
            console.error("Failed to fetch repos", err);
            setError(err instanceof Error ? err.message : "Failed to fetch repositories.");
        } finally {
            setLoadingRepos(false);
        }
    }

    async function handleGenerate() {
        if (!github && !website && !description) {
            showError("Please provide at least one input: GitHub URL, website, or description.");
            return;
        }

        setError("");
        setSuccess(false);
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
                    projectId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Server error: ${res.status}`);
            }

            setResult(data);
            showSuccess("Content generated successfully!");
            setSuccess(true);
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Generation failed:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to generate launch content. Please try again.";
            showError(errorMessage);
            setError(errorMessage);
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

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to regenerate content");
            }

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
            const errorMessage = err instanceof Error ? err.message : "Failed to regenerate content. Please try again.";
            showError(errorMessage);
            setError(errorMessage);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

                {/* Simplified Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                        {project && (
                            <>
                                <button
                                    onClick={() => navigate('/projects')}
                                    className="text-zinc-400 hover:text-zinc-200 text-sm"
                                >
                                    ← Projects
                                </button>
                                <span className="text-zinc-600 hidden sm:inline">/</span>
                                <button
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="text-zinc-400 hover:text-zinc-200 text-sm truncate max-w-32 sm:max-w-none"
                                >
                                    {project.name}
                                </button>
                                <span className="text-zinc-600 hidden sm:inline">/</span>
                            </>
                        )}
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            {project ? 'Generate Content' : 'Launchless'}
                        </h1>
                    </div>
                    <p className="text-zinc-400 text-sm sm:text-base">
                        {project ? `Generate launch content for ${project.name}` : 'Founder-grade launch content in seconds'}
                    </p>
                    
                    {/* Auth in top right - mobile friendly */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                        {user ? (
                            <div className="flex items-center gap-2">
                                {user.avatarUrl && (
                                    <img src={user.avatarUrl} alt={user.username} className="w-6 h-6 rounded-full" />
                                )}
                                <span className="text-sm text-zinc-400 hidden sm:inline">{user.username}</span>
                                <a href={`${API_URL}/auth/logout`} className="text-xs text-zinc-500 hover:text-white">
                                    Sign out
                                </a>
                            </div>
                        ) : (
                            <a
                                href={`${API_URL}/auth/github`}
                                className="text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                Login
                            </a>
                        )}
                    </div>
                </div>

                {/* Simplified Mode Toggle */}
                <div className="flex bg-zinc-900 rounded-lg p-1 mb-6 max-w-sm mx-auto">
                    <button
                        onClick={() => setMode('text')}
                        className={`flex-1 py-2 px-3 text-sm rounded-md transition-all ${mode === 'text'
                            ? "bg-white text-black font-medium"
                            : "text-zinc-400 hover:text-zinc-200"
                            }`}
                    >
                        Text Launch
                    </button>
                    <button
                        onClick={() => setMode('video')}
                        className={`flex-1 py-2 px-3 text-sm rounded-md transition-all ${mode === 'video'
                            ? "bg-white text-black font-medium"
                            : "text-zinc-400 hover:text-zinc-200"
                            }`}
                    >
                        Video Plan
                    </button>
                </div>

                {/* Simplified Input Form */}
                <div className="bg-zinc-900 p-4 sm:p-6 mb-6 border border-zinc-800">
                    <div className="space-y-4">
                        {/* GitHub Input */}
                        <div>
                            <label className="text-sm text-zinc-300 mb-2 block">GitHub Repository</label>
                            {myRepos.length > 0 ? (
                                <select
                                    onChange={(e) => {
                                        setGithub(e.target.value);
                                        setMyRepos([]);
                                    }}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                                >
                                    <option value="">Select a repo...</option>
                                    {myRepos.map(repo => (
                                        <option key={repo.full_name} value={repo.html_url}>{repo.full_name}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="relative">
                                    <input
                                        placeholder="https://github.com/owner/repo"
                                        value={github}
                                        onChange={(e) => setGithub(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 pr-16"
                                    />
                                    {user && (
                                        <button
                                            onClick={fetchMyRepos}
                                            disabled={loadingRepos}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                                        >
                                            {loadingRepos ? <LoadingSpinner size="sm" /> : "My repos"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Website Input */}
                        <div>
                            <label className="text-sm text-zinc-300 mb-2 block">Website (optional)</label>
                            <input
                                placeholder="https://yourproduct.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                            />
                        </div>

                        {/* Description Input */}
                        <div>
                            <label className="text-sm text-zinc-300 mb-2 block">Product Description</label>
                            <textarea
                                placeholder="What does your product do? What problem does it solve?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 h-20 resize-none"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading || (!github && !website && !description)}
                        className="w-full mt-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Generating...
                            </>
                        ) : (
                            `Generate ${mode === 'video' ? 'Video Plan' : 'Launch Content'}`
                        )}
                    </button>
                </div>

                {/* Demo Section - Only show when no results */}
                {!result && <LaunchlessDemo />}

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm mb-6">
                        ✅ Content generated successfully!
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="space-y-6">
                        {/* Launchless Insights - Prominent placement */}
                        {result.launchless_insights && (
                            <LaunchlessInsights data={result.launchless_insights} />
                        )}

                        {/* Generated Content */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium text-zinc-200 border-b border-zinc-800 pb-2">Generated Content</h2>

                            {/* Text Mode Results */}
                            {mode === 'text' && (
                                <>
                                    <SimpleSection
                                        title="Product Positioning"
                                        text={result.positioning || ''}
                                        onRegenerate={(instr) => handleRegenerate('positioning', result.positioning || '', instr)}
                                    />

                                    <SimpleSection
                                        title="Core Hook"
                                        text={result.core_hook || ''}
                                        onRegenerate={(instr) => handleRegenerate('core_hook', result.core_hook || '', instr)}
                                    />

                                    <SimpleSection
                                        title="Product Hunt"
                                        text={
                                            typeof result.product_hunt === "string"
                                                ? result.product_hunt
                                                : result.product_hunt
                                                    ? `${result.product_hunt.headline}\n${result.product_hunt.tagline}\n\n${result.product_hunt.description}\n\n${result.product_hunt.makers_comment}`
                                                    : ''
                                        }
                                        onRegenerate={(instr) => handleRegenerate('product_hunt', JSON.stringify(result.product_hunt), instr)}
                                    />

                                    <SimpleSection
                                        title="X/Twitter Threads"
                                        text={
                                            Array.isArray(result.x_threads)
                                                ? result.x_threads.map(t => typeof t === 'string' ? t : JSON.stringify(t)).join("\n\n---\n\n")
                                                : String(result.x_threads || '')
                                        }
                                        onRegenerate={(instr) => handleRegenerate('x_threads', JSON.stringify(result.x_threads), instr)}
                                    />

                                    <SimpleSection
                                        title="LinkedIn Post"
                                        text={result.linkedin || ''}
                                        onRegenerate={(instr) => handleRegenerate('linkedin', result.linkedin || '', instr)}
                                    />

                                    <SimpleSection
                                        title="Follow-up Posts"
                                        text={result.followups?.join("\n\n") || ''}
                                        onRegenerate={(instr) => handleRegenerate('followups', JSON.stringify(result.followups), instr)}
                                    />
                                </>
                            )}

                            {/* Video Mode Results */}
                            {mode === 'video' && (
                                <>
                                    <SimpleShotList
                                        shots={result.shot_list || []}
                                        duration={result.total_estimated_duration || '60s'}
                                        onRegenerate={(instr) => handleRegenerate('shot_list', JSON.stringify(result.shot_list), instr)}
                                    />

                                    <SimpleSection
                                        title="Teleprompter Notes"
                                        text={
                                            Array.isArray(result.teleprompter)
                                                ? result.teleprompter.map(b => `• ${b}`).join("\n")
                                                : (typeof result.teleprompter === 'string' ? result.teleprompter : "No notes generated.")
                                        }
                                        onRegenerate={(instr) => handleRegenerate('teleprompter', JSON.stringify(result.teleprompter), instr)}
                                    />

                                    <SimpleSection
                                        title="Short-form Script"
                                        text={result.shorts_script || "No script generated."}
                                        onRegenerate={(instr) => handleRegenerate('shorts_script', result.shorts_script || '', instr)}
                                    />

                                    <SimpleSection
                                        title="Long-form Script"
                                        text={result.youtube_script || "No script generated."}
                                        onRegenerate={(instr) => handleRegenerate('youtube_script', result.youtube_script || '', instr)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}

// Simplified Section Component
function SimpleSection({ title, text, onRegenerate }: { title: string; text: string; onRegenerate?: (instruction: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [instruction, setInstruction] = useState("");

    if (!text) return null;

    function handleRegenerate() {
        if (!instruction.trim() || !onRegenerate) return;
        onRegenerate(instruction);
        setIsEditing(false);
        setInstruction("");
    }

    return (
        <div className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800/50 hover:border-zinc-700/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-zinc-200 text-sm">{title}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onRegenerate && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded hover:bg-zinc-800/50"
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded hover:bg-zinc-800/50"
                    >
                        Copy
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="flex gap-2 mb-3">
                    <input
                        autoFocus
                        placeholder="How should this be changed?"
                        value={instruction}
                        onChange={e => setInstruction(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleRegenerate()}
                        className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                    />
                    <button
                        onClick={handleRegenerate}
                        className="px-3 py-1 bg-white text-black text-xs rounded font-medium hover:bg-zinc-200"
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-2 py-1 text-zinc-400 text-xs hover:text-zinc-200"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {text}
            </div>
        </div>
    );
}

// Simplified Shot List Component
function SimpleShotList({ shots, duration, onRegenerate }: { shots: Shot[]; duration: string; onRegenerate: (instr: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [instruction, setInstruction] = useState("");

    function handleRegenerate() {
        if (!instruction.trim()) return;
        onRegenerate(instruction);
        setIsEditing(false);
        setInstruction("");
    }

    return (
        <div className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800/50 hover:border-zinc-700/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-zinc-200 text-sm">Shot List ({duration})</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded hover:bg-zinc-800/50"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(shots, null, 2))}
                        className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded hover:bg-zinc-800/50"
                    >
                        Copy
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="flex gap-2 mb-3">
                    <input
                        autoFocus
                        placeholder="How should the shots be changed?"
                        value={instruction}
                        onChange={e => setInstruction(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleRegenerate()}
                        className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                    />
                    <button
                        onClick={handleRegenerate}
                        className="px-3 py-1 bg-white text-black text-xs rounded font-medium hover:bg-zinc-200"
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-2 py-1 text-zinc-400 text-xs hover:text-zinc-200"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {Array.isArray(shots) && shots.length > 0 ? shots.map((shot, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-zinc-950/50 rounded border border-zinc-800/50">
                        <div className="flex flex-col items-center min-w-[50px]">
                            <span className="text-lg font-bold text-zinc-500">#{idx + 1}</span>
                            <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                                {shot.duration}
                            </span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="text-xs font-medium text-zinc-400 uppercase">
                                {shot.type}
                            </div>
                            <div className="text-sm text-zinc-200">{shot.visual}</div>
                            <div className="text-sm text-zinc-400 italic">"{shot.audio}"</div>
                        </div>
                    </div>
                )) : (
                    <div className="text-zinc-500 text-center py-4">
                        No shots generated.
                    </div>
                )}
            </div>
        </div>
    );
}