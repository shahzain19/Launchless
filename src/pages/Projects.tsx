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
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    project?: Project;
  }>({ isOpen: false });
  const [duplicateDialog, setDuplicateDialog] = useState<{
    isOpen: boolean;
    project?: Project;
  }>({ isOpen: false });
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    project?: Project;
  }>({ isOpen: false });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    github: "",
    website: "",
  });
  const [, setErrors] = useState<Record<string, string>>({});
  const [projectStats, setProjectStats] = useState<
    Record<number, { generations: number; posts: number; lastActivity: string }>
  >({});

  const { toasts, removeToast, success, error } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    fetchUser();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      fetchProjectStats();
    }
  }, [projects]);

  async function fetchUser() {
    try {
      const res = await fetch(`${API_URL}/auth/current-user`, {
        credentials: "include",
      });
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
      const res = await fetch(`${API_URL}/api/projects`, {
        credentials: "include",
      });

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

  async function fetchProjectStats() {
    try {
      const statsPromises = projects.map(async (project) => {
        const [generationsRes, postsRes] = await Promise.all([
          fetch(`${API_URL}/api/projects/${project.id}/generations`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/projects/${project.id}/posts`, {
            credentials: "include",
          }),
        ]);

        let generations = 0;
        let posts = 0;
        let lastActivity = project.updatedAt;

        if (generationsRes.ok) {
          const genData = await generationsRes.json();
          const genArray = genData.success ? genData.data : genData;
          generations = Array.isArray(genArray) ? genArray.length : 0;
          if (genArray.length > 0) {
            lastActivity = genArray[0].createdAt;
          }
        }

        if (postsRes.ok) {
          const postData = await postsRes.json();
          const postArray = postData.success ? postData.data : postData;
          posts = Array.isArray(postArray) ? postArray.length : 0;
        }

        return { projectId: project.id, generations, posts, lastActivity };
      });

      const stats = await Promise.all(statsPromises);
      const statsMap = stats.reduce((acc, stat) => {
        acc[stat.projectId] = {
          generations: stat.generations,
          posts: stat.posts,
          lastActivity: stat.lastActivity,
        };
        return acc;
      }, {} as Record<number, { generations: number; posts: number; lastActivity: string }>);

      setProjectStats(statsMap);
    } catch (err) {
      console.error("Failed to fetch project stats", err);
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
        body: JSON.stringify(newProject),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details && Array.isArray(data.details)) {
          // Handle validation errors
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail: string) => {
            if (detail.includes("name")) fieldErrors.name = detail;
            else if (detail.includes("description"))
              fieldErrors.description = detail;
            else if (detail.includes("GitHub")) fieldErrors.github = detail;
            else if (detail.includes("Website")) fieldErrors.website = detail;
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
      error(
        "Failed to create project. Please check your connection and try again."
      );
    } finally {
      setCreating(false);
    }
  }

  async function deleteProject(project: Project) {
    try {
      const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete project");
      }

      setProjects(projects.filter((p) => p.id !== project.id));
      success("Project deleted successfully");
    } catch (err) {
      console.error("Failed to delete project", err);
      error("Failed to delete project. Please try again.");
    } finally {
      setDeleteDialog({ isOpen: false });
    }
  }

  async function duplicateProject(project: Project) {
    try {
      const duplicatedProject = {
        name: `${project.name} (Copy)`,
        description: project.description,
        github: project.github,
        website: project.website,
      };

      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(duplicatedProject),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to duplicate project");
      }

      const newProject = data.success ? data.data : data;
      setProjects([newProject, ...projects]);
      success("Project duplicated successfully!");
    } catch (err) {
      console.error("Failed to duplicate project", err);
      error("Failed to duplicate project. Please try again.");
    } finally {
      setDuplicateDialog({ isOpen: false });
    }
  }

  async function updateProjectStatus(project: Project, newStatus: string) {
    try {
      const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...project, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update project status");
      }

      const data = await res.json();
      const updatedProject = data.success ? data.data : data;

      setProjects(
        projects.map((p) => (p.id === project.id ? updatedProject : p))
      );
      success(`Project status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update project status", err);
      error("Failed to update project status. Please try again.");
    } finally {
      setStatusDialog({ isOpen: false });
    }
  }

  function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Launchless</h1>
          <p className="text-gray-600 mb-6">
            Sign in to manage your launch projects
          </p>
          <a
            href={`${API_URL}/auth/github`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign in with GitHub
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              Projects
            </h1>
            <p className="text-gray-600 mt-1">
              Everything you’re building, in one place
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-5 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              New project
            </button>

            {user && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <a
                  href={`${API_URL}/auth/logout`}
                  className="hover:text-black transition"
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
            <h2 className="text-xl font-medium mb-6">Create project</h2>

            <div className="space-y-5">
              <input
                placeholder="Project name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="w-full bg-white px-4 py-3 text-sm border border-zinc-50 rounded-lg focus:border-white outline-none"
              />

              <input
                placeholder="Short description (optional)"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full bg-white px-4 py-3 text-sm border border-zinc-50 rounded-lg focus:border-white outline-none"
              />

              <input
                placeholder="GitHub repo (optional)"
                value={newProject.github}
                onChange={(e) =>
                  setNewProject({ ...newProject, github: e.target.value })
                }
                className="w-full bg-white px-4 py-3 text-sm border border-zinc-50 rounded-lg focus:border-white outline-none"
              />

              <input
                placeholder="Website (optional)"
                value={newProject.website}
                onChange={(e) =>
                  setNewProject({ ...newProject, website: e.target.value })
                }
                className="w-full bg-white px-4 py-3 text-sm border border-zinc-50 rounded-lg focus:border-white outline-none"
              />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={createProject}
                  disabled={creating}
                  className="bg-white text-black px-5 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50 transition"
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
              className="bg-white text-black px-5 py-2.5 text-sm font-medium rounded-lg hover:bg-zinc-200 transition"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const stats = projectStats[project.id] || {
                generations: 0,
                posts: 0,
                lastActivity: project.updatedAt,
              };
              return (
                <div
                  key={project.id}
                  className="relative group bg-white p-6 transition-colors"
                >
                  {/* Quick Actions Menu */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDuplicateDialog({ isOpen: true, project });
                        }}
                        className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
                        title="Duplicate project"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setStatusDialog({ isOpen: true, project });
                        }}
                        className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
                        title="Change status"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteDialog({ isOpen: true, project });
                        }}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors"
                        title="Delete project"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <Link to={`/projects/${project.id}`}>
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-1 pr-16">
                          {project.name}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            project.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : project.status === "ready"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-zinc-500/20 text-zinc-400"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                        {project.description}
                      </p>
                    )}

                    {/* Activity Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-2 bg-zinc-950/50 rounded-lg">
                        <div className="text-lg font-semibold text-white">
                          {stats.generations}
                        </div>
                        <div className="text-xs text-zinc-500">Generations</div>
                      </div>
                      <div className="text-center p-2 bg-zinc-950/50 rounded-lg">
                        <div className="text-lg font-semibold text-white">
                          {stats.posts}
                        </div>
                        <div className="text-xs text-zinc-500">Posts</div>
                      </div>
                    </div>

                    {/* Activity Indicator */}
                    {stats.generations > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-zinc-400">
                          Last activity {getRelativeTime(stats.lastActivity)}
                        </span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/50">
                      <span>Created {getRelativeTime(project.createdAt)}</span>
                      <span>Updated {getRelativeTime(project.updatedAt)}</span>
                    </div>
                  </Link>
                </div>
              );
            })}
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

      <ConfirmDialog
        isOpen={duplicateDialog.isOpen}
        title="Duplicate project"
        message={`Create a copy of "${duplicateDialog.project?.name}"?`}
        confirmText="Duplicate"
        cancelText="Cancel"
        onConfirm={() =>
          duplicateDialog.project && duplicateProject(duplicateDialog.project)
        }
        onCancel={() => setDuplicateDialog({ isOpen: false })}
      />

      {/* Status Change Dialog */}
      {statusDialog.isOpen && statusDialog.project && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">
              Change Status: {statusDialog.project.name}
            </h3>
            <div className="space-y-2 mb-6">
              {["draft", "ready", "published", "archived"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    updateProjectStatus(statusDialog.project!, status)
                  }
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    statusDialog.project!.status === status
                      ? "bg-white text-black"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <span className="capitalize">{status}</span>
                  {statusDialog.project!.status === status && (
                    <span className="text-xs ml-2">(current)</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStatusDialog({ isOpen: false })}
                className="flex-1 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
