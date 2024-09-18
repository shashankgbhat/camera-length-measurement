import React from "react";

const SelectionBox = ({ selectionBox }) => {
  return (
    <div
      style={{
        position: "absolute",
        border: "2px dashed red",
        left: `${selectionBox.x}px`,
        top: `${selectionBox.y}px`,
        width: `${selectionBox.width}px`,
        height: `${selectionBox.height}px`,
      }}
    />
  );
};

export default SelectionBox;
