import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Generator from "./pages/Generator";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Debug from "./pages/Debug";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Generator />} />
        <Route path="/generate" element={<Generator />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/debug" element={<Debug />} />
      </Routes>
    </BrowserRouter>
  );
}
