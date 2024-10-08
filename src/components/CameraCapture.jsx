import React, { useRef, useState } from "react";
import VideoFeed from "./VideoFeed";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [showDimensions, setShowDimensions] = useState(false);
  const [distance, setDistance] = useState(3.28);
  const [distanceError, setDistanceError] = useState(false);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const PPI = 429;
  const FOV = 77;
  const CORNER_HITBOX_SIZE = 20;

  const calculateRealWorldDimensions = (pixelWidth, pixelHeight, distance) => {
    const distanceInCm = distance * 30.48;
    const fovRadians = (FOV * Math.PI) / 180;
    const realWorldWidth = 2 * distanceInCm * Math.tan(fovRadians / 2);
    const cmPerPixel = realWorldWidth / 1080;
    const objectWidth = pixelWidth * cmPerPixel;
    const objectHeight = pixelHeight * cmPerPixel;
    return { width: objectWidth, height: objectHeight };
  };

  const convertCmToFeetInches = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
  };

  const captureImage = () => {
    if (distance <= 0) {
      setDistanceError(true);
      return;
    }
    setDistanceError(false);

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
      pixelHeight,
      distance
    );
    setDimensions(realDimensions);

    const initWidth = pixelWidth * 0.5;
    const initHeight = pixelHeight * 0.5;
    const initX1 = (pixelWidth - initWidth) / 2;
    const initY1 = (pixelHeight - initHeight) / 2;
    const initX2 = initX1 + initWidth;
    const initY2 = initY1 + initHeight;
    setSelectionBox({ x1: initX1, y1: initY1, x2: initX2, y2: initY2 });
    setShowDimensions(false);
  };

  const handleDragStart = (e, corner) => {
    e.preventDefault();
    setDraggingCorner(corner);
  };

  const isNearCorner = (x, y, box) => {
    const corners = [
      { x: box.x1, y: box.y1, name: "top-left" },
      { x: box.x2, y: box.y1, name: "top-right" },
      { x: box.x1, y: box.y2, name: "bottom-left" },
      { x: box.x2, y: box.y2, name: "bottom-right" },
    ];

    for (const corner of corners) {
      const dx = Math.abs(corner.x - x);
      const dy = Math.abs(corner.y - y);
      if (dx <= CORNER_HITBOX_SIZE && dy <= CORNER_HITBOX_SIZE) {
        return corner.name;
      }
    }
    return null;
  };

  const handleDragMove = (e) => {
    if (!draggingCorner || !imgRef.current) return;
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
  };

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!draggingCorner) {
      const nearCorner = isNearCorner(x, y, selectionBox);
      if (nearCorner) {
        e.target.style.cursor = "pointer";
      } else {
        e.target.style.cursor = "default";
      }
    } else {
      handleDragMove(e);
    }
  };

  const handleCalculateDimensions = () => {
    if (distance <= 0) {
      setDistanceError(true);
      return;
    }

    const objectWidthPixels = Math.abs(selectionBox.x2 - selectionBox.x1);
    const objectHeightPixels = Math.abs(selectionBox.y2 - selectionBox.y1);
    const objectRealDimensions = calculateRealWorldDimensions(
      objectWidthPixels,
      objectHeightPixels,
      distance
    );

    setObjectDimensions(objectRealDimensions);
    setShowDimensions(true);
  };

  return (
    <div className="container">
      <div className="header text-center my-4">
        <h1>Camera Measure App</h1>
      </div>

      <div className="body">
        {!capturedImage && (
          <div className="distance-input-container mb-3">
            <VideoFeed />
            <div className="input-group">
              <label className="input-group-text">
                Enter distance to object (feet):
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="form-control"
              />
            </div>
            {distanceError && (
              <p className="text-danger mt-2">
                Please enter a valid positive distance.
              </p>
            )}
          </div>
        )}

        {capturedImage && (
          <div
            className="captured-image-wrapper position-relative"
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
          >
            <img
              ref={imgRef}
              src={capturedImage}
              alt="Captured Preview"
              className="img-fluid"
            />
            <div
              className="selection-box border border-danger position-absolute"
              style={{
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
                    className={`corner-hitbox position-absolute rounded-circle ${
                      draggingCorner === corner ? "bg-success" : "bg-primary"
                    }`}
                    style={{
                      left: `${x - CORNER_HITBOX_SIZE / 2}px`,
                      top: `${y - CORNER_HITBOX_SIZE / 2}px`,
                      width: `${CORNER_HITBOX_SIZE}px`,
                      height: `${CORNER_HITBOX_SIZE}px`,
                    }}
                  />
                );
              }
            )}

            {showDimensions && (
              <div className="dimension-info text-center mt-3">
                <p>Distance to Object: {distance} ft</p>
                <p>
                  Object Width:{" "}
                  {convertCmToFeetInches(objectDimensions.width).feet} ft{" "}
                  {convertCmToFeetInches(objectDimensions.width).inches.toFixed(
                    2
                  )}{" "}
                  in
                </p>
                <p>
                  Object Height:{" "}
                  {convertCmToFeetInches(objectDimensions.height).feet} ft{" "}
                  {convertCmToFeetInches(
                    objectDimensions.height
                  ).inches.toFixed(2)}{" "}
                  in
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer text-center my-4">
        {capturedImage ? (
          <div className="d-flex justify-content-around">
            <button
              onClick={handleCalculateDimensions}
              className="btn btn-primary col-8"
            >
              Calculate Height and Width
            </button>
            <button
              onClick={() => setCapturedImage(null)}
              className="btn btn-danger col-4"
            >
              Retake
            </button>
          </div>
        ) : (
          <button onClick={captureImage} className="btn btn-success mt-4 col-12">
            Capture Image
          </button>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
