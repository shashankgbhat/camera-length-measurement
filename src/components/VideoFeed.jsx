import React, { useRef, useEffect, useState } from "react";

const VideoFeed = ({ onVideoClick }) => {
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: { exact: "environment" },
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true); // Camera is active
        }
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
        setIsCameraActive(false); // Camera failed
      });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
      {/* Video feed */}
      <video
        ref={videoRef}
        style={{ width: "100%", height: "auto" }}
        autoPlay
        playsInline
        onClick={onVideoClick}
      />

      {/* Conditionally render grid overlay if camera is active */}
      {isCameraActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "99%",
            pointerEvents: "none", // Ensure clicks pass through to the video
            display: "grid",
            gridTemplateRows: "1fr 1fr 1fr",
            gridTemplateColumns: "1fr 1fr 1fr",
            zIndex: 1, // Ensure the grid stays above the video
            boxSizing: "border-box", // Make sure padding and borders are included in the element's total width and height
          }}
        >
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              style={{
                border: "2px solid black", // Black grid lines
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
