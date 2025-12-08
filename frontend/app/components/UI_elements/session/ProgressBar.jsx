import React, { useRef, useEffect, useState } from "react";

function ProgressBar({ elapsedWork, plannedSeconds, plannedMinutes, ref }) {
  const [clampedPercent, setClampedPercent] = useState(0);
  const barRef = useRef(null);

  const progressPercent = Math.min(
    100,
    Math.round((elapsedWork / plannedSeconds) * 100),
  );
  const remainingPercent = 100 - progressPercent;

  // ---- Time formatting ----
  const formatTime = (minutes) => {
    if (minutes < 60) return `${Math.floor(minutes)}m`;

    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes) % 60;

    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  };

  const objectiveLength = formatTime(plannedMinutes);
  const elapsedWorkFormatted = formatTime(elapsedWork / 60);

  // ---- Clamp elapsed work label ----
  useEffect(() => {
    if (barRef.current) {
      const barWidth = barRef.current.offsetWidth;
      const labelWidth = 20; // approximate width of the label in px
      const halfLabelPercent = (labelWidth / barWidth) * 50;

      let clamped = progressPercent;
      if (clamped < halfLabelPercent) clamped = halfLabelPercent;
      if (clamped > 100 - halfLabelPercent) clamped = 100 - halfLabelPercent;

      setClampedPercent(clamped);
    }
  }, [progressPercent]);

  return (
    <div className="flex flex-col w-full gap-2" ref={ref}>
      <div className="flex flex-row w-full justify-between">
        <p className="text-s text-inputcolor">Session Objective</p>
        <p className="text-s text-textlight">{objectiveLength}</p>
      </div>

      <div className="relative w-full" ref={barRef}>
        {/* Bar */}
        <div className="w-full h-2 rounded-xs overflow-hidden bg-linear-to-r from-[#EA83FF] to-[#7D80FD] relative">
          {/* Gray overlay */}
          <div
            className="h-full bg-textdark absolute top-0 right-0"
            style={{ width: `${remainingPercent}%` }}
          />
        </div>

        {/* Elapsed work label */}
        <div
          className="absolute top-3 text-xs text-textlight transform -translate-x-1/2"
          style={{ left: `${clampedPercent}%` }}
        >
          {elapsedWorkFormatted}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
