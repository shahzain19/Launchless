import { useState } from "react";

interface BuyerType {
    buyer_type: string;
    confidence: number;
    reasoning: string;
    tone_adjustments: {
        formality: string;
        urgency: string;
        social_proof: string;
    };
}

interface DemandCheck {
    category: string;
    severity: string;
    strongest_angle: string;
    red_flags: string[];
    suggested_pivot: string;
    market_size_signal: string;
}

interface PhraseFilter {
    original: string;
    filtered: string;
    changes_made: boolean;
    banned_phrases_found: boolean;
}

interface SoftCTA {
    style: string;
    text: string;
    context: string;
}

interface Objection {
    objection: string;
    preemption: string;
    placement: string;
}

interface CredibilityLine {
    type: string;
    line: string;
    placement: string;
}

interface LaunchlessData {
    buyer_type: BuyerType;
    demand_check: DemandCheck;
    phrase_filter: PhraseFilter;
    soft_ctas: { ctas: SoftCTA[] };
    objections: { objections: Objection[]; integrated_copy: string };
    credibility: { credibility_lines: CredibilityLine[]; founder_story: string };
    first_reply?: { replies: any[] };
    worth_building?: any;
    traffic_light?: {
        light: string;
        score: number;
        action: string;
        message: string;
        signals: string[];
        breakdown: any;
    };
}

interface LaunchlessInsightsProps {
    data: LaunchlessData;
}

