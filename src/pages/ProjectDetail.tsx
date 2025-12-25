import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

    useEffect(() => {
        fetchProject();
        fetchGenerations();
        fetchPosts();
        fetchScripts();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setProject(data);
            }
        } catch (err) {
            console.error('Error fetching project:', err);
            error('Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    const fetchGenerations = async () => {
        try {
            const response = await fetch(`/api/projects/${id}/generations`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setGenerations(data);
            }
        } catch (err) {
            console.error('Error fetching generations:', err);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch(`/api/projects/${id}/posts`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

    const fetchScripts = async () => {
        try {
            const response = await fetch(`/api/projects/${id}/scripts`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setScripts(data);
            }
        } catch (err) {
            console.error('Error fetching scripts:', err);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            const response = await fetch(`/api/projects/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setProject(prev => prev ? { ...prev, status: newStatus } : null);
                success('Status updated successfully');
                setStatusDialog(false);
            }
        } catch (err) {
            console.error('Error updating status:', err);
            error('Failed to update status');
        }
    };

    const handleDuplicate = async () => {
        try {
            const response = await fetch(`/api/projects/${id}/duplicate`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const newProject = await response.json();
                success('Project duplicated successfully');
                window.location.href = `/projects/${newProject.id}`;
            }
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
            const response = await fetch(`/api/projects/${id}/posts/generate`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                await fetchPosts();
                success('Posts generated successfully');
                setShowPostGenerator(false);
            }
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
