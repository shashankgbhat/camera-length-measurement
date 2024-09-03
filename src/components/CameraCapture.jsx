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

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

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
    setCapturedImage(null);
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
              <button onClick={downloadImage} style={{ marginRight: "10px" }}>
                Download Image
              </button>
              <button onClick={resetCapture}>Retake</button>
            </div>
          </div>
        )}
      </div>

      {!capturedImage && (
        <button onClick={captureImage} style={{ marginTop: "20px" }}>
          Capture Image
        </button>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
