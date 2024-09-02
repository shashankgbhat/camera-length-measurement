import React from "react";

const DistanceDisplay = ({ distance, onReset }) => {
  return (
    <div>
      <h2>Distance: {distance}px</h2>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default DistanceDisplay;
