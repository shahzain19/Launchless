interface Generation {
    id: number;
    type: string;
    createdAt: string;
}

interface PostGeneratorDialogProps {
    generations: Generation[];
    onClose: () => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

export default function PostGeneratorDialog({ 
    generations, 
    onClose, 
    onGenerate, 
    isGenerating 
}: PostGeneratorDialogProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg w-full mx-4">
                <h3 className="text-lg font-medium text-black mb-4">
                    Generate Social Media Posts
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Create platform-specific posts from your latest content generation. 
                    This will generate optimized posts for Twitter, LinkedIn, Facebook, and Instagram.
                </p>
                
                {generations.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="text-sm text-black mb-2">
                            <strong>Source Content:</strong>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                {generations[0].type}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(generations[0].createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors"
                        disabled={isGenerating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isGenerating ? "Generating..." : "Generate Posts"}
                    </button>
                </div>
            </div>
        </div>
    );
}
