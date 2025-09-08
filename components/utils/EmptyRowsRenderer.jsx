import React from "react";

const EmptyRowsRenderer = () => {
  return (
    <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
      <div
        style={{
          padding: "20px 10px",
          backgroundColor: "white",
          fontSize: "12px",
        }}
      >
        No Result
      </div>
    </div>
  );
};

export default EmptyRowsRenderer;
