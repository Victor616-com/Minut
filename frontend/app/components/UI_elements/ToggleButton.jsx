import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const ToggleButton = ({ enabled, onChange }) => {
  const toggleRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // Animate the toggle circle
    gsap.to(toggleRef.current, {
      x: enabled ? 23 : 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Animate the background: gradient if ON, transparent if OFF
    gsap.to(backgroundRef.current, {
      background: enabled
        ? "linear-gradient(90deg, #f7bef9 0%, #2f3cc0 100%)"
        : "transparent",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [enabled]);

  const handleToggle = () => {
    if (onChange) onChange(!enabled);
  };

  return (
    <button
      ref={backgroundRef}
      onClick={handleToggle}
      role="switch"
      aria-checked={enabled}
      tabIndex={0}
      className="w-12 h-[25px] rounded-full relative cursor-pointer border-2 border-inputcolor focus:outline-none"
      style={{ background: "transparent" }}
    >
      <div
        ref={toggleRef}
        className="w-[15px] h-[15px] bg-inputcolor rounded-full absolute top-[3px] left-[3px] shadow-md"
      ></div>
    </button>
  );
};

export default ToggleButton;
