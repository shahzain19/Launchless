import { Link } from "react-router-dom";
import GenerationCard from "./GenerationCard";

interface Generation {
    id: number;
    type: string;
    content: any;
    launchlessInsights: any;
    createdAt: string;
}

interface Post {
    status: string;
}

interface OverviewTabProps {
    generations: Generation[];
    postsCount: number;
    publishedPostsCount: number;
    projectId: number;
}

export default function OverviewTab({ 
    generations, 
    postsCount, 
    publishedPostsCount,
    projectId 
}: OverviewTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                    <div className="text-2xl font-bold text-black mb-1">{generations.length}</div>
                    <div className="text-sm text-gray-600">Content Generations</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                    <div className="text-2xl font-bold text-black mb-1">{postsCount}</div>
                    <div className="text-sm text-gray-600">Posts Created</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                    <div className="text-2xl font-bold text-black mb-1">{publishedPostsCount}</div>
                    <div className="text-sm text-gray-600">Posts Published</div>
                </div>
            </div>

            {generations.length > 0 && (
                <div>
                    <h2 className="text-lg font-medium text-black mb-4">Latest Generation</h2>
                    <GenerationCard generation={generations[0]} />
                </div>
            )}
        </div>
    );
}
