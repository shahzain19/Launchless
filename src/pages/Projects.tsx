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
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Launchless</h1>
                    <p className="text-zinc-400 mb-6">Sign in to manage your launch projects</p>
                    <a
                        href={`${API_URL}/auth/github`}
                        className="bg-white text-black px-6 py-3 font-medium hover:bg-zinc-200 transition-colors"
                    >
                        Sign in with GitHub
                    </a>
                </div>
            </div>
        );
    }

   return (
  <div className="min-h-screen bg-black text-white">
    <div className="max-w-6xl mx-auto px-6 py-14">

      {/* Header */}
      <div className="flex items-center justify-between mb-14">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Projects
          </h1>
          <p className="text-zinc-500 mt-1">
            Everything you’re building, in one place
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition"
          >
            New project
          </button>

          {user && (
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <a
                href={`${API_URL}/auth/logout`}
                className="hover:text-white transition"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="mb-16 max-w-2xl">
          <h2 className="text-xl font-medium mb-6">
            Create project
          </h2>

          <div className="space-y-5">
            <input
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              className="w-full bg-zinc-900 px-4 py-3 text-sm border border-zinc-800 focus:border-white outline-none"
            />

            <input
              placeholder="Short description (optional)"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full bg-zinc-900 px-4 py-3 text-sm border border-zinc-800 focus:border-white outline-none"
            />

            <input
              placeholder="GitHub repo (optional)"
              value={newProject.github}
              onChange={(e) =>
                setNewProject({ ...newProject, github: e.target.value })
              }
              className="w-full bg-zinc-900 px-4 py-3 text-sm border border-zinc-800 focus:border-white outline-none"
            />

            <input
              placeholder="Website (optional)"
              value={newProject.website}
              onChange={(e) =>
                setNewProject({ ...newProject, website: e.target.value })
              }
              className="w-full bg-zinc-900 px-4 py-3 text-sm border border-zinc-800 focus:border-white outline-none"
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={createProject}
                disabled={creating}
                className="bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition"
              >
                {creating ? "Creating…" : "Create"}
              </button>

              <button
                onClick={() => setShowCreateForm(false)}
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="py-24 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">Loading projects…</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-zinc-500 mb-4">
            You haven’t created any projects yet.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative group bg-zinc-900 p-6 border border-zinc-800 hover:border-zinc-700 transition"
            >
              <Link to={`/projects/${project.id}`}>
                <h3 className="font-medium text-lg mb-2">
                  {project.name}
                </h3>

                {project.description && (
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="capitalize">{project.status}</span>
                  <span>
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteDialog({ isOpen: true, project });
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    <ConfirmDialog
      isOpen={deleteDialog.isOpen}
      title="Delete project"
      message={`Delete "${deleteDialog.project?.name}"? This cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      onConfirm={() =>
        deleteDialog.project && deleteProject(deleteDialog.project)
      }
      onCancel={() => setDeleteDialog({ isOpen: false })}
    />

    <ToastContainer toasts={toasts} removeToast={removeToast} />
  </div>
);
}