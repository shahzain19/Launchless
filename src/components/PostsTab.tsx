interface Post {
    id: number;
    platform: string;
    title: string;
    content: string;
    status: string;
    createdAt: string;
}

interface PostsTabProps {
    posts: Post[];
    generationsCount: number;
    onGeneratePosts: () => void;
}

export default function PostsTab({ posts, generationsCount, onGeneratePosts }: PostsTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-black">Posts</h2>
                <div className="flex items-center gap-3">
                    {generationsCount > 0 && (
                        <button
                            onClick={onGeneratePosts}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Generate Posts
                        </button>
                    )}
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-600 mb-4">No posts created yet</div>
                    {generationsCount > 0 ? (
                        <button
                            onClick={onGeneratePosts}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Generate Posts from Content
                        </button>
                    ) : (
                        <div className="text-sm text-gray-500">
                            Generate content first, then create posts from it
                        </div>
                    )}
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                    {post.platform}
                                </span>
                                {post.title && (
                                    <span className="font-medium text-black">{post.title}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigator.clipboard.writeText(post.content)}
                                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    Copy
                                </button>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    post.status === 'published' ? 'bg-green-100 text-green-700' :
                                    post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {post.status}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-black whitespace-pre-wrap">
                            {post.content.length > 200 
                                ? `${post.content.substring(0, 200)}...` 
                                : post.content
                            }
                        </div>
                        <div className="text-xs text-gray-500 mt-3">
                            Created {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
