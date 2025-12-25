interface Project {
    github: string;
    website: string;
    updatedAt: string;
}

interface ProjectInfoProps {
    project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
    return (
        <div className="bg-gray-50 border border-gray-200 p-6 mb-8 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <div className="text-sm text-gray-500 mb-1">GitHub Repository</div>
                    {project.github ? (
                        <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                            {project.github.replace('https://github.com/', '')}
                        </a>
                    ) : (
                        <span className="text-gray-500 text-sm">Not set</span>
                    )}
                </div>
                <div>
                    <div className="text-sm text-gray-500 mb-1">Website</div>
                    {project.website ? (
                        <a 
                            href={project.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                            {project.website}
                        </a>
                    ) : (
                        <span className="text-gray-500 text-sm">Not set</span>
                    )}
                </div>
                <div>
                    <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                    <span className="text-black text-sm">
                        {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
