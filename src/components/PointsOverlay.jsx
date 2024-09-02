import React from "react";

const PointsOverlay = ({ points }) => {
  return (
    <>
      {points.map((point, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: point.y,
            left: point.x,
            width: "10px",
            height: "10px",
            backgroundColor: "red",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );
};

export default PointsOverlay;
