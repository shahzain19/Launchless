import { Link } from "react-router-dom";
import ScriptCard from "./ScriptCard";

interface Script {
    id: number;
    createdAt: string;
    type: string;
    shorts_script?: string;
    youtube_script?: string;
    teleprompter?: string[];
    shot_list?: Array<{
        type: "Talking Head" | "Screen Record";
        duration: string;
        visual: string;
        audio: string;
    }>;
}

interface ScriptsTabProps {
    scripts: Script[];
    projectId: number;
    projectName: string;
}

export default function ScriptsTab({ scripts, projectId, projectName }: ScriptsTabProps) {
    if (scripts.length === 0) {
        return (
            <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="text-6xl mb-4">🎬</div>
                <div className="text-xl font-medium text-gray-900 mb-2">Ready to create video content?</div>
                <div className="text-gray-600 mb-6 max-w-md mx-auto">
                    Generate professional video scripts, shot lists, and teleprompter notes for your product launch.
                </div>
                <div className="space-y-3">
                    <Link
                        to={`/generate?projectId=${projectId}&mode=video`}
                        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                        🎥 Generate Video Scripts
                    </Link>
                    <div className="text-sm text-gray-500">
                        Creates shot lists, scripts, and teleprompter notes
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-black flex items-center gap-2">
                    🎬 Video Scripts & Production
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        {scripts.length} script{scripts.length !== 1 ? 's' : ''} available
                    </span>
                </div>
            </div>

            {scripts.map((script) => (
                <ScriptCard key={script.id} script={script} projectName={projectName} />
            ))}
        </div>
    );
}
