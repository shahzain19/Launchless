import { Home, FolderOpen, Sparkles, Search, BarChart3, Settings, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const location = useLocation();

    const menuItems = [
        { icon: Home, label: "Dashboard", path: "/dashboard", badge: null },
        { icon: FolderOpen, label: "Projects", path: "/projects", badge: null },
        { icon: Sparkles, label: "Generate", path: "/generate", badge: "New" },
        { icon: Search, label: "Signal Finder", path: "/signals", badge: null },
        { icon: BarChart3, label: "Analytics", path: "/analytics", badge: null },
        { icon: Settings, label: "Settings", path: "/settings", badge: null },
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="heading-font text-xl font-bold gradient-text">
                            Launchless
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-item ${active ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className="badge badge-blue text-xs">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900">
                                Pro Tip
                            </span>
                        </div>
                        <p className="text-xs text-blue-700 mb-3">
                            Use Signal Finder to discover potential customers before you launch!
                        </p>
                        <Link
                            to="/signals"
                            className="text-xs text-blue-600 font-medium hover:text-blue-700"
                        >
                            Try it now →
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
