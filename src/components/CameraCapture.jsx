import React, { useRef, useState } from "react";
import VideoFeed from "./VideoFeed";

const CameraCapture = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const canvasRef = useRef(null);

  const captureImage = () => {
    const videoElement = document.querySelector("video");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL and set it as the captured image
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = "captured-image.png";
    link.click();
  };

  const resetCapture = () => {
    setCapturedImage(null); // Reset captured image to take a new photo
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Show video feed if no image has been captured */}
        {!capturedImage && <VideoFeed />}

        {/* Show captured image preview if available */}
        {capturedImage && (
          <div>
            <img
              src={capturedImage}
              alt="Captured Preview"
              style={{ width: "100%", maxWidth: "500px", marginBottom: "20px" }}
            />
            <div>
              <button onClick={downloadImage} style={{ marginRight: "10px" }}>
                Download Image
              </button>
              <button onClick={resetCapture}>Retake</button>
            </div>
          </div>
        )}
      </div>

      {/* Capture Image Button only shows when there's no captured image */}
      {!capturedImage && (
        <button onClick={captureImage} style={{ marginTop: "20px" }}>
          Capture Image
        </button>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
