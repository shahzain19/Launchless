import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
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

interface User {
    username: string;
    avatarUrl?: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; project?: Project }>({ isOpen: false });
    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        github: "",
        website: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { toasts, removeToast, success, error } = useToast();
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
            error("Failed to load user information");
        }
    }

    async function fetchProjects() {
        try {
            const res = await fetch(`${API_URL}/api/projects`, { credentials: "include" });
            
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            
            const data = await res.json();
            setProjects(data.success ? data.data : data); // Handle both old and new response formats
        } catch (err) {
            console.error("Failed to fetch projects", err);
            error("Failed to load projects. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function validateProject() {
        const newErrors: Record<string, string> = {};
        
        if (!newProject.name.trim()) {
            newErrors.name = "Project name is required";
        } else if (newProject.name.length > 100) {
            newErrors.name = "Project name must be less than 100 characters";
        }
        
        if (newProject.description && newProject.description.length > 500) {
            newErrors.description = "Description must be less than 500 characters";
        }
        
        if (newProject.github && !isValidUrl(newProject.github)) {
            newErrors.github = "Please enter a valid GitHub URL";
        }
        
        if (newProject.website && !isValidUrl(newProject.website)) {
            newErrors.website = "Please enter a valid website URL";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function isValidUrl(string: string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async function createProject() {
        if (!validateProject()) return;
        
        setCreating(true);
        setErrors({});

        try {
            const res = await fetch(`${API_URL}/api/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newProject)
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.details && Array.isArray(data.details)) {
                    // Handle validation errors
                    const fieldErrors: Record<string, string> = {};
                    data.details.forEach((detail: string) => {
                        if (detail.includes('name')) fieldErrors.name = detail;
                        else if (detail.includes('description')) fieldErrors.description = detail;
                        else if (detail.includes('GitHub')) fieldErrors.github = detail;
                        else if (detail.includes('Website')) fieldErrors.website = detail;
                    });
                    setErrors(fieldErrors);
                } else {
                    error(data.message || "Failed to create project");
                }
                return;
            }

            const project = data.success ? data.data : data;
            setProjects([project, ...projects]);
            setNewProject({ name: "", description: "", github: "", website: "" });
            setShowCreateForm(false);
            success("Project created successfully!");
        } catch (err) {
            console.error("Failed to create project", err);
            error("Failed to create project. Please check your connection and try again.");
        } finally {
            setCreating(false);
        }
    }

    async function deleteProject(project: Project) {
        try {
            const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to delete project");
            }

            setProjects(projects.filter(p => p.id !== project.id));
            success("Project deleted successfully");
        } catch (err) {
            console.error("Failed to delete project", err);
            error("Failed to delete project. Please try again.");
        } finally {
            setDeleteDialog({ isOpen: false });
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
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16 gap-8">
                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                            Your Projects
                        </h1>
                        <p className="text-zinc-400 text-xl font-light">Ship faster, launch smarter</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="group bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-100 transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-white/10 hover:scale-105"
                        >
                            <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            New Project
                        </button>
                        
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10">
                            {user.avatarUrl && (
                                <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full ring-2 ring-white/20" />
                            )}
                            <div className="hidden sm:block">
                                <div className="text-sm font-semibold text-white">{user.username}</div>
                                <a href={`${API_URL}/auth/logout`} className="text-xs text-zinc-400 hover:text-white transition-colors font-medium">
                                    Sign out
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Project Form */}
                {showCreateForm && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            Create New Project
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-3 block">Project Name *</label>
                                <input
                                    value={newProject.name}
                                    onChange={(e) => {
                                        setNewProject({ ...newProject, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: "" });
                                    }}
                                    placeholder="My Awesome Product"
                                    className={`w-full px-4 py-4 bg-white/5 border rounded-2xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all ${
                                        errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20'
                                    }`}
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-2 font-medium">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-3 block">Description</label>
                                <input
                                    value={newProject.description}
                                    onChange={(e) => {
                                        setNewProject({ ...newProject, description: e.target.value });
                                        if (errors.description) setErrors({ ...errors, description: "" });
                                    }}
                                    placeholder="Brief description of your product"
                                    className={`w-full px-4 py-4 bg-white/5 border rounded-2xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all ${
                                        errors.description ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20'
                                    }`}
                                />
                                {errors.description && <p className="text-red-400 text-sm mt-2 font-medium">{errors.description}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-3 block">GitHub Repository</label>
                                <input
                                    value={newProject.github}
                                    onChange={(e) => {
                                        setNewProject({ ...newProject, github: e.target.value });
                                        if (errors.github) setErrors({ ...errors, github: "" });
                                    }}
                                    placeholder="https://github.com/owner/repo"
                                    className={`w-full px-4 py-4 bg-white/5 border rounded-2xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all ${
                                        errors.github ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20'
                                    }`}
                                />
                                {errors.github && <p className="text-red-400 text-sm mt-2 font-medium">{errors.github}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-3 block">Website</label>
                                <input
                                    value={newProject.website}
                                    onChange={(e) => {
                                        setNewProject({ ...newProject, website: e.target.value });
                                        if (errors.website) setErrors({ ...errors, website: "" });
                                    }}
                                    placeholder="https://yourproduct.com"
                                    className={`w-full px-4 py-4 bg-white/5 border rounded-2xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all ${
                                        errors.website ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20'
                                    }`}
                                />
                                {errors.website && <p className="text-red-400 text-sm mt-2 font-medium">{errors.website}</p>}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={createProject}
                                disabled={creating || !newProject.name.trim()}
                                className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-xl hover:scale-105"
                            >
                                {creating && <LoadingSpinner size="sm" />}
                                {creating ? 'Creating...' : 'Create Project'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setErrors({});
                                    setNewProject({ name: "", description: "", github: "", website: "" });
                                }}
                                className="px-8 py-4 text-zinc-400 hover:text-white transition-colors font-semibold rounded-2xl hover:bg-white/5"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <LoadingSpinner size="lg" className="mx-auto mb-6" />
                        <div className="text-zinc-400 text-lg font-light">Loading your projects...</div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-12 h-12 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">No projects yet</h3>
                        <p className="text-zinc-400 mb-8 text-lg font-light">Create your first project to get started</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-100 transition-all duration-300 hover:scale-105 shadow-xl"
                        >
                            Create your first project →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/5 relative overflow-hidden"
                            >
                                {/* Background gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <Link to={`/projects/${project.id}`} className="block relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <h3 className="font-bold text-xl text-white group-hover:text-white transition-colors leading-tight">
                                            {project.name}
                                        </h3>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            project.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                            project.status === 'ready' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                            'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    
                                    {project.description && (
                                        <p className="text-zinc-400 mb-6 line-clamp-2 font-light leading-relaxed">
                                            {project.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4 text-zinc-500">
                                            {project.github && (
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                    </svg>
                                                    GitHub
                                                </span>
                                            )}
                                            {project.website && (
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                                                    </svg>
                                                    Website
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-zinc-500 font-medium">
                                            {new Date(project.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Link>
                                
                                {/* Delete button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDeleteDialog({ isOpen: true, project });
                                    }}
                                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 text-zinc-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 z-20"
                                    title="Delete project"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Project"
                message={`Are you sure you want to delete "${deleteDialog.project?.name}"? This action cannot be undone and will delete all associated content.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={() => deleteDialog.project && deleteProject(deleteDialog.project)}
                onCancel={() => setDeleteDialog({ isOpen: false })}
            />

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}