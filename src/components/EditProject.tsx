import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface Project {
    id: number;
    name: string;
    description: string;
    github: string;
    website: string;
    status: string;
}

interface EditProjectProps {
    project: Project;
    onSave: (updatedProject: Project) => void;
    onCancel: () => void;
}

export default function EditProject({ project, onSave, onCancel }: EditProjectProps) {
    const [formData, setFormData] = useState({
        name: project.name,
        description: project.description || "",
        github: project.github || "",
        website: project.website || "",
        status: project.status
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    function validateForm() {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Project name is required";
        } else if (formData.name.length > 100) {
            newErrors.name = "Project name must be less than 100 characters";
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = "Description must be less than 500 characters";
        }

        if (formData.github && !isValidUrl(formData.github)) {
            newErrors.github = "GitHub URL must be a valid URL";
        } else if (formData.github && !formData.github.includes('github.com')) {
            newErrors.github = "Must be a GitHub repository URL";
        }

        if (formData.website && !isValidUrl(formData.website)) {
            newErrors.website = "Website URL must be a valid URL";
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

    async function handleSave() {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/projects/${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to update project');
            }

            onSave(data.success ? data.data : data);
        } catch (err) {
            console.error("Failed to update project", err);
            setErrors({ general: err instanceof Error ? err.message : "Failed to update project" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Edit Project</h2>
                    <button
                        onClick={onCancel}
                        className="text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {errors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-4">
                        {errors.general}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">
                            Project Name *
                        </label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                errors.name ? 'border-red-500/50' : 'border-zinc-700'
                            }`}
                            placeholder="My Awesome Product"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 h-20 resize-none ${
                                errors.description ? 'border-red-500/50' : 'border-zinc-700'
                            }`}
                            placeholder="Brief description of your product"
                        />
                        {errors.description && (
                            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">
                            GitHub Repository
                        </label>
                        <input
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                errors.github ? 'border-red-500/50' : 'border-zinc-700'
                            }`}
                            placeholder="https://github.com/owner/repo"
                        />
                        {errors.github && (
                            <p className="text-red-400 text-xs mt-1">{errors.github}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">
                            Website
                        </label>
                        <input
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                errors.website ? 'border-red-500/50' : 'border-zinc-700'
                            }`}
                            placeholder="https://yourproduct.com"
                        />
                        {errors.website && (
                            <p className="text-red-400 text-xs mt-1">{errors.website}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                        >
                            <option value="draft">Draft</option>
                            <option value="ready">Ready</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-zinc-800">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-white text-black py-2 px-4 rounded-lg font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}