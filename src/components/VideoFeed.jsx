import React, { useRef, useEffect } from "react";

const VideoFeed = () => {
  const videoRef = useRef(null);

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
    />
  );
};

export default VideoFeed;
