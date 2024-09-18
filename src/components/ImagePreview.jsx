import React, { useState, useRef } from "react";
import SelectionBox from "./SelectionBox";

const ImagePreview = ({
  capturedImage,
  calculateRealWorldDimensions,
  onRetake,
}) => {
  const [selecting, setSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [objectDimensions, setObjectDimensions] = useState({
    width: 0,
    height: 0,
  });

  const imgRef = useRef(null);
  const startPoint = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
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
    setSelectionBox({
      x: startPoint.current.x,
      y: startPoint.current.y,
      width,
      height,
    });
  };

  const handleTouchEnd = () => {
    setSelecting(false);
    const objectWidthPixels = Math.abs(selectionBox.width);
    const objectHeightPixels = Math.abs(selectionBox.height);
    const objectRealDimensions = calculateRealWorldDimensions(
      objectWidthPixels,
      objectHeightPixels
    );
    setObjectDimensions(objectRealDimensions);
  };

  return (
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
        style={{
          width: "100%",
          maxWidth: "500px",
          marginBottom: "20px",
          position: "relative",
        }}
      />
      {selecting && <SelectionBox selectionBox={selectionBox} />}
      <div>
        <p>Object Width: {objectDimensions.width.toFixed(2)} cm</p>
        <p>Object Height: {objectDimensions.height.toFixed(2)} cm</p>
        <button onClick={onRetake}>Retake</button>
      </div>
    </div>
  );
};

export default ImagePreview;
