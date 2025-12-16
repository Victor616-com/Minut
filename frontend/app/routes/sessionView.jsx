// src/routes/sessionView.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";

import { useAnimations } from "../context/AnimationContext.jsx";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

import Button from "../components/UI_elements/Button.jsx";
import SmallFlower from "../components/UI_elements/flower/SmallFlower.jsx";
import BackIcon from "../components/icons/BackIcon.jsx";
import ProgressBar from "../components/UI_elements/session/ProgressBar.jsx";
import Clock from "../components/UI_elements/session/clock/Clock.jsx";
import BigFlower from "../components/UI_elements/flower/BigFlower.jsx";
import SessionControlButton from "../components/UI_elements/session/buttons/SessionControlButton.jsx";

export default function sessionView() {
  const { animationsEnabled } = useAnimations();
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = UserAuth();

  // Refs to avoid multiple creations
  const createdOnce = useRef(false);
  const breakStarting = useRef(false);
  const smallFlowerRef = useRef(null);

  const currentBreakRowIdRef = useRef(null);

  // Animation refs
  const backIconRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressBarRefInside = useRef(null);
  const clockRef = useRef(null);
  const headerRef = useRef(null);
  const breakTextRef = useRef(null);
  const breakFlowerRef = useRef(null);
  const formattedTimeRef = useRef(null);

  const headerLines = [
    `Your mind is in motion on`,
    `You're making real progress on`,
    `Momentum is building in`,
    `You're giving steady attention to`,
    `Settle in. Let your focus rest on`,
    `Take a breath, and return to`,
    `Every minute moves`,
    `You’re creating something meaningful with`,
    `Small steps count. Even now, on`,
    `You're giving your best to`,
    `You are working hard on`,
  ];
  const randomHeader = useMemo(() => {
    const index = Math.floor(Math.random() * headerLines.length);
    return headerLines[index];
  }, []);

  // Values passed from ProjectView via navigate state or fallback
  const passed = location.state || {};
  const projectName = passed.project?.name || "Unknown Project";
  const initialMinutes = passed.sessionLength ?? 30; // default 30 min
  const initialSystem = passed.sessionType ?? "20/20/20";

  const timeSpentInProject = passed.project?.totalTrackedSeconds || 0;

  const [sessionId, setSessionId] = useState(null);
  const [sessionRow, setSessionRow] = useState(null); // DB object
  const [loading, setLoading] = useState(true);

  const [workMode, setWorkMode] = useState(true); // true = work, false = break
  const [cycleSeconds, setCycleSeconds] = useState(0); // seconds elapsed in current segment
  const [elapsedWork, setElapsedWork] = useState(0); // total tracked work seconds
  const [breaksCount, setBreaksCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true); // pause/play
  const [currentBreakRowId, setCurrentBreakRowId] = useState(null); // id for last inserted break row
  const [breakTaken, setBreakTaken] = useState(false);

  const tickRef = useRef(null);
  const lastSaveRef = useRef(Date.now());

  // derive intervals based on system
  const getWorkInterval = (system) => {
    if (system === "20/20/20") return 20 * 60;
    if (system === "25/5") return 25 * 60;
    // fallback
    return 25 * 60;
  };
  const getBreakDuration = (system) => {
    if (system === "20/20/20") return 20; // 20 seconds
    if (system === "25/5") return 5 * 60; // 5 minutes
    return 5 * 60;
  };

  const plannedMinutes = initialMinutes;
  const plannedSeconds = plannedMinutes * 60;
  const workInterval = getWorkInterval(initialSystem);
  const breakDuration = getBreakDuration(initialSystem);

  // Create session row on mount
  useEffect(() => {
    if (!user || createdOnce.current) return;

    const createSessionRow = async () => {
      createdOnce.current = true;

      const { data, error } = await supabase
        .from("sessions")
        .insert([
          {
            user_id: user.id,
            project_id: projectId,
            planned_seconds: plannedSeconds,
            goal_minutes: plannedMinutes,
            system: initialSystem,
            status: "running",
          },
        ])
        .select()
        .single();

      if (error) {
        createdOnce.current = false; // allow retry
        throw error;
      }

      setSessionId(data.id);
      setSessionRow(data);
      setLoading(false);
    };

    createSessionRow();
  }, [user, projectId]);

  // Timer tick
  useEffect(() => {
    if (!sessionId || !isRunning) return;

    // start interval
    tickRef.current = setInterval(() => {
      // increment total elapsed seconds
      setElapsedWork((prevElapsed) => {
        const nextElapsed = prevElapsed + 1;

        if (nextElapsed >= plannedSeconds) {
          handleEndSession(); // session complete
          return prevElapsed;
        }

        return nextElapsed;
      });

      // increment current segment seconds
      setCycleSeconds((prevCycle) => {
        const nextCycle = prevCycle + 1;

        if (workMode && nextCycle >= workInterval) {
          startBreak(); // flip mode and reset cycle inside startBreak
          return 0;
        }

        if (!workMode && nextCycle >= breakDuration) {
          endBreakAutomatically(); // flip mode back
          return 0;
        }

        return nextCycle;
      });

      // periodic save every 10s
      if (Date.now() - lastSaveRef.current > 10000) {
        saveProgressToDb();
        lastSaveRef.current = Date.now();
      }
    }, 1000);

    return () => {
      clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [
    sessionId,
    isRunning,
    workMode,
    plannedSeconds,
    workInterval,
    breakDuration,
  ]);

  // Start a break: create a session_breaks row and flip mode
  const startBreak = async () => {
    if (breakStarting.current) return;
    breakStarting.current = true;

    setBreakTaken(false);
    setWorkMode(false);
    setCycleSeconds(0);
    setBreaksCount((b) => b + 1);

    try {
      const { data, error } = await supabase
        .from("session_breaks")
        .insert({
          session_id: sessionId,
          user_id: user.id,
          break_started_at: new Date().toISOString(),
          taken: false,
        })
        .select()
        .single();

      if (error) throw error;

      currentBreakRowIdRef.current = data.id;
      setCurrentBreakRowId(data.id);
    } catch (err) {
      console.warn("Failed to create break row:", err);
    } finally {
      breakStarting.current = false;
    }
  };

  // When user taps to indicate they took the break
  const userTookBreak = async () => {
    if (!currentBreakRowId) return;

    try {
      await supabase
        .from("session_breaks")
        .update({
          taken: true,
        })
        .eq("id", currentBreakRowId);

      setBreakTaken(true);
    } catch (err) {
      console.warn("Failed to mark break taken:", err);
    }
  };

  // Allow user to press the space key to mark break as taken
  useEffect(() => {
    if (!workMode) {
      const handleKeyDown = (e) => {
        if (e.code === "Space") {
          e.preventDefault(); // prevent page scroll
          userTookBreak();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [workMode, userTookBreak]);

  // End break
  const endBreakAutomatically = async () => {
    const breakId = currentBreakRowIdRef.current;

    if (!breakId) {
      console.warn("No break ID found — race condition avoided.");
      return;
    }

    try {
      await supabase
        .from("session_breaks")
        .update({
          break_ended_at: new Date().toISOString(),
        })
        .eq("id", breakId);
    } catch (err) {
      console.error("Failed to end break:", err);
    }

    // Reset
    currentBreakRowIdRef.current = null;
    setCurrentBreakRowId(null);
    setWorkMode(true);
    setCycleSeconds(0);
  };

  // Periodically save tracked progress
  const saveProgressToDb = async () => {
    if (!sessionId) return;
    try {
      await supabase
        .from("sessions")
        .update({
          tracked_seconds: elapsedWork,
          breaks_count: breaksCount,
          status: isRunning ? "running" : "paused",
        })
        .eq("id", sessionId);
    } catch (err) {
      console.warn("Failed to save session progress:", err);
    }
  };

  // Pause / resume
  const togglePause = () => {
    setIsRunning((s) => !s);
  };

  // Restart session (local reset, does not delete DB row)
  const handleRestart = async () => {
    // stop interval
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setWorkMode(true);
    setCycleSeconds(0);
    setElapsedWork(0);
    setBreaksCount(0);
    setIsRunning(true);
    // optional: update DB to zeros
    if (sessionId) {
      try {
        await supabase
          .from("sessions")
          .update({ tracked_seconds: 0, breaks_count: 0, status: "running" })
          .eq("id", sessionId);
      } catch (err) {
        console.warn("Failed to reset session row:", err);
      }
    }
  };

  // End session permanently
  const handleEndSession = async () => {
    // stop interval
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setIsRunning(false);

    if (!sessionId) {
      navigate(-1);
      return;
    }

    try {
      // finalize any open break row
      if (currentBreakRowId) {
        try {
          await supabase
            .from("session_breaks")
            .update({ break_ended_at: new Date().toISOString() })
            .eq("id", currentBreakRowId);
        } catch (err) {
          console.warn("Failed to finalize break row:", err);
        }
      }

      // final update to sessions
      await supabase
        .from("sessions")
        .update({
          tracked_seconds: elapsedWork,
          breaks_count: breaksCount,
          status: "completed",
          ended_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      // Refetch projects *before* navigating
      const { data: refreshedProjects } = await supabase
        .from("projects")
        .select(
          `
          *,
          sessions(tracked_seconds)
        `,
        )
        .eq("user_id", user.id);

      console.log("Refreshed projects after session:", refreshedProjects);

      navigate("/", { state: { refresh: true } });
    } catch (err) {
      console.error("Failed to end session:", err);
      alert("Could not finish session, please try again.");
    }
  };

  const formatTime = (seconds) => {
    let totalTime = seconds + elapsedWork;

    if (totalTime < 60) return `${totalTime}s`;
    const h = Math.floor(totalTime / 3600);
    const m = Math.floor((totalTime % 3600) / 60);
    return `${h > 0 ? h + "h " : ""}${m}m`;
  };

  let formattedTime = formatTime(timeSpentInProject);

  // Initial animations that run on load
  useGSAP(() => {
    if (!animationsEnabled) return;
    if (
      !smallFlowerRef.current ||
      !headerRef.current ||
      !progressBarRef.current ||
      !clockRef.current
    ) {
      return;
    }
    const tl = gsap.timeline();

    // Scale up the SmallFlower
    tl.from(smallFlowerRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
    });

    // Then animate split text
    const split = new SplitText(headerRef.current, {
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
      progressBarRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.8",
    ); // Start 0.8s earlier
    tl.from(
      clockRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.6",
    ); // Start 0.8s earlier
    tl.from(
      ".buttons",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.4",
    );
  }, []);

  // Animations for breaks
  useEffect(() => {
    if (
      !smallFlowerRef.current ||
      !backIconRef.current ||
      !progressBarRefInside.current
    )
      return;
    const tl = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: "expo.out",
      },
    });
    tl.set(".hidden-before-gsap", { visibility: "visible" });

    if (!workMode) {
      // fade out both
      tl.to(
        [
          backIconRef.current,
          progressBarRefInside.current,
          smallFlowerRef.current,
          ".header",
        ],
        {
          opacity: 0,
        },
      );
      tl.to(clockRef.current, { y: 60 }, "<");
      tl.from(breakFlowerRef.current, { scale: 0 });
      // Then animate split text
      const split = new SplitText(breakTextRef.current, {
        type: "lines",
        linesClass: "split-lines",
      });

      tl.from(
        split.lines,
        {
          yPercent: 100,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.06,
        },
        "-=0.5",
      );
    } else {
      // fade back in only the icon (or both if you want)
      tl.to(
        [
          backIconRef.current,
          progressBarRefInside.current,
          smallFlowerRef.current,
          ".header",
        ],
        {
          opacity: 1,
        },
      );
      tl.to(clockRef.current, { y: 0 }, "<");
    }
  }, [workMode]);

  // derive the UI timers
  const segmentTotal = workMode ? workInterval : breakDuration; // move this to Clock component later

  return (
    <div className="flex flex-col gap-10 px-5 items-center w-full max-w-xl">
      {/* Back button */}
      <div onClick={handleEndSession}>
        <BackIcon ref={backIconRef} disableBack="true" />
      </div>

      {/* Small flower */}
      <div
        className="small-flower absolute top-4 right-3 "
        ref={smallFlowerRef}
      >
        <SmallFlower />
      </div>

      {/* Header text */}
      <p className="text-heading1 mt-10 w-full header" ref={headerRef}>
        {randomHeader} {""}
        <span className="gradientText7">{projectName}</span>.
      </p>

      <div className="w-full flex flex-col gap-4">
        {/* Progress bar */}
        <div className="w-full progress-bar" ref={progressBarRef}>
          <div className="w-full" ref={progressBarRefInside}>
            <ProgressBar
              elapsedWork={elapsedWork}
              plannedSeconds={plannedSeconds}
              plannedMinutes={plannedMinutes}
            />
          </div>
        </div>

        {/* Big flower */}
        {!workMode && (
          <div
            className="absolute bottom-60 left-1/2 -translate-x-1/2 hidden-before-gsap"
            ref={breakFlowerRef}
          >
            <BigFlower breakTaken={breakTaken} />
          </div>
        )}

        {/* Break mode text */}
        {!workMode && (
          <p
            className="absolute top-10 left-0 text-heading1 w-full px-5 hidden-before-gsap"
            ref={breakTextRef}
          >
            {breakTaken
              ? "Relax your shoulders. They’ve been carrying enough."
              : "Tap the screen or press space if you are taking a break."}
          </p>
        )}

        {/* Clock */}
        <div className="absolute bottom-35 w-full left-0">
          <Clock
            segmentTotal={segmentTotal}
            isRunning={isRunning}
            workMode={workMode}
            cycleSeconds={cycleSeconds}
            ref={clockRef}
          />
        </div>

        {/* Controls */}
        <div className="flex w-full justify-center left-0 gap-4 mt-6 absolute bottom-16 buttons z-30">
          <div className="relative">
            <SessionControlButton
              variant="restart"
              className="absolute right-22"
              onClick={handleRestart}
            />
            <SessionControlButton variant="pause" onClick={togglePause} />
            <SessionControlButton
              variant="end"
              className="absolute left-23 bottom-2"
              onClick={handleEndSession}
            />
          </div>
        </div>
      </div>

      {/* Overlay to capture taps during break */}
      {!workMode && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            // Prevent clicks on buttons
            if (!event.target.closest("button")) {
              userTookBreak();
            }
          }}
        />
      )}
    </div>
  );
}
