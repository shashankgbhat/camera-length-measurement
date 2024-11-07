import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CameraCapture from "./components/CameraCapture";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/capture" element={<CameraCapture />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
