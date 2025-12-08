import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Timer from "./Timer";

function Clock({ cycleSeconds, segmentTotal, isRunning, workMode }) {
  const circleRef = useRef(null);
  const tlRef = useRef(null);
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  const segmentRemaining = Math.max(segmentTotal - cycleSeconds, 0);

  useEffect(() => {
    if (!circleRef.current || segmentTotal <= 0) return;

    if (tlRef.current) {
      tlRef.current.kill();
    }

    const currentOffset = circumference * (1 - segmentRemaining / segmentTotal);

    tlRef.current = gsap.to(circleRef.current, {
      strokeDashoffset: circumference,
      duration: segmentRemaining,
      ease: "linear",
      paused: !isRunning,
    });

    gsap.set(circleRef.current, { strokeDashoffset: currentOffset });

    if (isRunning) {
      tlRef.current.play();
    }

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [segmentRemaining, segmentTotal, isRunning, circumference]);

  useEffect(() => {
    if (!circleRef.current) return;

    // Fade out only during the last second OR if workMode is true
    if ((segmentRemaining <= 1 && segmentRemaining > 0) || !workMode) {
      gsap.to(".clock", {
        opacity: 0,
        duration: 1,
        ease: "power1.out",
      });
    } else if (segmentRemaining > 0) {
      // Reset opacity for new segment
      gsap.to(".clock", {
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      });
    }
  }, [segmentRemaining, workMode]);

  return (
    <div className="relative flex items-center justify-center w-full">
      <svg width={180} height={180} className="-rotate-90 clock">
        {/* Background Circle */}
        <circle
          cx={90}
          cy={90}
          r={radius}
          stroke="var(--text-color-dark)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round" // round ends for background too
        />
        {/* Progress Circle */}
        <circle
          ref={circleRef}
          cx={90}
          cy={90}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round" // rounded ends
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ae449" />
            <stop offset="100%" stopColor="#abff84" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute text-center">
        <Timer segmentRemaining={segmentRemaining} />
      </div>
    </div>
  );
}

export default Clock;
