import React, { useRef, useState } from "react";
import VideoFeed from "./VideoFeed";

const CameraCapture = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);

  const PPI = 429;
  const FOV = 77;
  const distance = 100;

  const calculateRealWorldDimensions = (pixelWidth, pixelHeight) => {
    // calc width and height in cm
    const fovRadians = (FOV * Math.PI) / 180;
    const realWorldWidth = 2 * distance * Math.tan(fovRadians / 2);

    const cmPerPixel = realWorldWidth / 1080;

    const objectWidth = pixelWidth * cmPerPixel;
    const objectHeight = pixelHeight * cmPerPixel;

    return { width: objectWidth, height: objectHeight };
  };

  const captureImage = () => {
    const videoElement = document.querySelector("video");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);

    const pixelWidth = canvas.width;
    const pixelHeight = canvas.height;

    const realDimensions = calculateRealWorldDimensions(pixelWidth, pixelHeight);
    setDimensions(realDimensions);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {!capturedImage && <VideoFeed />}

        {capturedImage && (
          <div>
            <img
              src={capturedImage}
              alt="Captured Preview"
              style={{ width: "100%", maxWidth: "500px", marginBottom: "20px" }}
            />
            <div>
              <p>Object Width: {dimensions.width.toFixed(2)} cm</p>
              <p>Object Height: {dimensions.height.toFixed(2)} cm</p>
              <button onClick={() => setCapturedImage(null)}>Retake</button>
            </div>
          </div>
        )}
      </div>

      {!capturedImage && (
        <button onClick={captureImage} style={{ marginTop: "20px" }}>
          Capture Image & Measure
        </button>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