export default function LaunchlessInsights({ data }: LaunchlessInsightsProps) {
    const [activeTab, setActiveTab] = useState<string>("traffic-light");

    const tabs = [
        { id: "traffic-light", label: "🚦 Verdict", icon: "🚦" },
        { id: "buyer-type", label: "🎯 Buyer Type", icon: "🎯" },
        { id: "demand-check", label: "⚡ Demand Check", icon: "⚡" },
        { id: "phrase-filter", label: "🚫 Phrase Filter", icon: "🚫" },
        { id: "soft-ctas", label: "💬 Soft CTAs", icon: "💬" },
        { id: "first-reply", label: "💬 First Reply", icon: "💬" },
        { id: "objections", label: "🛡️ Objections", icon: "🛡️" },
        { id: "credibility", label: "👤 Credibility", icon: "👤" },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
            default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'pain_driven': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'nice_to_have': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'builder_only': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'cool_but_unclear': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 space-y-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">L</span>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Launchless Insights</h2>
                    <p className="text-sm text-zinc-400">Founder-grade launch intelligence</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === tab.id
                                ? "bg-white text-black"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                        }`}
                    >
                        <span className="mr-1.5">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
                {activeTab === "traffic-light" && data.traffic_light && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                                data.traffic_light.light === 'green' ? 'bg-green-500/20 text-green-400 border-2 border-green-500/40' :
                                data.traffic_light.light === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/40' :
                                'bg-red-500/20 text-red-400 border-2 border-red-500/40'
                            }`}>
                                {data.traffic_light.light === 'green' ? '🟢' : 
                                 data.traffic_light.light === 'yellow' ? '🟡' : '🔴'}
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white">{data.traffic_light.action}</div>
                                <div className="text-sm text-zinc-400">Score: {data.traffic_light.score}/100</div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${
                            data.traffic_light.light === 'green' ? 'bg-green-500/10 border-green-500/20' :
                            data.traffic_light.light === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20' :
                            'bg-red-500/10 border-red-500/20'
                        }`}>
                            <p className={`text-sm ${
                                data.traffic_light.light === 'green' ? 'text-green-300' :
                                data.traffic_light.light === 'yellow' ? 'text-yellow-300' :
                                'text-red-300'
                            }`}>
                                {data.traffic_light.message}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-zinc-300">Signals Detected:</div>
                            {data.traffic_light.signals.map((signal, idx) => (
                                <div key={idx} className="text-sm text-zinc-400 bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
                                    {signal}
                                </div>
                            ))}
                        </div>

                        {data.worth_building && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <div className="text-sm font-medium text-blue-400 mb-2">📊 Worth Building Analysis</div>
                                <p className="text-sm text-blue-300 mb-3">{data.worth_building.reasoning}</p>
                                <div className="space-y-2">
                                    {data.worth_building.next_steps?.map((step, idx) => (
                                        <div key={idx} className="text-sm text-blue-300">• {step}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "first-reply" && data.first_reply && (
                    <div className="space-y-3">
                        {data.first_reply.replies.map((reply, idx) => (
                            <div key={idx} className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-4 hover:border-zinc-700/50 transition-all">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded">
                                        {reply.type?.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-zinc-500">{reply.timing}</span>
                                </div>
                                <p className="text-sm font-medium text-zinc-200 mb-2">"{reply.text}"</p>
                                <p className="text-xs text-zinc-400 mb-2">{reply.purpose}</p>
                                <button
                                    onClick={() => navigator.clipboard.writeText(reply.text)}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Copy Reply
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === "buyer-type" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-sm font-bold rounded-lg ${getCategoryColor(data.buyer_type.buyer_type)}`}>
                                {data.buyer_type.buyer_type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-zinc-400">
                                {Math.round(data.buyer_type.confidence * 100)}% confidence
                            </span>
                        </div>
                        <p className="text-sm text-zinc-300">{data.buyer_type.reasoning}</p>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Formality</div>
                                <div className="text-sm font-medium text-zinc-200">{data.buyer_type.tone_adjustments.formality}</div>
                            </div>
                            <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Urgency</div>
                                <div className="text-sm font-medium text-zinc-200">{data.buyer_type.tone_adjustments.urgency}</div>
                            </div>
                            <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Social Proof</div>
                                <div className="text-sm font-medium text-zinc-200">{data.buyer_type.tone_adjustments.social_proof}</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "demand-check" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-sm font-bold rounded-lg ${getCategoryColor(data.demand_check.category)}`}>
                                {data.demand_check.category.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(data.demand_check.severity)}`}>
                                {data.demand_check.severity} severity
                            </span>
                        </div>
                        
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <div className="text-sm font-medium text-green-400 mb-2">💡 Strongest Angle</div>
                            <p className="text-sm text-green-300">{data.demand_check.strongest_angle}</p>
                        </div>

                        {data.demand_check.red_flags.length > 0 && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <div className="text-sm font-medium text-red-400 mb-2">🚩 Red Flags</div>
                                <ul className="space-y-1">
                                    {data.demand_check.red_flags.map((flag, idx) => (
                                        <li key={idx} className="text-sm text-red-300">• {flag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="text-sm font-medium text-blue-400 mb-2">🔄 Suggested Pivot</div>
                            <p className="text-sm text-blue-300">{data.demand_check.suggested_pivot}</p>
                        </div>
                    </div>
                )}

                {activeTab === "phrase-filter" && (
                    <div className="space-y-4">
                        {data.phrase_filter.changes_made ? (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                <div className="text-sm font-medium text-yellow-400 mb-2">⚠️ Generic Phrases Detected & Filtered</div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Before</div>
                                        <p className="text-sm text-zinc-400 bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
                                            {data.phrase_filter.original}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">After</div>
                                        <p className="text-sm text-zinc-200 bg-green-500/10 p-2 rounded border border-green-500/20">
                                            {data.phrase_filter.filtered}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                <div className="text-sm font-medium text-green-400 mb-2">✅ Clean Copy</div>
                                <p className="text-sm text-green-300">No generic phrases or buzzwords detected. Your copy is clean!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "soft-ctas" && (
                    <div className="space-y-3">
                        {data.soft_ctas.ctas.map((cta, idx) => (
                            <div key={idx} className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-4 hover:border-zinc-700/50 transition-all">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded">
                                        {cta.style}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-zinc-200 mb-2">"{cta.text}"</p>
                                <p className="text-xs text-zinc-400">{cta.context}</p>
                                <button
                                    onClick={() => navigator.clipboard.writeText(cta.text)}
                                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Copy CTA
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "objections" && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            {data.objections.objections.map((obj, idx) => (
                                <div key={idx} className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-4">
                                    <div className="text-sm font-medium text-red-400 mb-2">
                                        🤔 "{obj.objection}"
                                    </div>
                                    <div className="text-sm text-zinc-300 mb-2">
                                        <span className="text-zinc-500">Pre-emption:</span> {obj.preemption}
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Place in: {obj.placement}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="text-sm font-medium text-blue-400 mb-2">📝 Integrated Example</div>
                            <p className="text-sm text-blue-300 whitespace-pre-wrap">{data.objections.integrated_copy}</p>
                        </div>
                    </div>
                )}

                {activeTab === "credibility" && (
                    <div className="space-y-4">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                            <div className="text-sm font-medium text-purple-400 mb-2">📖 Founder Story</div>
                            <p className="text-sm text-purple-300">{data.credibility.founder_story}</p>
                        </div>
                        
                        <div className="space-y-3">
                            {data.credibility.credibility_lines.map((line, idx) => (
                                <div key={idx} className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded">
                                            {line.type.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-zinc-500">
                                            {line.placement}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-200">"{line.line}"</p>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(line.line)}
                                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Copy Line
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}