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
    const [activeTab, setActiveTab] = useState<'overview' | 'generations' | 'posts' | 'signals'>('overview');
    const [loading, setLoading] = useState(true);

    const { toasts, removeToast, error } = useToast();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    useEffect(() => {
        if (id) {
            fetchProject();
            fetchGenerations();
            fetchPosts();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <div className="text-zinc-400">Loading project...</div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-zinc-400 mb-4">Project not found</div>
                    <Link to="/projects" className="text-blue-400 hover:text-blue-300">
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link to="/projects" className="text-zinc-400 hover:text-zinc-200">
                                ← Projects
                            </Link>
                            <span className="text-zinc-600">/</span>
                            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                        </div>
                        {project.description && (
                            <p className="text-zinc-400">{project.description}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/generate?projectId=${project.id}`}
                            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                        >
                            Generate Content
                        </Link>
                        <span className={`px-3 py-1 text-sm rounded ${
                            project.status === 'published' ? 'bg-green-500/20 text-green-400' :
                            project.status === 'ready' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-zinc-500/20 text-zinc-400'
                        }`}>
                            {project.status}
                        </span>
                    </div>
                </div>

                {/* Project Info */}
                <div className="bg-zinc-900/30 rounded-lg p-6 mb-8 border border-zinc-800/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-sm text-zinc-500 mb-1">GitHub Repository</div>
                            {project.github ? (
                                <a 
                                    href={project.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                    {project.github.replace('https://github.com/', '')}
                                </a>
                            ) : (
                                <span className="text-zinc-500 text-sm">Not set</span>
                            )}
                        </div>
                        <div>
                            <div className="text-sm text-zinc-500 mb-1">Website</div>
                            {project.website ? (
                                <a 
                                    href={project.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                    {project.website}
                                </a>
                            ) : (
                                <span className="text-zinc-500 text-sm">Not set</span>
                            )}
                        </div>
                        <div>
                            <div className="text-sm text-zinc-500 mb-1">Last Updated</div>
                            <span className="text-zinc-300 text-sm">
                                {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-zinc-900 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-2 px-4 text-sm rounded-md transition-all ${
                            activeTab === 'overview'
                                ? "bg-white text-black font-medium"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('signals')}
                        className={`flex-1 py-2 px-4 text-sm rounded-md transition-all ${
                            activeTab === 'signals'
                                ? "bg-white text-black font-medium"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Signal Finder
                    </button>
                    <button
                        onClick={() => setActiveTab('generations')}
                        className={`flex-1 py-2 px-4 text-sm rounded-md transition-all ${
                            activeTab === 'generations'
                                ? "bg-white text-black font-medium"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Generations ({generations.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex-1 py-2 px-4 text-sm rounded-md transition-all ${
                            activeTab === 'posts'
                                ? "bg-white text-black font-medium"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Posts ({posts.length})
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800/50">
                                <div className="text-2xl font-bold text-white mb-1">{generations.length}</div>
                                <div className="text-sm text-zinc-400">Content Generations</div>
                            </div>
                            <div className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800/50">
                                <div className="text-2xl font-bold text-white mb-1">{posts.length}</div>
                                <div className="text-sm text-zinc-400">Posts Created</div>
                            </div>
                            <div className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800/50">
                                <div className="text-2xl font-bold text-white mb-1">
                                    {posts.filter(p => p.status === 'published').length}
                                </div>
                                <div className="text-sm text-zinc-400">Posts Published</div>
                            </div>
                        </div>

                        {generations.length > 0 && (
                            <div>
                                <h2 className="text-lg font-medium text-white mb-4">Latest Generation</h2>
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
                                <div className="text-zinc-400 mb-4">No content generated yet</div>
                                <Link
                                    to={`/generate?projectId=${project.id}`}
                                    className="text-blue-400 hover:text-blue-300"
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
                        {posts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-zinc-400 mb-4">No posts created yet</div>
                                <div className="text-sm text-zinc-500">
                                    Posts will be created automatically from your generated content
                                </div>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">
                                                {post.platform}
                                            </span>
                                            {post.title && (
                                                <span className="font-medium text-white">{post.title}</span>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                                            post.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-zinc-500/20 text-zinc-400'
                                        }`}>
                                            {post.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-zinc-300 whitespace-pre-wrap">
                                        {post.content.length > 200 
                                            ? `${post.content.substring(0, 200)}...` 
                                            : post.content
                                        }
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-3">
                                        Created {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}

// Generation Card Component
function GenerationCard({ generation }: { generation: Generation }) {
    const [activeTab, setActiveTab] = useState<'content' | 'insights'>('content');
    
    return (
        <div className="bg-zinc-900/30 rounded-lg border border-zinc-800/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-400">
                        {new Date(generation.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                        {generation.type}
                    </span>
                </div>
                
                {/* Tab Toggle */}
                <div className="flex bg-zinc-800 rounded p-1">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-3 py-1 text-xs rounded transition-all ${
                            activeTab === 'content'
                                ? 'bg-white text-black font-medium'
                                : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                        Content
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`px-3 py-1 text-xs rounded transition-all ${
                            activeTab === 'insights'
                                ? 'bg-white text-black font-medium'
                                : 'text-zinc-400 hover:text-zinc-200'
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
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                            {content.total_estimated_duration || '60s'}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {content.shot_list.map((shot, idx) => (
                            <div key={idx} className="flex gap-3 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                <div className="flex flex-col items-center min-w-[50px]">
                                    <span className="text-lg font-bold text-zinc-500">#{idx + 1}</span>
                                    <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded mt-1">
                                        {shot.duration}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
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
        <div className="bg-zinc-950/30 rounded-lg p-4 border border-zinc-800/50">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-zinc-200 text-sm">{title}</h4>
                <button
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded hover:bg-zinc-800/50 transition-colors"
                >
                    Copy
                </button>
            </div>
            <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {content}
            </div>
        </div>
    );
}