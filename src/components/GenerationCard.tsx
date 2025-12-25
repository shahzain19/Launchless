import { useState } from "react";
import LaunchlessInsights from "./LaunchlessInsights";
import ContentSection from "./ContentSection";

interface Generation {
    id: number;
    type: string;
    content: {
        positioning?: string;
        core_hook?: string;
        product_hunt?: string | { headline: string; tagline: string; description: string; makers_comment: string };
        x_threads?: (string | object)[];
        linkedin?: string;
        followups?: string[];
        cta?: string;
        shot_list?: Array<{
            type: "Talking Head" | "Screen Record";
            duration: string;
            visual: string;
            audio: string;
        }>;
        teleprompter?: string[];
        total_estimated_duration?: string;
        shorts_script?: string;
        youtube_script?: string;
    };
    launchlessInsights: any;
    createdAt: string;
}

interface GenerationCardProps {
    generation: Generation;
}

export default function GenerationCard({ generation }: GenerationCardProps) {
    const [activeTab, setActiveTab] = useState<'content' | 'insights'>('content');
    
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        {new Date(generation.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {generation.type}
                    </span>
                </div>
                
                <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${
                            activeTab === 'content'
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-gray-600 hover:text-black'
                        }`}
                    >
                        Content
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${
                            activeTab === 'insights'
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-gray-600 hover:text-black'
                        }`}
                    >
                        Insights
                    </button>
                </div>
            </div>

            <div className="p-6">
                {activeTab === 'content' && (
                    generation.type === 'video' 
                        ? <VideoContent content={generation.content} />
                        : <TextContent content={generation.content} />
                )}
                
                {activeTab === 'insights' && generation.launchlessInsights && (
                    <LaunchlessInsights data={generation.launchlessInsights} />
                )}
            </div>
        </div>
    );
}

function TextContent({ content }: { content: Generation['content'] }) {
    return (
        <div className="space-y-6">
            {content.positioning && (
                <ContentSection title="Product Positioning" content={content.positioning} />
            )}
            
            {content.core_hook && (
                <ContentSection title="Core Hook" content={content.core_hook} />
            )}
            
            {content.product_hunt && (
                <ContentSection 
                    title="Product Hunt" 
                    content={
                        typeof content.product_hunt === 'string' 
                            ? content.product_hunt 
                            : `${content.product_hunt.headline}\n${content.product_hunt.tagline}\n\n${content.product_hunt.description}\n\nMaker's Comment:\n${content.product_hunt.makers_comment}`
                    } 
                />
            )}
            
            {content.x_threads && (
                <ContentSection 
                    title="X/Twitter Threads" 
                    content={
                        Array.isArray(content.x_threads)
                            ? content.x_threads.map(t => typeof t === 'string' ? t : JSON.stringify(t)).join('\n\n---\n\n')
                            : String(content.x_threads)
                    } 
                />
            )}
            
            {content.linkedin && (
                <ContentSection title="LinkedIn Post" content={content.linkedin} />
            )}
            
            {content.followups && (
                <ContentSection title="Follow-up Posts" content={content.followups.join('\n\n')} />
            )}
            
            {content.cta && (
                <ContentSection title="Call to Action" content={content.cta} />
            )}
        </div>
    );
}

function VideoContent({ content }: { content: Generation['content'] }) {
    return (
        <div className="space-y-6">
            {content.shot_list && content.shot_list.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-black">Shot List</h3>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                            {content.total_estimated_duration || '60s'}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {content.shot_list.map((shot, idx) => (
                            <div key={idx} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-200">
                                <div className="flex flex-col items-center min-w-[50px]">
                                    <span className="text-lg font-bold text-gray-500">#{idx + 1}</span>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full mt-1">
                                        {shot.duration}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                                            shot.type.includes('Head')
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {shot.type}
                                        </span>
                                    </div>
                                    <div className="text-sm text-black">
                                        <span className="text-gray-500">Visual:</span> {shot.visual}
                                    </div>
                                    <div className="text-sm text-gray-600 italic">
                                        <span className="text-gray-500">Audio:</span> "{shot.audio}"
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {content.teleprompter && content.teleprompter.length > 0 && (
                <ContentSection 
                    title="Teleprompter Notes" 
                    content={content.teleprompter.map(note => `• ${note}`).join('\n')} 
                />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.shorts_script && (
                    <ContentSection title="Short-form Script (60s)" content={content.shorts_script} />
                )}
                
                {content.youtube_script && (
                    <ContentSection title="Long-form Script (3-5min)" content={content.youtube_script} />
                )}
            </div>
        </div>
    );
}
