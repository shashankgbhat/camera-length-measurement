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
          setIsCameraActive(true);
        }
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
        setIsCameraActive(false);
      });
  }, []);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="video-feed"
        autoPlay
        playsInline
        onClick={onVideoClick}
      />

      {isCameraActive && (
        <div className="grid-overlay">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="grid-cell" />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
