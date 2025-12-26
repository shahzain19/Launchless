import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Generator from "./pages/Generator";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Debug from "./pages/Debug";

// Protected Route wrapper - auto redirects to GitHub
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Auto redirect to GitHub login
    login();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Redirecting to GitHub...</div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<Landing />} />
      
      {/* Protected routes - auto redirect to GitHub if not authenticated */}
      <Route path="/app" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
      <Route path="/generate" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/debug" element={<ProtectedRoute><Debug /></ProtectedRoute>} />
      
      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
