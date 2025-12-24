import { useState, useEffect } from "react";

interface HealthData {
    status: string;
    database: string;
    users: number;
    projects: number;
    authenticated: boolean;
    user: { id: number; username: string } | null;
}

export default function Debug() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    useEffect(() => {
        fetchHealth();
        fetchProjects();
    }, []);

    async function fetchHealth() {
        try {
            const res = await fetch(`${API_URL}/api/health`, { credentials: "include" });
            const data = await res.json();
            setHealth(data);
        } catch (err) {
            setError("Failed to fetch health data");
            console.error(err);
        }
    }

    async function fetchProjects() {
        try {
            const res = await fetch(`${API_URL}/api/projects`, { credentials: "include" });
            const data = await res.json();
            setProjects(data.success ? data.data : data);
        } catch (err) {
            setError("Failed to fetch projects");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Debug Information</h1>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                        <div className="text-red-400">{error}</div>
                    </div>
                )}

                {/* Health Check */}
                <div className="bg-zinc-900/50 rounded-lg p-6 mb-6 border border-zinc-800/50">
                    <h2 className="text-lg font-semibold mb-4">System Health</h2>
                    {health ? (
                        <div className="space-y-2 text-sm">
                            <div>Status: <span className={health.status === 'healthy' ? 'text-green-400' : 'text-red-400'}>{health.status}</span></div>
                            <div>Database: <span className={health.database === 'connected' ? 'text-green-400' : 'text-red-400'}>{health.database}</span></div>
                            <div>Users: {health.users}</div>
                            <div>Projects: {health.projects}</div>
                            <div>Authenticated: <span className={health.authenticated ? 'text-green-400' : 'text-red-400'}>{health.authenticated ? 'Yes' : 'No'}</span></div>
                            {health.user && (
                                <div>Current User: {health.user.username} (ID: {health.user.id})</div>
                            )}
                        </div>
                    ) : (
                        <div className="text-zinc-400">Loading health data...</div>
                    )}
                </div>

                {/* Projects List */}
                <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800/50">
                    <h2 className="text-lg font-semibold mb-4">Projects ({projects.length})</h2>
                    {loading ? (
                        <div className="text-zinc-400">Loading projects...</div>
                    ) : projects.length === 0 ? (
                        <div className="text-zinc-400">No projects found</div>
                    ) : (
                        <div className="space-y-3">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-zinc-800/50 rounded p-3 text-sm">
                                    <div className="font-medium">ID: {project.id} - {project.name}</div>
                                    <div className="text-zinc-400">Status: {project.status}</div>
                                    <div className="text-zinc-400">Created: {new Date(project.createdAt).toLocaleString()}</div>
                                    {project.description && (
                                        <div className="text-zinc-400">Description: {project.description}</div>
                                    )}
                                    {project.github && (
                                        <div className="text-zinc-400">GitHub: {project.github}</div>
                                    )}
                                    {project.website && (
                                        <div className="text-zinc-400">Website: {project.website}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Test Links */}
                <div className="bg-zinc-900/50 rounded-lg p-6 mt-6 border border-zinc-800/50">
                    <h2 className="text-lg font-semibold mb-4">Test Links</h2>
                    <div className="space-y-2">
                        <div>
                            <a href="/projects" className="text-blue-400 hover:text-blue-300">← Back to Projects</a>
                        </div>
                        {projects.length > 0 && (
                            <div>
                                <a href={`/projects/${projects[0].id}`} className="text-blue-400 hover:text-blue-300">
                                    Test Project Detail (ID: {projects[0].id})
                                </a>
                            </div>
                        )}
                        <div>
                            <a href={`${API_URL}/auth/github`} className="text-blue-400 hover:text-blue-300">
                                Login with GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}