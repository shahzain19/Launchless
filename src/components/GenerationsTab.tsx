import { Link } from "react-router-dom";
import GenerationCard from "./GenerationCard";

interface Generation {
    id: number;
    type: string;
    content: any;
    launchlessInsights: any;
    createdAt: string;
}

interface GenerationsTabProps {
    generations: Generation[];
    projectId: number;
}

export default function GenerationsTab({ generations, projectId }: GenerationsTabProps) {
    if (generations.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-600 mb-4">No content generated yet</div>
                <Link
                    to={`/generate?projectId=${projectId}`}
                    className="text-blue-600 hover:text-blue-700"
                >
                    Generate your first content →
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {generations.map((generation) => (
                <GenerationCard key={generation.id} generation={generation} />
            ))}
        </div>
    );
}
