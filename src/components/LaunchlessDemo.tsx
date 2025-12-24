import { useState } from "react";

const demoData = {
    buyer_type: {
        buyer_type: "indie_builder",
        confidence: 0.85,
        reasoning: "GitHub-first product with developer tooling focus suggests indie builders who code and ship regularly",
        tone_adjustments: {
            formality: "casual",
            urgency: "medium", 
            social_proof: "community"
        }
    },
    demand_check: {
        category: "pain_driven",
        severity: "medium",
        strongest_angle: "Eliminates the marketing paralysis that kills 80% of great products",
        red_flags: ["Might be too niche initially"],
        suggested_pivot: "Focus on the 'launch anxiety' angle rather than general marketing",
        market_size_signal: "medium"
    },
    phrase_filter: {
        original: "Unleash your product's potential with our revolutionary AI-powered solution that transforms how you launch",
        filtered: "Use AI to change how you launch products",
        changes_made: true,
        banned_phrases_found: true
    },
    soft_ctas: {
        ctas: [
            {
                style: "curiosity",
                text: "DM me if you've been sitting on a finished product for weeks",
                context: "Perfect for indie builders who relate to launch paralysis"
            },
            {
                style: "feedback", 
                text: "Would love feedback from founders who hate marketing",
                context: "Invites the exact target audience to engage"
            },
            {
                style: "limited",
                text: "Testing this with 5 indie hackers this week",
                context: "Creates urgency without being pushy"
            }
        ]
    },
    objections: {
        objections: [
            {
                objection: "Why not just use ChatGPT?",
                preemption: "Built this because generic prompts give generic results",
                placement: "middle"
            },
            {
                objection: "I could build this myself",
                preemption: "Took me 3 months to get the prompts right - you probably have better things to build",
                placement: "end"
            }
        ],
        integrated_copy: "Built this because generic ChatGPT prompts give generic results. Took me 3 months to get the founder-grade prompts right - you probably have better things to build."
    },
    credibility: {
        credibility_lines: [
            {
                type: "pain_experience",
                line: "I built this because I kept shipping things and never launching them",
                placement: "intro"
            },
            {
                type: "technical_depth", 
                line: "After analyzing 200+ successful launches, found 6 patterns that actually work",
                placement: "middle"
            }
        ],
        founder_story: "Shipped 4 side projects that got zero users because I never launched them properly. This is my attempt to solve launch paralysis for builders like me."
    },
    first_reply: {
        replies: [
            {
                type: "pinned_reply",
                text: "For context: this came from my own launch anxiety. Happy to share the research that led to these 6 features 🧵",
                timing: "Pin immediately after posting",
                purpose: "Adds credibility and invites deeper engagement"
            },
            {
                type: "conversation_starter",
                text: "Curious - what's the longest you've sat on a finished product before launching?",
                timing: "30 minutes after initial post",
                purpose: "Gets people sharing their own experiences"
            }
        ]
    },
    traffic_light: {
        light: "green",
        score: 78,
        action: "Ship it",
        message: "Strong signals. Build with confidence.",
        signals: [
            "✅ Solves real pain",
            "✅ Clear target audience", 
            "✅ Medium market",
            "⚠️ 1 red flags"
        ],
        breakdown: {
            demand: "pain_driven",
            market: "medium",
            audience_clarity: 0.85,
            red_flags: 1
        }
    },
    worth_building: {
        verdict: "double_down",
        confidence: 0.82,
        reasoning: "Clear pain point with engaged target audience. Market validation through founder community engagement.",
        next_steps: [
            "Build MVP with core 6 features",
            "Test with 10 indie builders",
            "Iterate based on feedback"
        ],
        timeline: "2-4 weeks for initial validation"
    }
};

export default function LaunchlessDemo() {
    const [showDemo, setShowDemo] = useState(false);

    if (!showDemo) {
        return (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4 mb-6 text-center">
                <div className="mb-3">
                    <h3 className="text-sm font-medium text-white mb-1">✨ Powered by Launchless Features</h3>
                    <p className="text-xs text-zinc-400">6 founder-grade features that enhance your launch content</p>
                </div>
                <button
                    onClick={() => setShowDemo(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                    See what makes it special →
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">🎯 Launchless Features Demo</h3>
                <button
                    onClick={() => setShowDemo(false)}
                    className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                    Hide Demo
                </button>
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Buyer Type Detection */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🎯</span>
                        <h4 className="font-semibold text-white">Buyer-Type Detection</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded">
                                {demoData.buyer_type.buyer_type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-zinc-400">
                                {Math.round(demoData.buyer_type.confidence * 100)}% confidence
                            </span>
                        </div>
                        <p className="text-sm text-zinc-300">{demoData.buyer_type.reasoning}</p>
                    </div>
                </div>

                {/* Demand Reality Check */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">⚡</span>
                        <h4 className="font-semibold text-white">Demand Reality Check</h4>
                    </div>
                    <div className="space-y-2">
                        <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded">
                            {demoData.demand_check.category.replace('_', ' ').toUpperCase()}
                        </span>
                        <p className="text-sm text-zinc-300">{demoData.demand_check.strongest_angle}</p>
                    </div>
                </div>

                {/* Phrase Filter */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🚫</span>
                        <h4 className="font-semibold text-white">"What Not To Say" Filter</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="text-xs text-zinc-500">Before:</div>
                        <p className="text-sm text-red-300 bg-red-500/10 p-2 rounded border border-red-500/20">
                            {demoData.phrase_filter.original}
                        </p>
                        <div className="text-xs text-zinc-500">After:</div>
                        <p className="text-sm text-green-300 bg-green-500/10 p-2 rounded border border-green-500/20">
                            {demoData.phrase_filter.filtered}
                        </p>
                    </div>
                </div>

                {/* Soft CTA Engine */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">💬</span>
                        <h4 className="font-semibold text-white">Soft CTA Engine</h4>
                    </div>
                    <div className="space-y-2">
                        {demoData.soft_ctas.ctas.slice(0, 2).map((cta, idx) => (
                            <div key={idx} className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
                                <p className="text-sm text-zinc-200">"{cta.text}"</p>
                                <p className="text-xs text-zinc-500 mt-1">{cta.style}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Objection Pre-Emption */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🛡️</span>
                        <h4 className="font-semibold text-white">Objection Pre-Emption</h4>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-zinc-300">{demoData.objections.integrated_copy}</p>
                        <div className="text-xs text-zinc-500">
                            ↑ Addresses "Why not ChatGPT?" and "I could build this" before they ask
                        </div>
                    </div>
                </div>

                {/* Founder Credibility */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">👤</span>
                        <h4 className="font-semibold text-white">Founder Credibility</h4>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-zinc-300">"{demoData.credibility.credibility_lines[0].line}"</p>
                        <div className="text-xs text-zinc-500">
                            Authentic builder signal that creates trust
                        </div>
                    </div>
                </div>
            </div>

            {/* Traffic Light Summary */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 text-green-400 border-2 border-green-500/40 rounded-full flex items-center justify-center text-xl">
                        🟢
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white">{demoData.traffic_light.action}</div>
                        <div className="text-sm text-zinc-400">Score: {demoData.traffic_light.score}/100</div>
                    </div>
                </div>
                <p className="text-green-300 mb-4">{demoData.traffic_light.message}</p>
                <div className="text-sm text-zinc-400">
                    This is what you'd see after generating content with Launchless features enabled.
                </div>
            </div>
        </div>
    );
}