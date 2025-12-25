interface Project {
    name: string;
    status: string;
}

interface StatusDialogProps {
    project: Project;
    onClose: () => void;
    onUpdateStatus: (status: string) => void;
}

export default function StatusDialog({ project, onClose, onUpdateStatus }: StatusDialogProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-medium text-black mb-4">
                    Change Status: {project.name}
                </h3>
                <div className="space-y-2 mb-6">
                    {['draft', 'ready', 'published', 'archived'].map((status) => (
                        <button
                            key={status}
                            onClick={() => onUpdateStatus(status)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                project.status === status
                                    ? 'bg-blue-600 text-white'
                                    : 'text-black hover:bg-gray-100'
                            }`}
                        >
                            <span className="capitalize">{status}</span>
                            {project.status === status && (
                                <span className="text-xs ml-2">(current)</span>
                            )}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
