import React, { useRef, useState } from "react";
import VideoFeed from "./VideoFeed";

const CameraCapture = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [objectDimensions, setObjectDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [selectionBox, setSelectionBox] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const [draggingCorner, setDraggingCorner] = useState(null);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

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

    const realDimensions = calculateRealWorldDimensions(
      pixelWidth,
      pixelHeight
    );
    setDimensions(realDimensions);

    const initWidth = pixelWidth * 0.5;
    const initHeight = pixelHeight * 0.5;
    const initX1 = (pixelWidth - initWidth) / 2;
    const initY1 = (pixelHeight - initHeight) / 2;
    const initX2 = initX1 + initWidth;
    const initY2 = initY1 + initHeight;
    setSelectionBox({ x1: initX1, y1: initY1, x2: initX2, y2: initY2 });
  };

  const handleDragStart = (e, corner) => {
    e.preventDefault();
    setDraggingCorner(corner);
  };

  const handleDragMove = (e) => {
    if (!draggingCorner) return;
    const rect = imgRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setSelectionBox((prevBox) => {
      let newBox = { ...prevBox };
      switch (draggingCorner) {
        case "top-left":
          newBox.x1 = x;
          newBox.y1 = y;
          break;
        case "top-right":
          newBox.x2 = x;
          newBox.y1 = y;
          break;
        case "bottom-left":
          newBox.x1 = x;
          newBox.y2 = y;
          break;
        case "bottom-right":
          newBox.x2 = x;
          newBox.y2 = y;
          break;
        default:
          break;
      }
      return newBox;
    });
  };

  const handleDragEnd = () => {
    setDraggingCorner(null);
    const objectWidthPixels = Math.abs(selectionBox.x2 - selectionBox.x1);
    const objectHeightPixels = Math.abs(selectionBox.y2 - selectionBox.y1);
    const objectRealDimensions = calculateRealWorldDimensions(
      objectWidthPixels,
      objectHeightPixels
    );
    setObjectDimensions(objectRealDimensions);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {!capturedImage && <VideoFeed />}

        {capturedImage && (
          <div
            style={{ position: "relative", display: "inline-block" }}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
          >
            <img
              ref={imgRef}
              src={capturedImage}
              alt="Captured Preview"
              style={{
                width: "100%",
                maxWidth: "500px",
                marginBottom: "20px",
                position: "relative",
              }}
            />

            <div
              style={{
                position: "absolute",
                border: "2px dashed red",
                left: `${Math.min(selectionBox.x1, selectionBox.x2)}px`,
                top: `${Math.min(selectionBox.y1, selectionBox.y2)}px`,
                width: `${Math.abs(selectionBox.x2 - selectionBox.x1)}px`,
                height: `${Math.abs(selectionBox.y2 - selectionBox.y1)}px`,
              }}
            />

            {["top-left", "top-right", "bottom-left", "bottom-right"].map(
              (corner) => {
                const isTop = corner.includes("top");
                const isLeft = corner.includes("left");
                const x = isLeft ? selectionBox.x1 : selectionBox.x2;
                const y = isTop ? selectionBox.y1 : selectionBox.y2;

                return (
                  <div
                    key={corner}
                    onMouseDown={(e) => handleDragStart(e, corner)}
                    onTouchStart={(e) => handleDragStart(e, corner)}
                    style={{
                      position: "absolute",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "blue",
                      left: `${x - 5}px`,
                      top: `${y - 5}px`,
                      cursor: "pointer",
                    }}
                  />
                );
              }
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
