import { useState } from "react";
import { X, Check, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
}

const steps = [
    {
        title: "Welcome to Launchless! 🚀",
        description: "Generate launch content, find potential customers, and manage your product launches all in one place.",
        image: "🎯",
        tips: [
            "Create projects to organize your launches",
            "Generate content for multiple platforms",
            "Find early adopters with Signal Finder"
        ]
    },
    {
        title: "Create Your First Project",
        description: "Projects help you organize all your launch materials in one place.",
        image: "📁",
        tips: [
            "Add your GitHub repo or website URL",
            "Describe your product clearly",
            "Track all your content generations"
        ]
    },
    {
        title: "Generate Launch Content",
        description: "AI-powered content generation for Product Hunt, Twitter, LinkedIn, and more.",
        image: "✨",
        tips: [
            "Get Product Hunt posts in seconds",
            "Generate Twitter threads automatically",
            "Create LinkedIn announcements",
            "Generate video scripts and shot lists"
        ]
    },
    {
        title: "Find Your First Customers",
        description: "Signal Finder helps you discover people who need your product right now.",
        image: "🔍",
        tips: [
            "Scan GitHub for recent deployments",
            "Find Reddit posts asking for solutions",
            "Get personalized conversation starters",
            "Track leads and engagement"
        ]
    },
    {
        title: "You're All Set! 🎉",
        description: "Ready to launch? Create your first project and start generating content.",
        image: "🚀",
        tips: [
            "Start with a small project to test",
            "Use Signal Finder to validate demand",
            "Iterate based on feedback",
            "Launch with confidence"
        ]
    }
];

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
                    <button
                        onClick={onSkip}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="text-6xl mb-4">{step.image}</div>
                    <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                    <p className="text-blue-100">{step.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 h-1">
                    <div 
                        className="bg-blue-600 h-1 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="space-y-3 mb-8">
                        {step.tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                                    <Check className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-gray-700">{tip}</p>
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {steps.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentStep
                                            ? "bg-blue-600 w-8"
                                            : index < currentStep
                                            ? "bg-blue-300"
                                            : "bg-gray-300"
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <button
                                    onClick={handlePrevious}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                            )}
                            
                            <button
                                onClick={handleNext}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                            >
                                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Skip Button */}
                    <div className="text-center mt-6">
                        <button
                            onClick={onSkip}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Skip tutorial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
