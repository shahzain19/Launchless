import { useState } from "react";
import { Calendar, Copy, Edit2, Trash2, ExternalLink, Check, Clock, Send } from "lucide-react";

interface Post {
    id: number;
    platform: string;
    title: string;
    content: string;
    status: string;
    scheduledFor?: string;
    publishedAt?: string;
    createdAt: string;
}

interface PostManagerProps {
    posts: Post[];
    onEdit: (post: Post) => void;
    onDelete: (postId: number) => void;
    onSchedule: (postId: number, date: string) => void;
    onPublish: (postId: number) => void;
}

export default function PostManager({ posts, onEdit, onDelete, onSchedule, onPublish }: PostManagerProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopy = async (post: Post) => {
        await navigator.clipboard.writeText(post.content);
        setCopiedId(post.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSchedule = () => {
        if (selectedPost && scheduleDate) {
            onSchedule(selectedPost.id, scheduleDate);
            setShowScheduleModal(false);
            setScheduleDate("");
            setSelectedPost(null);
        }
    };

    const getPlatformColor = (platform: string) => {
        const colors: Record<string, string> = {
            twitter: "bg-blue-100 text-blue-700",
            linkedin: "bg-blue-100 text-blue-700",
            product_hunt: "bg-orange-100 text-orange-700",
            reddit: "bg-orange-100 text-orange-700",
            facebook: "bg-blue-100 text-blue-700",
            instagram: "bg-pink-100 text-pink-700"
        };
        return colors[platform] || "bg-gray-100 text-gray-700";
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "published":
                return <Check className="w-4 h-4" />;
            case "scheduled":
                return <Clock className="w-4 h-4" />;
            case "draft":
                return <Edit2 className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-700";
            case "scheduled":
                return "bg-yellow-100 text-yellow-700";
            case "draft":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPlatformColor(post.platform)}`}>
                                {post.platform.replace('_', ' ')}
                            </span>
                            {post.title && (
                                <h3 className="font-medium text-gray-900">{post.title}</h3>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(post.status)}`}>
                                {getStatusIcon(post.status)}
                                {post.status}
                            </span>
                        </div>
                    </div>

                    {/* Content Preview */}
                    <div className="mb-4">
                        <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">
                            {post.content}
                        </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Created {new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.scheduledFor && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Scheduled for {new Date(post.scheduledFor).toLocaleString()}
                            </span>
                        )}
                        {post.publishedAt && (
                            <span className="flex items-center gap-1">
                                <Check className="w-4 h-4" />
                                Published {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => handleCopy(post)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            {copiedId === post.id ? (
                                <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => onEdit(post)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>

                        {post.status === "draft" && (
                            <>
                                <button
                                    onClick={() => {
                                        setSelectedPost(post);
                                        setShowScheduleModal(true);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Schedule
                                </button>

                                <button
                                    onClick={() => onPublish(post.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                    Publish
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => onDelete(post.id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>

                        <a
                            href={`#view-${post.id}`}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View
                        </a>
                    </div>
                </div>
            ))}

            {/* Schedule Modal */}
            {showScheduleModal && selectedPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Schedule Post
                        </h3>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowScheduleModal(false);
                                    setScheduleDate("");
                                    setSelectedPost(null);
                                }}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSchedule}
                                disabled={!scheduleDate}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
