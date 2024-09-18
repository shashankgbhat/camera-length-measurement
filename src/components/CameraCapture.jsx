import React, { useRef, useState } from "react";
import VideoFeed from "./VideoFeed";

const CameraCapture = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [objectDimensions, setObjectDimensions] = useState({ width: 0, height: 0 });
  const [selecting, setSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const startPoint = useRef({ x: 0, y: 0 });

  const PPI = 429;
  const FOV = 77;
  const distance = 100;

  const calculateRealWorldDimensions = (pixelWidth, pixelHeight) => {
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

  const handleTouchStart = (e) => {
    if (!capturedImage) return;
    setSelecting(true);
    const rect = imgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startPoint.current = { x, y };
    setSelectionBox({ x, y, width: 0, height: 0 });
  };

  const handleTouchMove = (e) => {
    if (!selecting) return;
    const rect = imgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const width = x - startPoint.current.x;
    const height = y - startPoint.current.y;
    setSelectionBox({ x: startPoint.current.x, y: startPoint.current.y, width, height });
  };

  const handleTouchEnd = () => {
    setSelecting(false);
    const objectWidthPixels = Math.abs(selectionBox.width);
    const objectHeightPixels = Math.abs(selectionBox.height);
    const objectRealDimensions = calculateRealWorldDimensions(objectWidthPixels, objectHeightPixels);
    setObjectDimensions(objectRealDimensions);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {!capturedImage && <VideoFeed />}

        {capturedImage && (
          <div
            style={{ position: "relative", display: "inline-block" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              ref={imgRef}
              src={capturedImage}
              alt="Captured Preview"
              style={{ width: "100%", maxWidth: "500px", marginBottom: "20px", position: "relative" }}
            />
            {selecting && (
              <div
                style={{
                  position: "absolute",
                  border: "2px dashed red",
                  left: `${selectionBox.x}px`,
                  top: `${selectionBox.y}px`,
                  width: `${selectionBox.width}px`,
                  height: `${selectionBox.height}px`,
                }}
              />
            )}
            <div>
              <p>Object Width: {objectDimensions.width.toFixed(2)} cm</p>
              <p>Object Height: {objectDimensions.height.toFixed(2)} cm</p>
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