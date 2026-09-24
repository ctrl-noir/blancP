import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  NavBar from "../src/components/Navigation";
import Dashboard from "./pages/Dashboard";
import NoteApp from "./pages/NoteApp";
import HabitPage from "./pages/HabitPage";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notes" element={<NoteApp />} />
          <Route path="/database" element={< HabitPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}

export default App;
