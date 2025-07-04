import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DrawingPage from "./pages/DrawingPage";
import BackgroundDoodle from "./components/BackgroundDoodle";

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <MainShell />
    </Router>
  );
}

// PUBLIC_INTERFACE
function MainShell() {
  const location = useLocation();
  return (
    <div className="relative min-h-screen bg-bgPaper overflow-x-hidden">
      <BackgroundDoodle />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/drawing" element={<DrawingPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
