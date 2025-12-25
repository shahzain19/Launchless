interface Shot {
    type: "Talking Head" | "Screen Record";
    duration: string;
    visual: string;
    audio: string;
}

interface Script {
    id: number;
    createdAt: string;
    shorts_script?: string;
    youtube_script?: string;
    teleprompter?: string[];
    shot_list?: Shot[];
}

interface ScriptCardProps {
    script: Script;
    projectName: string;
}

export default function ScriptCard({ script, projectName }: ScriptCardProps) {
    const exportScript = () => {
        const exportData = {
            project: projectName,
            generated: script.createdAt,
            shot_list: script.shot_list,
            scripts: {
                shorts: script.shorts_script,
                youtube: script.youtube_script
            },
            teleprompter: script.teleprompter
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}-video-plan.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportShotListCSV = () => {
        if (!script.shot_list) return;
        
        const csvContent = script.shot_list.map((shot, idx) => 
            `${idx + 1},"${shot.type}","${shot.duration}","${shot.visual}","${shot.audio}"`
        ).join('\n');
        const csv = `Shot,Type,Duration,Visual,Audio\n${csvContent}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}-shot-list.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                            {new Date(script.createdAt).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                            🎬 Video Production Plan
                        </span>
                    </div>
                    <button
                        onClick={exportScript}
                        className="text-xs text-purple-600 hover:text-purple-700 px-2 py-1 rounded-md hover:bg-purple-50 transition-colors"
                    >
                        📤 Export
                    </button>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                {/* Production Overview */}
                <ProductionOverview shotList={script.shot_list} />

                {/* Shot List */}
                {script.shot_list && script.shot_list.length > 0 && (
                    <ShotList shotList={script.shot_list} onExportCSV={exportShotListCSV} />
                )}

                {/* Scripts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {script.shorts_script && (
                        <ScriptSection 
                            title="📱 Short-form Script (60s)" 
                            content={script.shorts_script}
                            subtitle="Perfect for TikTok, Instagram Reels, YouTube Shorts"
                        />
                    )}
                    
                    {script.youtube_script && (
                        <ScriptSection 
                            title="🎥 Long-form Script (3-5min)" 
                            content={script.youtube_script}
                            subtitle="Perfect for YouTube, detailed product demos"
                            maxHeight="max-h-64"
                        />
                    )}
                </div>

                {/* Teleprompter */}
                {script.teleprompter && script.teleprompter.length > 0 && (
                    <TeleprompterSection teleprompter={script.teleprompter} />
                )}

                {/* Production Checklist */}
                <ProductionChecklist />
            </div>
        </div>
    );
}

function ProductionOverview({ shotList }: { shotList?: Shot[] }) {
    const totalShots = shotList?.length || 0;
    const totalDuration = shotList?.reduce((acc, shot) => {
        const seconds = parseInt(shot.duration?.replace(/[^0-9]/g, '') || '0');
        return acc + seconds;
    }, 0) || 0;
    const talkingHeadCount = shotList?.filter(s => s.type === 'Talking Head').length || 0;
    const screenRecordCount = shotList?.filter(s => s.type === 'Screen Record').length || 0;

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-black mb-3 flex items-center gap-2">
                📊 Production Overview
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{totalShots}</div>
                    <div className="text-xs text-gray-600">Shots</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{totalDuration}s</div>
                    <div className="text-xs text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{talkingHeadCount}</div>
                    <div className="text-xs text-gray-600">Face Cam</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{screenRecordCount}</div>
                    <div className="text-xs text-gray-600">Screen</div>
                </div>
            </div>
        </div>
    );
}

function ShotList({ shotList, onExportCSV }: { shotList: Shot[]; onExportCSV: () => void }) {
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-black flex items-center gap-2">
                    🎬 Shot List
                </h4>
                <button
                    onClick={onExportCSV}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                    📊 Export CSV
                </button>
            </div>
            <div className="space-y-3">
                {shotList.map((shot, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-col items-center min-w-[50px]">
                            <span className="text-lg font-bold text-gray-600">#{idx + 1}</span>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                                {shot.duration}
                            </span>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${
                                    shot.type.includes('Head')
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {shot.type === 'Talking Head' ? '👤' : '🖥️'} {shot.type}
                                </span>
                            </div>
                            <div className="text-sm text-black">
                                <span className="text-gray-500 font-medium">Visual:</span> {shot.visual}
                            </div>
                            <div className="text-sm text-gray-600 italic">
                                <span className="text-gray-500 font-medium">Audio:</span> "{shot.audio}"
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ScriptSection({ 
    title, 
    content, 
    subtitle, 
    maxHeight 
}: { 
    title: string; 
    content: string; 
    subtitle: string;
    maxHeight?: string;
}) {
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-black text-sm flex items-center gap-2">
                    {title}
                </h4>
                <button
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                    Copy
                </button>
            </div>
            <div className={`text-sm text-black whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border ${maxHeight || ''} overflow-y-auto`}>
                {content}
            </div>
            <div className="mt-2 text-xs text-gray-500">
                {subtitle}
            </div>
        </div>
    );
}

function TeleprompterSection({ teleprompter }: { teleprompter: string[] }) {
    const content = teleprompter.map(note => `• ${note}`).join('\n');
    
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-black text-sm flex items-center gap-2">
                    📋 Teleprompter Notes
                </h4>
                <button
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                    Copy
                </button>
            </div>
            <div className="text-sm text-black whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border">
                {content}
            </div>
            <div className="mt-2 text-xs text-gray-500">
                Key talking points for smooth recording
            </div>
        </div>
    );
}

function ProductionChecklist() {
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-black mb-3 flex items-center gap-2">
                ✅ Production Checklist
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Camera/phone positioned and tested</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Screen recording software ready</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Audio levels checked</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Lighting setup complete</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Background/environment prepared</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Script reviewed and practiced</span>
                </label>
            </div>
        </div>
    );
}
