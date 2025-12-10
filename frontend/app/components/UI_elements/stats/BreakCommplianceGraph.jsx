import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function BreakComplianceGraph({ data }) {
  /*
  const chartData = data || [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 55 },
    { day: "Wed", value: 30 },
    { day: "Thu", value: 70 },
    { day: "Fri", value: 60 },
    { day: "Sat", value: 45 },
    { day: "Sun", value: 95 },
  ];
  */
  const chartData = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 55 },
    { day: "Wed", value: 30 },
    { day: "Thu", value: 70 },
    { day: "Fri", value: 60 },
    { day: "Sat", value: 45 },
    { day: "Sun", value: 95 },
  ];
  const maxValue = 100;
  const ySteps = 5;
  const yValues = Array.from(
    { length: ySteps + 1 },
    (_, i) => i * (maxValue / ySteps),
  );

  // Animations on load
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".lines", {
      width: 0,
      duration: 0.5,
      ease: "expo.out",
      stagger: 0.1,
    });
    tl.from(
      ".bars",
      {
        height: 0,
        duration: 0.5,
        ease: "expo.out",
        stagger: 0.1,
        //delay: 2,
      },
      "<",
    );
  }, []);

  return (
    <div className="w-full h-50 flex flex-col ">
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
              <p className="text-s text-textlight mr-2 text-right w-8">
                {val}%
              </p>
              <div className="w-full h-px bg-textdark lines" />
            </div>
          ))}

        {/* Bars contained within the chart area */}
        <div className="absolute right-0 w-[calc(100%-37px)] flex justify-between items-end h-full px-4  z-10">
          {chartData.map((d) => (
            <div
              key={d.day}
              className="w-[20px] bg-gradient-to-t from-[#0ae449] to-[#abff84] rounded-t flex items-end justify-center text-white text-xs bars"
              style={{ height: `${(d.value / maxValue) * 100}%` }}
            ></div>
          ))}
        </div>
        {/* X-axis labels */}
        <div className=" absolute right-0 -bottom-6 flex w-[calc(100%-34px)] justify-between px-3 mt-2">
          {chartData.map((d) => (
            <p key={d.day} className="text-center w-fit text-s text-textlight">
              {d.day}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
