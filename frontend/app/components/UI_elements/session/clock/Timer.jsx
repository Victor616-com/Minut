import React from "react";

function Timer({ segmentRemaining }) {
  // Helper to format seconds to mm:ss
  const fmt = (s) => {
    if (s < 0) s = 0;
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };
  return (
    <div>
      <p className="text-clock gradientText6">{fmt(segmentRemaining)}</p>
    </div>
  );
}

export default Timer;
