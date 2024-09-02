import React, { useState } from "react";
import VideoFeed from "./components/VideoFeed";
import PointsOverlay from "./components/PointsOverlay";
import DistanceDisplay from "./components/DistanceDisplay";

function App() {
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(null);

  const handleVideoClick = (e) => {
    const videoRect = e.target.getBoundingClientRect();
    const x = e.clientX - videoRect.left;
    const y = e.clientY - videoRect.top;

    const newPoints = [...points, { x, y }];
    setPoints(newPoints);

    if (newPoints.length === 2) {
      const [p1, p2] = newPoints;
      const dist = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
      );
      setDistance(dist.toFixed(2));
    }
  };

  const resetMeasurement = () => {
    setPoints([]);
    setDistance(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Measurement App</h1>
      <div style={{ position: "relative", display: "inline-block" }}>
        <VideoFeed onVideoClick={handleVideoClick} />
        <PointsOverlay points={points} />
      </div>
      {distance && (
        <DistanceDisplay distance={distance} onReset={resetMeasurement} />
      )}
    </div>
  );
}

export default App;
