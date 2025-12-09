// src/components/CustomSlider.jsx
import React, { useState, useRef, useEffect } from "react";

export default function CustomSlider({
  min = 30,
  max = 600,
  step = 30,
  initial = 30,
  onChange,
}) {
  const [value, setValue] = useState(initial);
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const percent = ((value - min) / (max - min)) * 100;
  const remainingPercent = 100 - percent;
  // Compute handle position in %
  let handlePercent = percent;

  // Only clamp if trackRef.current exists
  if (trackRef.current) {
    const handleWidth = 26; // px
    const trackWidth = trackRef.current.offsetWidth;
    const halfHandlePercent = (handleWidth / trackWidth) * 50;

    if (handlePercent < halfHandlePercent) handlePercent = halfHandlePercent;
    if (handlePercent > 100 - halfHandlePercent)
      handlePercent = 100 - halfHandlePercent;
  }

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const updateValueFromPosition = (clientX) => {
    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    let newPercent = (clientX - rect.left) / rect.width;
    newPercent = Math.min(Math.max(newPercent, 0), 1);
    let newValue = Math.round((min + newPercent * (max - min)) / step) * step;
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  const lockScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.body.style.overflow = "";
  };

  const handleMouseMove = (e) => dragging && updateValueFromPosition(e.clientX);
  const handleTouchMove = (e) => {
    if (dragging) {
      e.preventDefault(); // prevent page scroll
      updateValueFromPosition(e.touches[0].clientX);
    }
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    lockScroll();
  };

  const handleTouchEnd = () => {
    setDragging(false);
    unlockScroll();
  };

  useEffect(() => {
    const stopDrag = () => {
      setDragging(false);
      unlockScroll();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleTouchMove, { passive: false }); // important
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [dragging]);

  // Keyboard support
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      const newValue = Math.min(value + step, max);
      setValue(newValue);
      onChange?.(newValue);
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      const newValue = Math.max(value - step, min);
      setValue(newValue);
      onChange?.(newValue);
      e.preventDefault();
    } else if (e.key === "Home") {
      setValue(min);
      onChange?.(min);
      e.preventDefault();
    } else if (e.key === "End") {
      setValue(max);
      onChange?.(max);
      e.preventDefault();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 ">
      {/* Display formatted value */}
      <p className="text-heading1">{formatTime(value)}</p>
      <div className="w-full flex flex-row justify-between mb-1">
        <p className="text-s">30min</p>
        <p className="text-s">10h</p>
      </div>
      {/* Slider track */}
      <div
        ref={trackRef}
        className="w-full h-2  bg-linear-to-r from-[#2F3CC0]
            via-[#00BAE2]
            via-[#E783FF] 
            to-[#FC573D] rounded-lg relative cursor-pointer"
        onClick={(e) => updateValueFromPosition(e.clientX)}
      >
        {/* Filled portion */}
        <div
          className="h-2 bg-barcolor rounded-lg absolute top-0 right-0"
          style={{ width: `${remainingPercent}%` }}
        />

        {/* Handle */}
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatTime(value)}
          tabIndex={0}
          className="w-[26px] h-10 bg-inputcolor flex flex-col pt-1 items-center rounded-full absolute top-1/2 -translate-y-3 -translate-x-1/2 cursor-pointer  focus:outline "
          style={{ left: `${handlePercent}%` }}
          onMouseDown={() => setDragging(true)}
          onTouchStart={handleTouchStart}
          onKeyDown={handleKeyDown}
        >
          <div className="w-[17px] h-[17px] bg-[#A2A2A2] z-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
