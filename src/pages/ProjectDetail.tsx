import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SignalFinder from "../components/SignalFinder";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import ProjectHeader from "../components/ProjectHeader";
import ProjectInfo from "../components/ProjectInfo";
import ProjectTabs from "../components/ProjectTabs";
import OverviewTab from "../components/OverviewTab";
import GenerationsTab from "../components/GenerationsTab";
import PostsTab from "../components/PostsTab";
import ScriptsTab from "../components/ScriptsTab";
import StatusDialog from "../components/StatusDialog";
import PostGeneratorDialog from "../components/PostGeneratorDialog";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

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
    content: any;
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
    const [scripts, setScripts] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'generations' | 'posts' | 'scripts' | 'signals'>('overview');
    const [loading, setLoading] = useState(true);
    const [statusDialog, setStatusDialog] = useState(false);
    const [showPostGenerator, setShowPostGenerator] = useState(false);
    const { success, error, toasts, removeToast } = useToast();
    const { apiCall } = useApi();
    const { logout } = useAuth();

    useEffect(() => {
        fetchProject();
        fetchGenerations();
        fetchPosts();
        fetchScripts();
    }, [id]);

    const fetchProject = async () => {
        try {
            const result = await apiCall(`/api/projects/${id}`);
            setProject(result.data || result);
        } catch (err) {
            console.error('Error fetching project:', err);
            error('Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    const fetchGenerations = async () => {
        try {
            const result = await apiCall(`/api/projects/${id}/generations`);
            setGenerations(result.data || result);
        } catch (err) {
            console.error('Error fetching generations:', err);
        }
    };

    const fetchPosts = async () => {
        try {
            const result = await apiCall(`/api/projects/${id}/posts`);
            setPosts(result.data || result);
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

    const fetchScripts = async () => {
        try {
            const result = await apiCall(`/api/projects/${id}/scripts`);
            setScripts(result.data || result);
        } catch (err) {
            console.error('Error fetching scripts:', err);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await apiCall(`/api/projects/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });

            setProject(prev => prev ? { ...prev, status: newStatus } : null);
            success('Status updated successfully');
            setStatusDialog(false);
        } catch (err) {
            console.error('Error updating status:', err);
            error('Failed to update status');
        }
    };

    const handleDuplicate = async () => {
        try {
            const result = await apiCall(`/api/projects/${id}/duplicate`, {
                method: 'POST'
            });

            success('Project duplicated successfully');
            window.location.href = `/projects/${result.data?.id || result.id}`;
        } catch (err) {
            console.error('Error duplicating project:', err);
            error('Failed to duplicate project');
        }
    };

    const handleGeneratePosts = async () => {
        if (generations.length === 0) {
            error('No content available to generate posts from');
            return;
        }

        setShowPostGenerator(true);
    };

    const handlePostGenerate = async () => {
        try {
            await apiCall(`/api/projects/${id}/generate-posts-from-project`, {
                method: 'POST',
                body: JSON.stringify({ platforms: ['twitter', 'linkedin', 'facebook', 'instagram'] })
            });

            await fetchPosts();
            success('Posts generated successfully');
            setShowPostGenerator(false);
        } catch (err) {
            console.error('Error generating posts:', err);
            error('Failed to generate posts');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Project not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="heading-font text-2xl font-bold gradient-text">Launchless</h1>
                    <div className="flex items-center gap-4">
                        <Link to="/projects" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            My Projects
                        </Link>
                        <button
                            onClick={logout}
                            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProjectHeader 
                    project={project}
                    onStatusClick={() => setStatusDialog(true)}
                    onDuplicate={handleDuplicate}
                />

                <ProjectInfo project={project} />

                <ProjectTabs 
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    generationsCount={generations.length}
                    postsCount={posts.length}
                    scriptsCount={scripts.length}
                />

                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <OverviewTab 
                            generations={generations}
                            postsCount={posts.length}
                            publishedPostsCount={posts.filter(p => p.status === 'published').length}
                            projectId={Number(id)}
                        />
                    )}

                    {activeTab === 'generations' && (
                        <GenerationsTab 
                            generations={generations}
                            projectId={Number(id)}
                        />
                    )}

                    {activeTab === 'posts' && (
                        <PostsTab 
                            posts={posts}
                            generationsCount={generations.length}
                            onGeneratePosts={handleGeneratePosts}
                        />
                    )}

                    {activeTab === 'scripts' && (
                        <ScriptsTab 
                            scripts={scripts}
                            projectId={Number(id)}
                            projectName={project.name}
                        />
                    )}

                    {activeTab === 'signals' && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
                            <SignalFinder projectId={id || ''} />
                        </div>
                    )}
                </div>
            </div>

            {statusDialog && (
                <StatusDialog
                    project={project}
                    onClose={() => setStatusDialog(false)}
                    onUpdateStatus={handleStatusChange}
                />
            )}

            {showPostGenerator && (
                <PostGeneratorDialog
                    generations={generations}
                    onClose={() => setShowPostGenerator(false)}
                    onGenerate={handlePostGenerate}
                    isGenerating={false}
                />
            )}

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}
