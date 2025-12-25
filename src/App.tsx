import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Generator from "./pages/Generator";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Debug from "./pages/Debug";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page without layout */}
          <Route path="/" element={<Landing />} />
          
          {/* App routes with layout */}
          <Route path="/app" element={<Layout><Generator /></Layout>} />
          <Route path="/generate" element={<Layout><Generator /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/projects/:id" element={<Layout><ProjectDetail /></Layout>} />
          <Route path="/debug" element={<Layout><Debug /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
