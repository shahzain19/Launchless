import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditProject from "../components/EditProject";
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
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
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
                            <span className="text-sm text-zinc-400 hidden sm:inline">{user.username}</span>
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
                                    onChange={(e) => {
                                        setNewProject({ ...newProject, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: "" });
                                    }}
                                    placeholder="My Awesome Product"
                                    className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                        errors.name ? 'border-red-500' : 'border-zinc-700'
                                    }`}
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-zinc-300 mb-2 block">Description</label>
                                <input
                                    value={newProject.description}
                                    onChange={(e) => {
                                        setNewProject({ ...newProject, description: e.target.value });
                                        if (errors.description) setErrors({ ...errors, description: "" });
                                    }}
                                    placeholder="Brief description of your product"
                                    className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                        errors.description ? 'border-red-500' : 'border-zinc-700'
                                    }`}
                                />
                                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-zinc-300 mb-2 block">GitHub Repository</label>
                                <input
                                    value={newProject.github}
                                    onChange={(e) => {
                                        setNewProject({ ...newProject, github: e.target.value });
                                        if (errors.github) setErrors({ ...errors, github: "" });
                                    }}
                                    placeholder="https://github.com/owner/repo"
                                    className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                        errors.github ? 'border-red-500' : 'border-zinc-700'
                                    }`}
                                />
                                {errors.github && <p className="text-red-400 text-xs mt-1">{errors.github}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-zinc-300 mb-2 block">Website</label>
                                <input
                                    value={newProject.website}
                                    onChange={(e) => {
                                        setNewProject({ ...newProject, website: e.target.value });
                                        if (errors.website) setErrors({ ...errors, website: "" });
                                    }}
                                    placeholder="https://yourproduct.com"
                                    className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                        errors.website ? 'border-red-500' : 'border-zinc-700'
                                    }`}
                                />
                                {errors.website && <p className="text-red-400 text-xs mt-1">{errors.website}</p>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={createProject}
                                disabled={creating || !newProject.name.trim()}
                                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                        <LoadingSpinner size="lg" className="mx-auto mb-4" />
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
                            <div
                                key={project.id}
                                className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-all group relative"
                            >
                                <Link to={`/projects/${project.id}`} className="block">
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
                                
                                {/* Delete button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDeleteDialog({ isOpen: true, project });
                                    }}
                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 p-1"
                                    title="Delete project"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                type="danger"
                onConfirm={() => deleteDialog.project && deleteProject(deleteDialog.project)}
                onCancel={() => setDeleteDialog({ isOpen: false })}
            />

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}