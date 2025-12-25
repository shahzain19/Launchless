import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LaunchlessInsights from "../components/LaunchlessInsights";
import SignalFinder from "../components/SignalFinder";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";

interface Project {
    id: number;
    name: string;
    description: string;
    github: string;
    website: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface Generation {
    id: number;
    type: string;
    content: {
        // Text mode content
        positioning?: string;
        core_hook?: string;
        product_hunt?: string | { headline: string; tagline: string; description: string; makers_comment: string };
        x_threads?: (string | object)[];
        linkedin?: string;
        followups?: string[];
        cta?: string;
        
        // Video mode content
        shot_list?: Array<{
            type: "Talking Head" | "Screen Record";
            duration: string;
            visual: string;
            audio: string;
        }>;
        teleprompter?: string[];
        total_estimated_duration?: string;
        shorts_script?: string;
        youtube_script?: string;
    };
    launchlessInsights: any;
    createdAt: string;
}

interface Post {
    id: number;
    platform: string;
    title: string;
    content: string;
    status: string;
    createdAt: string;
}

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'generations' | 'posts' | 'scripts' | 'signals'>('overview');
    const [loading, setLoading] = useState(true);
    const [statusDialog, setStatusDialog] = useState(false);
    const [showPostGenerator, setShowPostGenerator] = useState(false);
    const [generatingPosts, setGeneratingPosts] = useState(false);
    const [scripts, setScripts] = useState<any[]>([]);

    const { toasts, removeToast, error, success } = useToast();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    useEffect(() => {
        if (id) {
            fetchProject();
            fetchGenerations();
            fetchPosts();
            fetchScripts();
        }
    }, [id]);

