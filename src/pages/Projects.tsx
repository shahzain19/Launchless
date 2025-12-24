import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

interface User {
    username: string;
    avatarUrl?: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        github: "",
        website: ""
    });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    useEffect(() => {
        fetchUser();
        fetchProjects();
    }, []);

    async function fetchUser() {
        try {
            const res = await fetch(`${API_URL}/auth/current-user`, { credentials: "include" });
            const data = await res.json();
            if (data.authenticated) {
                setUser(data.user);
            }
        } catch (err) {
            console.error("Failed to fetch user", err);
        }
    }

    async function fetchProjects() {
        try {
            const res = await fetch(`${API_URL}/api/projects`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setLoading(false);
        }
    }

    async function createProject() {
        if (!newProject.name.trim()) return;

        try {
            const res = await fetch(`${API_URL}/api/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newProject)
            });

            if (res.ok) {
                const project = await res.json();
                setProjects([project, ...projects]);
                setNewProject({ name: "", description: "", github: "", website: "" });
                setShowCreateForm(false);
            }
        } catch (err) {
            console.error("Failed to create project", err);
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Launchless</h1>
                    <p className="text-zinc-400 mb-6">Sign in to manage your launch projects</p>
                    <a
                        href={`${API_URL}/auth/github`}
                        className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                    >
                        Sign in with GitHub
                    </a>
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
                        <h1 className="text-2xl font-bold text-white mb-2">Your Projects</h1>
                        <p className="text-zinc-400">Manage your launch campaigns and content</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                        >
                            New Project
                        </button>
                        
                        <div className="flex items-center gap-2">
                            {user.avatarUrl && (
                                <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full" />
                            )}
                            <span className="text-sm text-zinc-400">{user.username}</span>
                            <a href={`${API_URL}/auth/logout`} className="text-xs text-zinc-500 hover:text-white ml-2">
                                Sign out
                            </a>
                        </div>
                    </div>
                </div>

                {/* Create Project Form */}
                {showCreateForm && (
                    <div className="bg-zinc-900/50 rounded-xl p-6 mb-8 border border-zinc-800/50">
                        <h2 className="text-lg font-medium text-white mb-4">Create New Project</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm text-zinc-300 mb-2 block">Project Name *</label>
                                <input
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    placeholder="My Awesome Product"
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-300 mb-2 block">Description</label>
                                <input
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Brief description of your product"
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-300 mb-2 block">GitHub Repository</label>
                                <input
                                    value={newProject.github}
                                    onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                                    placeholder="https://github.com/owner/repo"
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-300 mb-2 block">Website</label>
                                <input
                                    value={newProject.website}
                                    onChange={(e) => setNewProject({ ...newProject, website: e.target.value })}
                                    placeholder="https://yourproduct.com"
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={createProject}
                                disabled={!newProject.name.trim()}
                                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Create Project
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-zinc-400">Loading projects...</div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-zinc-400 mb-4">No projects yet</div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Create your first project →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                        {project.name}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        project.status === 'published' ? 'bg-green-500/20 text-green-400' :
                                        project.status === 'ready' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-zinc-500/20 text-zinc-400'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                                
                                {project.description && (
                                    <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                                        {project.description}
                                    </p>
                                )}
                                
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    {project.github && <span>📂 GitHub</span>}
                                    {project.website && <span>🌐 Website</span>}
                                    <span className="ml-auto">
                                        {new Date(project.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}