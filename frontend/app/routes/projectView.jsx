import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";

import { supabase } from "../supabaseClient.js";

import { useAnimations } from "../context/AnimationContext.jsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

import Button from "../components/UI_elements/Button.jsx";
import BackIcon from "../components/icons/BackIcon.jsx";
import SmallFlower from "../components/UI_elements/flower/SmallFlower.jsx";
import Separator from "../components/UI_elements/Separator.jsx";
import CustomSlider from "../components/UI_elements/CustomSlider.jsx";
import RadioGroup from "../components/UI_elements/RadioGroup.jsx";

export default function ProjectView() {
  const { animationsEnabled } = useAnimations();
  const { projectId } = useParams(); // dynamic param from URL
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!project);

  const [sessionLength, setSessionLength] = useState(30); // in minutes
  const [sessionType, setSessionType] = useState("20/20/20");

  const headingRef = useRef(null);

  const options = [
    { value: "20/20/20", label: "20/20/20 system" },
    { value: "25/5", label: "25/5 system" },
  ];

  console.log(project);
  //Fallback
  /*
  useEffect(() => {
    if (!project && !location.state) {
      navigate("/"); // redirect to home if no project info
    }
  }, [project, location.state, navigate]);
  */
  const handleStartSession = () => {
    // Navigate to session page
    navigate(`/project/${projectId}/session`, {
      state: { sessionLength, sessionType, project },
    });
  };

  // GSAP Animations
  useGSAP(() => {
    if (!animationsEnabled) return;
    const tl = gsap.timeline();

    // Scale up the SmallFlower
    tl.from(".small-flower", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    // Then animate split text
    const split = new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "split-lines",
    });

    tl.from(split.lines, {
      yPercent: 100,
      opacity: 0,
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.06,
    });

    tl.from(
      ".session-length",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=1",
    );
    tl.from(
      ".system-selection",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.7",
    );
    tl.from(
      ".button",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.4",
    );

    // Move the flower to the top-right of the button
    tl.to(".small-flower", {
      x: () => {
        const flower = document.querySelector(".small-flower");
        const button = document.querySelector(".button");
        if (!flower || !button) return 0;

        const flowerRect = flower.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        // Calculate horizontal distance to top-right corner of button
        return buttonRect.right - flowerRect.right + 15; // +10px offset
      },
      y: () => {
        const flower = document.querySelector(".small-flower");
        const button = document.querySelector(".button");
        if (!flower || !button) return 0;

        const flowerRect = flower.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        // Calculate vertical distance to top of button
        return buttonRect.top - flowerRect.top - 22;
      },
      duration: 1,
      ease: "power2.inOut",
    });
  });

  return (
    <div className="flex flex-col gap-6 px-5 items-center w-full mt-10 max-w-xl">
      <BackIcon />
      <div className="small-flower absolute top-4 right-3 ">
        <SmallFlower />
      </div>
      <h1 className="text-heading1 mt-8 w-full" ref={headingRef}>
        Take a moment to pause and{" "}
        <span className="gradientText1">breathe</span>. Your mind will thank
        you.
      </h1>
      <div className="flex flex-col w-full gap-4 session-length">
        <Separator>How long is the session?</Separator>

        <CustomSlider
          min={30} // Change to 1 while testing
          max={600}
          step={10} // Change to 1 while testing
          initial={sessionLength}
          onChange={(val) => setSessionLength(val)}
          title="session length"
        />
      </div>
      <div className="flex flex-col w-full gap-4 mt-6 system-selection">
        <Separator>What system are you using?</Separator>

        <RadioGroup
          options={options}
          selected={sessionType}
          onChange={setSessionType}
        />
      </div>

      <div className="absolute bottom-17 button ">
        <Button gradient="white" onClick={handleStartSession}>
          Start new session
        </Button>
      </div>
    </div>
  );
}
