import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Project {
    id: number;
    name: string;
    description: string;
    github: string;
    website: string;
    status: string;
}

interface EditProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProject: Partial<Project>) => Promise<void>;
}

export default function EditProjectModal({ project, isOpen, onClose, onSave }: EditProjectModalProps) {
    const [formData, setFormData] = useState({
        name: project.name,
        description: project.description || '',
        github: project.github || '',
        website: project.website || '',
        status: project.status
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

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
            newErrors.github = "Please enter a valid GitHub URL";
        }
        
        if (formData.website && !isValidUrl(formData.website)) {
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

    async function handleSave() {
        if (!validateForm()) return;
        
        setSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            // Error handling is done in parent component
        } finally {
            setSaving(false);
        }
    }

    function handleClose() {
        setFormData({
            name: project.name,
            description: project.description || '',
            github: project.github || '',
            website: project.website || '',
            status: project.status
        });
        setErrors({});
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Edit Project</h2>
                    <button
                        onClick={handleClose}
                        className="text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Project Name */}
                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">Project Name *</label>
                        <input
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (errors.name) setErrors({ ...errors, name: "" });
                            }}
                            placeholder="My Awesome Product"
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                errors.name ? 'border-red-500' : 'border-zinc-700'
                            }`}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({ ...formData, description: e.target.value });
                                if (errors.description) setErrors({ ...errors, description: "" });
                            }}
                            placeholder="Brief description of your product"
                            rows={3}
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none ${
                                errors.description ? 'border-red-500' : 'border-zinc-700'
                            }`}
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* GitHub Repository */}
                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">GitHub Repository</label>
                        <input
                            value={formData.github}
                            onChange={(e) => {
                                setFormData({ ...formData, github: e.target.value });
                                if (errors.github) setErrors({ ...errors, github: "" });
                            }}
                            placeholder="https://github.com/owner/repo"
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                errors.github ? 'border-red-500' : 'border-zinc-700'
                            }`}
                        />
                        {errors.github && <p className="text-red-400 text-xs mt-1">{errors.github}</p>}
                    </div>

                    {/* Website */}
                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">Website</label>
                        <input
                            value={formData.website}
                            onChange={(e) => {
                                setFormData({ ...formData, website: e.target.value });
                                if (errors.website) setErrors({ ...errors, website: "" });
                            }}
                            placeholder="https://yourproduct.com"
                            className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 ${
                                errors.website ? 'border-red-500' : 'border-zinc-700'
                            }`}
                        />
                        {errors.website && <p className="text-red-400 text-xs mt-1">{errors.website}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-sm text-zinc-300 mb-2 block">Status</label>
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

                {/* Actions */}
                <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-zinc-800">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !formData.name.trim()}
                        className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {saving && <LoadingSpinner size="sm" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}