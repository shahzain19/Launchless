import { Sparkles, Github } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Auth() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="heading-font text-3xl font-bold gradient-text mb-2">
                        Launchless
                    </h1>
                    <p className="text-gray-600">
                        Sign in to continue
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <button
                        onClick={login}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium"
                    >
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