    async function fetchProject() {
        if (!id) {
            error("No project ID provided");
            setLoading(false);
            return;
        }

        try {
            console.log(`Fetching project with ID: ${id}`);
            const res = await fetch(`${API_URL}/api/projects/${id}`, { credentials: "include" });
            
            console.log(`Response status: ${res.status}`);
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("API Error:", errorData);
                throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
            }
            
            const data = await res.json();
            console.log("Project data received:", data);
            
            const projectData = data.success ? data.data : data;
            if (!projectData) {
                throw new Error("No project data received");
            }
            
            setProject(projectData);
        } catch (err) {
            console.error("Failed to fetch project", err);
            error(err instanceof Error ? err.message : "Failed to load project details");
        } finally {
            setLoading(false);
        }
    }

    async function fetchGenerations() {
        if (!id) return;
        
        try {
            const res = await fetch(`${API_URL}/api/projects/${id}/generations`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setGenerations(data.success ? data.data : data);
            } else {
                console.warn("Failed to fetch generations:", res.status);
            }
        } catch (err) {
            console.error("Failed to fetch generations", err);
            // Don't show error for generations as it's not critical
        }
    }

    async function fetchPosts() {
        if (!id) return;
        
        try {
            const res = await fetch(`${API_URL}/api/projects/${id}/posts`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setPosts(data.success ? data.data : data);
            } else {
                console.warn("Failed to fetch posts:", res.status);
            }
        } catch (err) {
            console.error("Failed to fetch posts", err);
            // Don't show error for posts as it's not critical
        }
    }

    async function duplicateProject() {
        if (!project) return;
        
        try {
            const duplicatedProject = {
                name: `${project.name} (Copy)`,
                description: project.description,
                github: project.github,
                website: project.website
            };

            const res = await fetch(`${API_URL}/api/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(duplicatedProject)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to duplicate project");
            }

            success("Project duplicated successfully!");
        } catch (err) {
            console.error("Failed to duplicate project", err);
            error("Failed to duplicate project. Please try again.");
        }
    }

    async function updateProjectStatus(newStatus: string) {
        if (!project) return;
        
        try {
            const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...project, status: newStatus })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to update project status");
            }

            const data = await res.json();
            const updatedProject = data.success ? data.data : data;
            
            setProject(updatedProject);
            setStatusDialog(false);
            success(`Project status updated to ${newStatus}`);
        } catch (err) {
            console.error("Failed to update project status", err);
            error("Failed to update project status. Please try again.");
        }
    }

    async function fetchScripts() {
        if (!id) return;
        
        try {
            // For now, extract scripts from generations
            const res = await fetch(`${API_URL}/api/projects/${id}/generations`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                const generationsData = data.success ? data.data : data;
                
                const extractedScripts = generationsData
                    .filter((gen: Generation) => gen.type === 'video' && gen.content)
                    .map((gen: Generation) => ({
                        id: gen.id,
                        createdAt: gen.createdAt,
                        type: gen.type,
                        shorts_script: gen.content.shorts_script,
                        youtube_script: gen.content.youtube_script,
                        teleprompter: gen.content.teleprompter,
                        shot_list: gen.content.shot_list
                    }))
                    .filter((script: any) => script.shorts_script || script.youtube_script);
                
                setScripts(extractedScripts);
            }
        } catch (err) {
            console.error("Failed to fetch scripts", err);
        }
    }

    async function generatePostsFromContent() {
        if (!project || !id) return;
        
        setGeneratingPosts(true);
        try {
            // Use the latest generation to create posts
            if (generations.length === 0) {
                error("No content generations found. Generate content first.");
                return;
            }

            const latestGeneration = generations[0];
            const res = await fetch(`${API_URL}/api/projects/${id}/generate-posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    generationId: latestGeneration.id,
                    platforms: ['twitter', 'linkedin', 'facebook', 'instagram']
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to generate posts");
            }

            const data = await res.json();
            const newPosts = data.success ? data.data : data;
            
            setPosts([...newPosts, ...posts]);
            setShowPostGenerator(false);
            success(`Generated ${newPosts.length} posts successfully!`);
        } catch (err) {
            console.error("Failed to generate posts", err);
            error("Failed to generate posts. Please try again.");
        } finally {
            setGeneratingPosts(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-black flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <div className="text-gray-600">Loading project...</div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-white text-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-600 mb-4">Project not found</div>
                    <Link to="/projects" className="text-blue-600 hover:text-blue-700">
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link to="/projects" className="text-gray-600 hover:text-black">
                                ← Projects
                            </Link>
                            <span className="text-gray-400">/</span>
                            <h1 className="text-2xl font-bold text-black">{project.name}</h1>
                        </div>
                        {project.description && (
                            <p className="text-gray-600">{project.description}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={duplicateProject}
                            className="px-3 py-2 text-sm text-gray-600 hover:text-black border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                        >
                            Duplicate
                        </button>
                        <Link
                            to={`/generate?projectId=${project.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Generate Content
                        </Link>
                        <button
                            onClick={() => setStatusDialog(true)}
                            className={`px-3 py-1 text-sm rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                                project.status === 'published' ? 'bg-green-100 text-green-700' :
                                project.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {project.status}
                        </button>
                    </div>
                </div>

                {/* Project Info */}
                <div className="bg-gray-50 border border-gray-200 p-6 mb-8 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">GitHub Repository</div>
                            {project.github ? (
                                <a 
                                    href={project.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    {project.github.replace('https://github.com/', '')}
                                </a>
                            ) : (
                                <span className="text-gray-500 text-sm">Not set</span>
                            )}
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Website</div>
                            {project.website ? (
                                <a 
                                    href={project.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    {project.website}
                                </a>
                            ) : (
                                <span className="text-gray-500 text-sm">Not set</span>
                            )}
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                            <span className="text-black text-sm">
                                {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                            activeTab === 'overview'
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-600 hover:text-black"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('signals')}
                        className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                            activeTab === 'signals'
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-600 hover:text-black"
                        }`}
                    >
                        Signal Finder
                    </button>
                    <button
                        onClick={() => setActiveTab('generations')}
                        className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                            activeTab === 'generations'
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-600 hover:text-black"
                        }`}
                    >
                        Generations ({generations.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                            activeTab === 'posts'
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-600 hover:text-black"
                        }`}
                    >
                        Posts ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('scripts')}
                        className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                            activeTab === 'scripts'
                                ? "bg-blue-600 text-white font-medium"
                                : "text-gray-600 hover:text-black"
                        }`}
                    >
                        Scripts ({scripts.length})
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                                <div className="text-2xl font-bold text-black mb-1">{generations.length}</div>
                                <div className="text-sm text-gray-600">Content Generations</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                                <div className="text-2xl font-bold text-black mb-1">{posts.length}</div>
                                <div className="text-sm text-gray-600">Posts Created</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                                <div className="text-2xl font-bold text-black mb-1">
                                    {posts.filter(p => p.status === 'published').length}
                                </div>
                                <div className="text-sm text-gray-600">Posts Published</div>
                            </div>
                        </div>

                        {generations.length > 0 && (
                            <div>
                                <h2 className="text-lg font-medium text-black mb-4">Latest Generation</h2>
                                <GenerationCard generation={generations[0]} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'signals' && (
                    <SignalFinder projectId={id!} />
                )}

                {activeTab === 'generations' && (
                    <div className="space-y-4">
                        {generations.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-600 mb-4">No content generated yet</div>
                                <Link
                                    to={`/generate?projectId=${project.id}`}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Generate your first content →
                                </Link>
                            </div>
                        ) : (
                            generations.map((generation) => (
                                <GenerationCard key={generation.id} generation={generation} />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {/* Posts Header with Generate Button */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-black">Posts</h2>
                            <div className="flex items-center gap-3">
                                {generations.length > 0 && (
                                    <button
                                        onClick={() => setShowPostGenerator(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Generate Posts
                                    </button>
                                )}
                            </div>
                        </div>

                        {posts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-600 mb-4">No posts created yet</div>
                                {generations.length > 0 ? (
                                    <button
                                        onClick={() => setShowPostGenerator(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Generate Posts from Content
                                    </button>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        Generate content first, then create posts from it
                                    </div>
                                )}
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                                {post.platform}
                                            </span>
                                            {post.title && (
                                                <span className="font-medium text-black">{post.title}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(post.content)}
                                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                            >
                                                Copy
                                            </button>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                post.status === 'published' ? 'bg-green-100 text-green-700' :
                                                post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {post.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-black whitespace-pre-wrap">
                                        {post.content.length > 200 
                                            ? `${post.content.substring(0, 200)}...` 
                                            : post.content
                                        }
                                    </div>
                                    <div className="text-xs text-gray-500 mt-3">
                                        Created {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'scripts' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-black flex items-center gap-2">
                                🎬 Video Scripts & Production
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    {scripts.length} script{scripts.length !== 1 ? 's' : ''} available
                                </span>
                                {scripts.length === 0 && (
                                    <Link
                                        to={`/generate?projectId=${project.id}&mode=video`}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        Generate Video Content
                                    </Link>
                                )}
                            </div>
                        </div>

                        {scripts.length === 0 ? (
                            <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                                <div className="text-6xl mb-4">🎬</div>
                                <div className="text-xl font-medium text-gray-900 mb-2">Ready to create video content?</div>
                                <div className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Generate professional video scripts, shot lists, and teleprompter notes for your product launch.
                                </div>
                                <div className="space-y-3">
                                    <Link
                                        to={`/generate?projectId=${project.id}&mode=video`}
                                        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        🎥 Generate Video Scripts
                                    </Link>
                                    <div className="text-sm text-gray-500">
                                        Creates shot lists, scripts, and teleprompter notes
                                    </div>
                                </div>
                            </div>
                        ) : (
                            scripts.map((script) => (
                                <div key={script.id} className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 bg-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(script.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                                    🎬 Video Production Plan
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        const exportData = {
                                                            project: project.name,
                                                            generated: script.createdAt,
                                                            shot_list: script.shot_list,
                                                            scripts: {
                                                                shorts: script.shorts_script,
                                                                youtube: script.youtube_script
                                                            },
                                                            teleprompter: script.teleprompter
                                                        };
                                                        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `${project.name}-video-plan.json`;
                                                        a.click();
                                                        URL.revokeObjectURL(url);
                                                    }}
                                                    className="text-xs text-purple-600 hover:text-purple-700 px-2 py-1 rounded-md hover:bg-purple-50 transition-colors"
                                                >
                                                    📤 Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 space-y-6">
                                        {/* Production Overview */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <h4 className="font-medium text-black mb-3 flex items-center gap-2">
                                                📊 Production Overview
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-purple-600">
                                                        {script.shot_list?.length || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Shots</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {script.shot_list?.reduce((acc: number, shot: any) => {
                                                            const seconds = parseInt(shot.duration?.replace(/[^0-9]/g, '') || '0');
                                                            return acc + seconds;
                                                        }, 0) || 0}s
                                                    </div>
                                                    <div className="text-xs text-gray-600">Duration</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-green-600">
                                                        {script.shot_list?.filter((s: any) => s.type === 'Talking Head').length || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Face Cam</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-orange-600">
                                                        {script.shot_list?.filter((s: any) => s.type === 'Screen Record').length || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Screen</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shot List */}
                                        {script.shot_list && script.shot_list.length > 0 && (
                                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-medium text-black flex items-center gap-2">
                                                        🎬 Shot List
                                                    </h4>
                                                    <button
                                                        onClick={() => {
                                                            const csvContent = script.shot_list.map((shot: any, idx: number) => 
                                                                `${idx + 1},"${shot.type}","${shot.duration}","${shot.visual}","${shot.audio}"`
                                                            ).join('\n');
                                                            const csv = `Shot,Type,Duration,Visual,Audio\n${csvContent}`;
                                                            const blob = new Blob([csv], { type: 'text/csv' });
                                                            const url = URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = `${project.name}-shot-list.csv`;
                                                            a.click();
                                                            URL.revokeObjectURL(url);
                                                        }}
                                                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                                    >
                                                        📊 Export CSV
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {script.shot_list.map((shot: any, idx: number) => (
                                                        <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                            <div className="flex flex-col items-center min-w-[50px]">
                                                                <span className="text-lg font-bold text-gray-600">#{idx + 1}</span>
                                                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                                                                    {shot.duration}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${
                                                                        shot.type.includes('Head')
                                                                            ? 'bg-purple-100 text-purple-700'
                                                                            : 'bg-blue-100 text-blue-700'
                                                                    }`}>
                                                                        {shot.type === 'Talking Head' ? '👤' : '🖥️'} {shot.type}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-black">
                                                                    <span className="text-gray-500 font-medium">Visual:</span> {shot.visual}
                                                                </div>
                                                                <div className="text-sm text-gray-600 italic">
                                                                    <span className="text-gray-500 font-medium">Audio:</span> "{shot.audio}"
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Scripts Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {script.shorts_script && (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-medium text-black text-sm flex items-center gap-2">
                                                            📱 Short-form Script (60s)
                                                        </h4>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(script.shorts_script)}
                                                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                    <div className="text-sm text-black whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border">
                                                        {script.shorts_script}
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Perfect for TikTok, Instagram Reels, YouTube Shorts
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {script.youtube_script && (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-medium text-black text-sm flex items-center gap-2">
                                                            🎥 Long-form Script (3-5min)
                                                        </h4>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(script.youtube_script)}
                                                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                    <div className="text-sm text-black whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border max-h-64 overflow-y-auto">
                                                        {script.youtube_script}
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Perfect for YouTube, detailed product demos
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Teleprompter */}
                                        {script.teleprompter && script.teleprompter.length > 0 && (
                                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-black text-sm flex items-center gap-2">
                                                        📋 Teleprompter Notes
                                                    </h4>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(
                                                            Array.isArray(script.teleprompter) 
                                                                ? script.teleprompter.map((note: string) => `• ${note}`).join('\n')
                                                                : script.teleprompter
                                                        )}
                                                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                                <div className="text-sm text-black whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border">
                                                    {Array.isArray(script.teleprompter) 
                                                        ? script.teleprompter.map((note: string) => `• ${note}`).join('\n')
                                                        : script.teleprompter
                                                    }
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Key talking points for smooth recording
                                                </div>
                                            </div>
                                        )}

                                        {/* Production Checklist */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <h4 className="font-medium text-black mb-3 flex items-center gap-2">
                                                ✅ Production Checklist
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Camera/phone positioned and tested</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Screen recording software ready</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Audio levels checked</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Lighting setup complete</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Background/environment prepared</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Script reviewed and practiced</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}ex-1 space-y-1">
                                                                <div className="text-xs text-zinc-200">
                                                                    <span className="text-zinc-500">Visual:</span> {shot.visual}
                                                                </div>
                                                                <div className="text-xs text-zinc-400 italic">
                                                                    <span className="text-zinc-500">Audio:</span> "{shot.audio}"
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Scripts Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {script.shorts_script && (
                                                <ContentSection title="Short-form Script (60s)" content={script.shorts_script} />
                                            )}
                                            
                                            {script.youtube_script && (
                                                <ContentSection title="Long-form Script (3-5min)" content={script.youtube_script} />
                                            )}
                                        </div>

                                        {/* Teleprompter */}
                                        {script.teleprompter && script.teleprompter.length > 0 && (
                                            <ContentSection 
                                                title="Teleprompter Notes" 
                                                content={script.teleprompter.map((note: string) => `• ${note}`).join('\n')} 
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Status Change Dialog */}
            {statusDialog && project && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-black mb-4">
                            Change Status: {project.name}
                        </h3>
                        <div className="space-y-2 mb-6">
                            {['draft', 'ready', 'published', 'archived'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => updateProjectStatus(status)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                        project.status === status
                                            ? 'bg-blue-600 text-white'
                                            : 'text-black hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="capitalize">{status}</span>
                                    {project.status === status && (
                                        <span className="text-xs ml-2">(current)</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStatusDialog(false)}
                                className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Generation Dialog */}
            {showPostGenerator && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg w-full mx-4">
                        <h3 className="text-lg font-medium text-black mb-4">
                            Generate Social Media Posts
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Create platform-specific posts from your latest content generation. 
                            This will generate optimized posts for Twitter, LinkedIn, Facebook, and Instagram.
                        </p>
                        
                        {generations.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="text-sm text-black mb-2">
                                    <strong>Source Content:</strong>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                        {generations[0].type}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(generations[0].createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPostGenerator(false)}
                                className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors"
                                disabled={generatingPosts}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={generatePostsFromContent}
                                disabled={generatingPosts}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {generatingPosts ? "Generating..." : "Generate Posts"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}

// Generation Card Component
function GenerationCard({ generation }: { generation: Generation }) {
    const [activeTab, setActiveTab] = useState<'content' | 'insights'>('content');
    
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        {new Date(generation.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {generation.type}
                    </span>
                </div>
                
                {/* Tab Toggle */}
                <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${
                            activeTab === 'content'
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-gray-600 hover:text-black'
                        }`}
                    >
                        Content
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${
                            activeTab === 'insights'
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-gray-600 hover:text-black'
                        }`}
                    >
                        Insights
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'content' && (
                    <GenerationContent generation={generation} />
                )}
                
                {activeTab === 'insights' && generation.launchlessInsights && (
                    <LaunchlessInsights data={generation.launchlessInsights} />
                )}
            </div>
        </div>
    );
}

// Generation Content Component
function GenerationContent({ generation }: { generation: Generation }) {
    if (generation.type === 'video') {
        return <VideoContent content={generation.content} />;
    } else {
        return <TextContent content={generation.content} />;
    }
}

// Text Content Component
function TextContent({ content }: { content: Generation['content'] }) {
    return (
        <div className="space-y-6">
            {content.positioning && (
                <ContentSection title="Product Positioning" content={content.positioning} />
            )}
            
            {content.core_hook && (
                <ContentSection title="Core Hook" content={content.core_hook} />
            )}
            
            {content.product_hunt && (
                <ContentSection 
                    title="Product Hunt" 
                    content={
                        typeof content.product_hunt === 'string' 
                            ? content.product_hunt 
                            : `${content.product_hunt.headline}\n${content.product_hunt.tagline}\n\n${content.product_hunt.description}\n\nMaker's Comment:\n${content.product_hunt.makers_comment}`
                    } 
                />
            )}
            
            {content.x_threads && (
                <ContentSection 
                    title="X/Twitter Threads" 
                    content={
                        Array.isArray(content.x_threads)
                            ? content.x_threads.map(t => typeof t === 'string' ? t : JSON.stringify(t)).join('\n\n---\n\n')
                            : String(content.x_threads)
                    } 
                />
            )}
            
            {content.linkedin && (
                <ContentSection title="LinkedIn Post" content={content.linkedin} />
            )}
            
            {content.followups && (
                <ContentSection title="Follow-up Posts" content={content.followups.join('\n\n')} />
            )}
            
            {content.cta && (
                <ContentSection title="Call to Action" content={content.cta} />
            )}
        </div>
    );
}

// Video Content Component
function VideoContent({ content }: { content: Generation['content'] }) {
    return (
        <div className="space-y-6">
            {/* Shot List */}
            {content.shot_list && content.shot_list.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-white">Shot List</h3>
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">
                            {content.total_estimated_duration || '60s'}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {content.shot_list.map((shot, idx) => (
                            <div key={idx} className="flex gap-3 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                                <div className="flex flex-col items-center min-w-[50px]">
                                    <span className="text-lg font-bold text-zinc-500">#{idx + 1}</span>
                                    <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full mt-1">
                                        {shot.duration}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                                            shot.type.includes('Head')
                                                ? 'bg-purple-500/20 text-purple-300'
                                                : 'bg-blue-500/20 text-blue-300'
                                        }`}>
                                            {shot.type}
                                        </span>
                                    </div>
                                    <div className="text-sm text-zinc-200">
                                        <span className="text-zinc-500">Visual:</span> {shot.visual}
                                    </div>
                                    <div className="text-sm text-zinc-400 italic">
                                        <span className="text-zinc-500">Audio:</span> "{shot.audio}"
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Teleprompter */}
            {content.teleprompter && content.teleprompter.length > 0 && (
                <ContentSection 
                    title="Teleprompter Notes" 
                    content={content.teleprompter.map(note => `• ${note}`).join('\n')} 
                />
            )}
            
            {/* Scripts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.shorts_script && (
                    <ContentSection title="Short-form Script (60s)" content={content.shorts_script} />
                )}
                
                {content.youtube_script && (
                    <ContentSection title="Long-form Script (3-5min)" content={content.youtube_script} />
                )}
            </div>
        </div>
    );
}

// Content Section Component
function ContentSection({ title, content }: { title: string; content: string }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-black text-sm">{title}</h4>
                <button
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                    Copy
                </button>
            </div>
            <div className="text-sm text-black whitespace-pre-wrap leading-relaxed">
                {content}
            </div>
        </div>
    );
}