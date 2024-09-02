import React, { useRef, useEffect } from "react";

const VideoFeed = ({ onVideoClick }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  }, []);

  return (
    <video
      ref={videoRef}
      style={{ width: "100%", maxWidth: "500px" }}
      autoPlay
      playsInline
      onClick={onVideoClick}
    />
  );
};

export default VideoFeed;
