import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAnimations } from "../../../context/AnimationContext";

export default function BreakComplianceGraph({ data, runGraphAnimation }) {
  const { animationsEnabled } = useAnimations();

  const chartData = data || [
    { day: "Sun", value: 10 },
    { day: "Mon", value: 55 },
    { day: "Tue", value: 20 },
    { day: "Wed", value: 40 },
    { day: "Thu", value: 60 },
    { day: "Fri", value: 90 },
    { day: "Sat", value: 30 },
  ];

  const chartRef = useRef(null);

  const maxValue = 100;
  const ySteps = 5;
  const yValues = Array.from(
    { length: ySteps + 1 },
    (_, i) => i * (maxValue / ySteps),
  );

  useGSAP(() => {
    if (!runGraphAnimation || !chartRef.current) return;

    const lines = chartRef.current.querySelectorAll(".lines");
    const bars = chartRef.current.querySelectorAll(".bars");
    const percentages = chartRef.current.querySelectorAll(".procentage");
    const yAxis = chartRef.current.querySelectorAll(".y-axis");
    const xAxis = chartRef.current.querySelectorAll(".x-axis");

    if (
      !lines.length ||
      !bars.length ||
      !percentages.length ||
      !yAxis.length ||
      !xAxis.length
    )
      return;

    const tl = gsap.timeline();

    // Make hidden elements visible
    tl.set(".hidden-before-gsap", { visibility: "visible" });
    if (!animationsEnabled) return;
    tl.from(yAxis, {
      opacity: 0,
      xPercent: -100,
      duration: 0.3,
      ease: "expo.out",
    });
    tl.from(
      xAxis,
      {
        opacity: 0,
        yPercent: 100,
        duration: 0.3,
        ease: "expo.out",
      },
      "<",
    );
    tl.from(
      lines,
      {
        width: 0,
        duration: 0.5,
        ease: "expo.out",
        stagger: 0.1,
      },
      "<",
    );
    tl.from(
      bars,
      {
        height: 0,
        duration: 0.5,
        ease: "expo.out",
        stagger: 0.1,
      },
      "-=0.4",
    );
    tl.from(percentages, {
      opacity: 0,
      duration: 0.5,
      ease: "expo.out",
      stagger: 0.1,
    });
  }, [runGraphAnimation]);

  return (
    <div className="w-full h-50 flex flex-col" ref={chartRef}>
      <div className="flex flex-1 relative">
        {/* Y-axis grid lines and labels */}
        {yValues
          .slice()
          .reverse()
          .map((val) => (
            <div
              key={val}
              className="absolute left-0 right-0 flex items-center Y"
              style={{
                bottom: `${(val / maxValue) * 100}%`,
                transform: "translateY(50%)",
              }}
            >
              <p className="text-s text-textlight mr-2 text-right w-8 hidden-before-gsap y-axis">
                {val}%
              </p>
              <div className="w-full h-px bg-textdark hidden-before-gsap lines" />
            </div>
          ))}

        {/* Bars */}
        <div className="absolute right-0 w-[calc(100%-37px)] flex justify-between items-end h-full px-4 z-10">
          {chartData.map((d) => (
            <div
              key={d.day}
              className="relative w-5 bg-linear-to-t from-[#0ae449] to-[#abff84] rounded-t flex items-end justify-center text-white text-xs hidden-before-gsap bars"
              style={{ height: `${(d.value / maxValue) * 100}%` }}
            >
              <p className="absolute bottom-0 text-center translate-y-6 w-fit text-s text-textlight hidden-before-gsap x-axis">
                {d.day}
              </p>
              {d.value > 0 && (
                <p className="absolute top-0 text-center -translate-y-6 w-fit text-s text-textlight hidden-before-gsap procentage">
                  {(d.value > 0 && d.value) || "na"}%
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
