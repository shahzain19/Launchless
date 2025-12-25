import { Link } from "react-router-dom";

interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
}

interface ProjectHeaderProps {
    project: Project;
    onDuplicate: () => void;
    onStatusClick: () => void;
}

export default function ProjectHeader({ project, onDuplicate, onStatusClick }: ProjectHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Link to="/projects" className="text-gray-600 hover:text-black">
                        ← Projects
                    </Link>
                    <span className="text-gray-400">/</span>
                    <h1 className="text-2xl font-bold text-black">{project.name}</h1>
                </div>
                {project.description && (
                    <p className="text-gray-600">{project.description}</p>
                )}
            </div>
            
            <div className="flex items-center gap-3">
                <button
                    onClick={onDuplicate}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-black border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                    Duplicate
                </button>
                <Link
                    to={`/generate?projectId=${project.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Generate Content
                </Link>
                <button
                    onClick={onStatusClick}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                        project.status === 'published' ? 'bg-green-100 text-green-700' :
                        project.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                    }`}
                >
                    {project.status}
                </button>
            </div>
        </div>
    );
}
