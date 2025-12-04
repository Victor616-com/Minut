import React from "react";

function ArrowIcon({ direction = "right", color = "var(--input-color)" }) {
  const rotationDegrees = {
    right: 0,
    down: 90,
    left: 180,
    up: -90,
  };

  return (
    <div
      style={{
        display: "inline-block",
        transform: `rotate(${rotationDegrees[direction]}deg)`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        viewBox="0 0 27 27"
        fill="none"
      >
        <path
          d="M10.125 6.75L16.875 13.5L10.125 20.25"
          stroke={color} // ← dynamic color
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default ArrowIcon;
