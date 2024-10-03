import React from "react";
import CameraCapture from "./components/CameraCapture";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <h1>Camera Measure App</h1>
      <CameraCapture />
    </div>
  );
}

export default App;