import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchFilterProps {
    onSearch: (query: string) => void;
    onFilter: (filters: FilterOptions) => void;
    placeholder?: string;
    showFilters?: boolean;
}

interface FilterOptions {
    status?: string;
    platform?: string;
    dateRange?: string;
    sortBy?: string;
}

export default function SearchFilter({ 
    onSearch, 
    onFilter, 
    placeholder = "Search...",
    showFilters = true 
}: SearchFilterProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        status: "",
        platform: "",
        dateRange: "",
        sortBy: "newest"
    });

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearch(value);
    };

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            status: "",
            platform: "",
            dateRange: "",
            sortBy: "newest"
        };
        setFilters(clearedFilters);
        onFilter(clearedFilters);
    };

    const activeFilterCount = Object.values(filters).filter(v => v && v !== "newest").length;

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => handleSearchChange("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {showFilters && (
                    <button
                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                        className={`px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                            showFilterPanel || activeFilterCount > 0
                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && showFilterPanel && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Filters</h3>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All</option>
                                <option value="draft">Draft</option>
                                <option value="ready">Ready</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        {/* Platform Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Platform
                            </label>
                            <select
                                value={filters.platform}
                                onChange={(e) => handleFilterChange("platform", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All</option>
                                <option value="twitter">Twitter/X</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="product_hunt">Product Hunt</option>
                                <option value="reddit">Reddit</option>
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Range
                            </label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All time</option>
                                <option value="today">Today</option>
                                <option value="week">This week</option>
                                <option value="month">This month</option>
                                <option value="year">This year</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort By
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="name">Name A-Z</option>
                                <option value="updated">Recently updated</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
