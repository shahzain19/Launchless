import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LaunchlessInsights from "../components/LaunchlessInsights";
import LaunchlessDemo from "../components/LaunchlessDemo";
import LoadingSpinner from "../components/LoadingSpinner";
import { ToastContainer } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { useOptimistic } from "../hooks/useOptimistic";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { SkeletonForm, SkeletonList } from "../components/SkeletonLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import { apiClient } from "../utils/apiClient";
import type { ApiError } from "../utils/apiClient";

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
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [myRepos, setMyRepos] = useState<Repo[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [mode, setMode] = useState<'text' | 'video'>('text');

    const { toasts, removeToast, success: showSuccess, error: showError, handleError: showErrorWithContext } = useToast();
    const networkStatus = useNetworkStatus();

    // Optimistic updates for better UX
    const optimisticResult = useOptimistic<LaunchResult | null>(null);

    // Memoized validation
    const isFormValid = useMemo(() => {
        return Boolean(github || website || description);
    }, [github, website, description]);

    // Enhanced error handling with context-aware messages
    const handleError = useCallback((error: unknown, context: string) => {
        console.error(`Error in ${context}:`, error);
        
        if (error && typeof error === 'object' && 'status' in error) {
            showErrorWithContext(error as ApiError);
        } else {
            showError(`Failed to ${context}. Please try again.`);
        }
    }, [showError, showErrorWithContext]);

    // Enhanced initialization with better loading states
    useEffect(() => {
        const initializeApp = async () => {
            try {
                setInitialLoading(true);
                
                // Parallel loading for better performance
                const promises = [
                    apiClient.get('/auth/current-user')
                        .then(data => {
                            if (data.authenticated) {
                                setUser(data.user);
                            }
                        })
                        .catch(err => console.warn("Auth check failed:", err))
                ];

                if (projectId) {
                    promises.push(fetchProject());
                }

                await Promise.allSettled(promises);
            } catch (error) {
                handleError(error, 'initialization');
            } finally {
                setInitialLoading(false);
            }
        };

        initializeApp();
    }, [projectId, handleError]);

    const fetchProject = useCallback(async () => {
        if (!projectId) return;
        
        try {
            const projectData = await apiClient.get(`/api/projects/${projectId}`);
            setProject(projectData);
            
            // Pre-fill form with project data
            setGithub(projectData.github || "");
            setWebsite(projectData.website || "");
            setDescription(projectData.description || "");
        } catch (error) {
            handleError(error, 'project fetch');
        }
    }, [projectId, handleError]);

    const fetchMyRepos = useCallback(async () => {
        if (!user) {
            showError("Please log in to access your repositories.");
            return;
        }

        setLoadingRepos(true);
        setError("");
        
        try {
            const data = await apiClient.get('/api/my-repos');
            setMyRepos(data);
        } catch (error) {
            handleError(error, 'repositories fetch');
        } finally {
            setLoadingRepos(false);
        }
    }, [user, handleError, showError]);

    const handleGenerate = useCallback(async () => {
        if (!isFormValid) {
            showError("Please provide at least one input: GitHub URL, website, or description.");
            return;
        }

        if (!networkStatus.isOnline) {
            showError("You're offline. Please check your internet connection.");
            return;
        }

        setError("");
        setSuccess(false);
        setLoading(true);
        
        // Optimistic update - show skeleton immediately
        optimisticResult.updateOptimistic({} as LaunchResult);

        try {
            const data = await apiClient.post('/generate-launch', {
                github,
                website,
                description,
                mode,
                projectId,
            });
            
            // Confirm optimistic update with real data
            optimisticResult.confirmUpdate(data);
            setResult(data);
            showSuccess("Content generated successfully!");
            setSuccess(true);
            
            // Auto-hide success message
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            // Revert optimistic update
            optimisticResult.revertOptimistic(error as Error, null);
            handleError(error, 'content generation');
        } finally {
            setLoading(false);
        }
    }, [isFormValid, networkStatus.isOnline, github, website, description, mode, projectId, 
        optimisticResult, showSuccess, showError, handleError]);

    const handleRegenerate = useCallback(async (
        sectionKey: keyof LaunchResult, 
        currentContent: string, 
        instruction: string
    ) => {
        if (!result || !instruction.trim()) return;

        try {
            const data = await apiClient.post('/regenerate', {
                section: sectionKey,
                currentContent,
                instruction,
                context: { github, website, description }
            });

            if (data.newContent) {
                let contentToSet = data.newContent;
                try {
                    if (typeof result[sectionKey] === 'object') {
                        contentToSet = JSON.parse(data.newContent);
                    }
                } catch (e) {
                    // Use text as-is if JSON parse fails
                }

                setResult(prev => prev ? ({ ...prev, [sectionKey]: contentToSet }) : null);
                showSuccess("Content regenerated successfully!");
            }
        } catch (error) {
            handleError(error, 'content regeneration');
        }
    }, [result, github, website, description, showSuccess, handleError]);

    // Show initial loading skeleton
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-white text-black">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                    <div className="text-center mb-8">
                        <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                        <div className="w-48 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
                    </div>
                    <SkeletonForm />
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-white text-black">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                    {/* Network Status Indicator */}
                    {!networkStatus.isOnline && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-yellow-800 text-sm mb-6 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            You're offline. Some features may not work properly.
                        </div>
                    )}

                    {/* Slow Connection Warning */}
                    {networkStatus.isOnline && networkStatus.isSlowConnection && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-orange-800 text-sm mb-6 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Slow connection detected ({networkStatus.connectionType}). Loading may take longer.
                        </div>
                    )}

                    {/* Retry Indicator - Removed since using apiClient with built-in retry */}

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                            {project && (
                                <>
                                    <button
                                        onClick={() => navigate('/projects')}
                                        className="text-gray-600 hover:text-black text-sm transition-colors"
                                    >
                                        ← Projects
                                    </button>
                                    <span className="text-gray-400 hidden sm:inline">/</span>
                                    <button
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                        className="text-gray-600 hover:text-black text-sm truncate max-w-32 sm:max-w-none transition-colors"
                                    >
                                        {project.name}
                                    </button>
                                    <span className="text-gray-400 hidden sm:inline">/</span>
                                </>
                            )}
                            <h1 className="text-xl sm:text-2xl font-bold text-black">
                                {project ? 'Generate Content' : 'Launchless'}
                            </h1>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">
                            {project ? `Generate launch content for ${project.name}` : 'Founder-grade launch content in seconds'}
                        </p>
                        
                        {/* Auth in top right - mobile friendly */}
                        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                            {user ? (
                                <div className="flex items-center gap-2">
                                    {user.avatarUrl && (
                                        <img src={user.avatarUrl} alt={user.username} className="w-6 h-6 rounded-full" />
                                    )}
                                    <span className="text-sm text-gray-600 hidden sm:inline">{user.username}</span>
                                    <a href="/auth/logout" className="text-xs text-gray-500 hover:text-black transition-colors">
                                        Sign out
                                    </a>
                                </div>
                            ) : (
                                <a
                                    href="/auth/github"
                                    className="text-sm text-gray-600 hover:text-black transition-colors"
                                >
                                    Login
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1 mb-6 max-w-sm mx-auto">
                        <button
                            onClick={() => setMode('text')}
                            className={`flex-1 py-2 px-3 text-sm rounded-md transition-all ${mode === 'text'
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-600 hover:text-black"
                                }`}
                        >
                            Text Launch
                        </button>
                        <button
                            onClick={() => setMode('video')}
                            className={`flex-1 py-2 px-3 text-sm rounded-md transition-all ${mode === 'video'
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-600 hover:text-black"
                                }`}
                        >
                            Video Plan
                        </button>
                    </div>

                    {/* Input Form */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
                        <div className="space-y-4">
                            {/* GitHub Input */}
                            <div>
                                <label className="text-sm text-gray-700 mb-2 block font-medium">GitHub Repository</label>
                                {myRepos.length > 0 ? (
                                    <select
                                        onChange={(e) => {
                                            setGithub(e.target.value);
                                            setMyRepos([]);
                                        }}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                                        />
                                        {user && (
                                            <button
                                                onClick={fetchMyRepos}
                                                disabled={loadingRepos || !networkStatus.isOnline}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {loadingRepos ? <LoadingSpinner size="sm" /> : "My repos"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Website Input */}
                            <div>
                                <label className="text-sm text-gray-700 mb-2 block font-medium">Website (optional)</label>
                                <input
                                    placeholder="https://yourproduct.com"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="text-sm text-gray-700 mb-2 block font-medium">Product Description</label>
                                <textarea
                                    placeholder="What does your product do? What problem does it solve?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                                />
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !isFormValid || !networkStatus.isOnline}
                            className="w-full mt-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
                        
                        {/* Form validation hint */}
                        {!isFormValid && (
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Please provide at least one input to generate content
                            </p>
                        )}
                    </div>

                    {/* Demo Section - Only show when no results */}
                    {!result && !optimisticResult.data && <LaunchlessDemo />}

                    {/* Error Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm mb-6 flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">⚠️</span>
                            <div className="flex-1">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Success Messages */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm mb-6 flex items-center gap-2">
                            <span>✅</span>
                            Content generated successfully!
                        </div>
                    )}

                    {/* Loading Results Skeleton */}
                    {(loading || optimisticResult.isOptimistic) && <SkeletonList count={6} />}

                    {/* Results */}
                    {result && !loading && (
                        <div className="space-y-6">
                            {/* Launchless Insights */}
                            {result.launchless_insights && (
                                <LaunchlessInsights data={result.launchless_insights} />
                            )}

                            {/* Generated Content */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-black border-b border-gray-200 pb-2">Generated Content</h2>

                                {/* Text Mode Results */}
                                {mode === 'text' && (
                                    <>
                                        <EnhancedSection
                                            title="Product Positioning"
                                            text={result.positioning || ''}
                                            onRegenerate={(instr) => handleRegenerate('positioning', result.positioning || '', instr)}
                                        />

                                        <EnhancedSection
                                            title="Core Hook"
                                            text={result.core_hook || ''}
                                            onRegenerate={(instr) => handleRegenerate('core_hook', result.core_hook || '', instr)}
                                        />

                                        <EnhancedSection
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

                                        <EnhancedSection
                                            title="X/Twitter Threads"
                                            text={
                                                Array.isArray(result.x_threads)
                                                    ? result.x_threads.map(t => typeof t === 'string' ? t : JSON.stringify(t)).join("\n\n---\n\n")
                                                    : String(result.x_threads || '')
                                            }
                                            onRegenerate={(instr) => handleRegenerate('x_threads', JSON.stringify(result.x_threads), instr)}
                                        />

                                        <EnhancedSection
                                            title="LinkedIn Post"
                                            text={result.linkedin || ''}
                                            onRegenerate={(instr) => handleRegenerate('linkedin', result.linkedin || '', instr)}
                                        />

                                        <EnhancedSection
                                            title="Follow-up Posts"
                                            text={result.followups?.join("\n\n") || ''}
                                            onRegenerate={(instr) => handleRegenerate('followups', JSON.stringify(result.followups), instr)}
                                        />
                                    </>
                                )}

                                {/* Video Mode Results */}
                                {mode === 'video' && (
                                    <>
                                        <EnhancedShotList
                                            shots={result.shot_list || []}
                                            duration={result.total_estimated_duration || '60s'}
                                            onRegenerate={(instr) => handleRegenerate('shot_list', JSON.stringify(result.shot_list), instr)}
                                        />

                                        <EnhancedSection
                                            title="Teleprompter Notes"
                                            text={
                                                Array.isArray(result.teleprompter)
                                                    ? result.teleprompter.map(b => `• ${b}`).join("\n")
                                                    : (typeof result.teleprompter === 'string' ? result.teleprompter : "No notes generated.")
                                            }
                                            onRegenerate={(instr) => handleRegenerate('teleprompter', JSON.stringify(result.teleprompter), instr)}
                                        />

                                        <EnhancedSection
                                            title="Short-form Script"
                                            text={result.shorts_script || "No script generated."}
                                            onRegenerate={(instr) => handleRegenerate('shorts_script', result.shorts_script || '', instr)}
                                        />

                                        <EnhancedSection
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
        </ErrorBoundary>
    );
}

// Enhanced Section Component with better UX
function EnhancedSection({ title, text, onRegenerate }: { title: string; text: string; onRegenerate?: (instruction: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [instruction, setInstruction] = useState("");
    const [isRegenerating, setIsRegenerating] = useState(false);

    if (!text) return null;

    async function handleRegenerate() {
        if (!instruction.trim() || !onRegenerate) return;
        
        setIsRegenerating(true);
        try {
            await onRegenerate(instruction);
            setIsEditing(false);
            setInstruction("");
        } catch (error) {
            console.error('Regeneration failed:', error);
        } finally {
            setIsRegenerating(false);
        }
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors group">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-black text-sm">{title}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onRegenerate && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isRegenerating}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {isRegenerating ? <LoadingSpinner size="sm" /> : 'Edit'}
                        </button>
                    )}
                    <button
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
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
                        onKeyDown={e => e.key === 'Enter' && !isRegenerating && handleRegenerate()}
                        disabled={isRegenerating}
                        className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleRegenerate}
                        disabled={isRegenerating || !instruction.trim()}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isRegenerating ? <LoadingSpinner size="sm" /> : 'Apply'}
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        disabled={isRegenerating}
                        className="px-2 py-1 text-gray-500 text-xs hover:text-gray-700 disabled:opacity-50 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="text-sm text-black whitespace-pre-wrap leading-relaxed">
                {text}
            </div>
        </div>
    );
}

// Enhanced Shot List Component
function EnhancedShotList({ shots, duration, onRegenerate }: { shots: Shot[]; duration: string; onRegenerate: (instr: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [instruction, setInstruction] = useState("");
    const [isRegenerating, setIsRegenerating] = useState(false);

    async function handleRegenerate() {
        if (!instruction.trim()) return;
        
        setIsRegenerating(true);
        try {
            await onRegenerate(instruction);
            setIsEditing(false);
            setInstruction("");
        } catch (error) {
            console.error('Regeneration failed:', error);
        } finally {
            setIsRegenerating(false);
        }
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors group">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-black text-sm">Shot List ({duration})</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={isRegenerating}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isRegenerating ? <LoadingSpinner size="sm" /> : 'Edit'}
                    </button>
                    <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(shots, null, 2))}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
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
                        onKeyDown={e => e.key === 'Enter' && !isRegenerating && handleRegenerate()}
                        disabled={isRegenerating}
                        className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleRegenerate}
                        disabled={isRegenerating || !instruction.trim()}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isRegenerating ? <LoadingSpinner size="sm" /> : 'Apply'}
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        disabled={isRegenerating}
                        className="px-2 py-1 text-gray-500 text-xs hover:text-gray-700 disabled:opacity-50 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {Array.isArray(shots) && shots.length > 0 ? shots.map((shot, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex flex-col items-center min-w-[50px]">
                            <span className="text-lg font-bold text-gray-600">#{idx + 1}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {shot.duration}
                            </span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="text-xs font-medium text-blue-600 uppercase">
                                {shot.type}
                            </div>
                            <div className="text-sm text-black">{shot.visual}</div>
                            <div className="text-sm text-gray-600 italic">"{shot.audio}"</div>
                        </div>
                    </div>
                )) : (
                    <div className="text-gray-500 text-center py-4">
                        No shots generated.
                    </div>
                )}
            </div>
        </div>
    );
}

