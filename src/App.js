import React, { useRef } from "react";
import VideoFeed from "./components/VideoFeed";

function App() {
  const canvasRef = useRef(null);

  const captureImage = () => {
    const videoElement = document.querySelector("video");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "captured-image.png";
    link.click();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Camera Capture App</h1>
      <div style={{ position: "relative", display: "inline-block" }}>
        <VideoFeed />
      </div>

      <button onClick={captureImage} style={{ marginTop: "20px" }}>
        Capture Image
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;
