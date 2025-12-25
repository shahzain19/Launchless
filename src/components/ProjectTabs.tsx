interface ProjectTabsProps {
    activeTab: 'overview' | 'generations' | 'posts' | 'scripts' | 'signals';
    onTabChange: (tab: 'overview' | 'generations' | 'posts' | 'scripts' | 'signals') => void;
    generationsCount: number;
    postsCount: number;
    scriptsCount: number;
}

export default function ProjectTabs({ 
    activeTab, 
    onTabChange, 
    generationsCount, 
    postsCount, 
    scriptsCount 
}: ProjectTabsProps) {
    return (
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
                onClick={() => onTabChange('overview')}
                className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                    activeTab === 'overview'
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-600 hover:text-black"
                }`}
            >
                Overview
            </button>
            <button
                onClick={() => onTabChange('signals')}
                className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                    activeTab === 'signals'
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-600 hover:text-black"
                }`}
            >
                Signal Finder
            </button>
            <button
                onClick={() => onTabChange('generations')}
                className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                    activeTab === 'generations'
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-600 hover:text-black"
                }`}
            >
                Generations ({generationsCount})
            </button>
            <button
                onClick={() => onTabChange('posts')}
                className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                    activeTab === 'posts'
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-600 hover:text-black"
                }`}
            >
                Posts ({postsCount})
            </button>
            <button
                onClick={() => onTabChange('scripts')}
                className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                    activeTab === 'scripts'
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-600 hover:text-black"
                }`}
            >
                Scripts ({scriptsCount})
            </button>
        </div>
    );
}
