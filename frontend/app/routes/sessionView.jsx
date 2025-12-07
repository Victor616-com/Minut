// src/routes/sessionView.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import Button from "../components/UI_elements/Button.jsx";
import Separator from "../components/UI_elements/Separator.jsx";

/*
Behavior summary:
- On mount, we create a sessions row (user_id, project_id, planned_seconds, goal_minutes, system)
- Timer state:
  - workMode: true when work, false while on break
  - cycleSeconds: seconds elapsed inside current work/break segment
  - elapsedWork: total tracked work seconds for session
  - breaksCount: number of breaks started (we also create session_breaks rows)
- Every break start -> insert session_breaks (taken default false)
- If user taps "I took the break" -> update last session_breaks to taken=true and set break_ended_at
- If break ends without tap -> set taken=false and update break_ended_at
- Periodically (every 10s) save tracked_seconds and breaks_count to sessions
- Buttons: Restart (reset local state), Pause/Play, End session (final save + status completed)
*/

export default function sessionView() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = UserAuth();

  // Refs to avoid multiple creations
  const createdOnce = useRef(false);
  const breakStarting = useRef(false);

  // Values passed from ProjectView via navigate state or fallback
  const passed = location.state || {};
  const initialMinutes = passed.sessionLength ?? 30; // default 30 min
  const initialSystem = passed.sessionType ?? "20/20/20";

  const [sessionId, setSessionId] = useState(null);
  const [sessionRow, setSessionRow] = useState(null); // DB object
  const [loading, setLoading] = useState(true);

  const [workMode, setWorkMode] = useState(true); // true = work, false = break
  const [cycleSeconds, setCycleSeconds] = useState(0); // seconds elapsed in current segment
  const [elapsedWork, setElapsedWork] = useState(0); // total tracked work seconds
  const [breaksCount, setBreaksCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true); // pause/play
  const [currentBreakRowId, setCurrentBreakRowId] = useState(null); // id for last inserted break row

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
  const workInterval = 10; //getWorkInterval(initialSystem);
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
      console.log("Marked break as taken");
      // break continues normally, timer keeps counting
    } catch (err) {
      console.warn("Failed to mark break taken:", err);
    }
  };

  // If break ended without the user tapping
  const endBreakAutomatically = async () => {
    if (currentBreakRowId) {
      try {
        await supabase
          .from("session_breaks")
          .update({ break_ended_at: new Date().toISOString() })
          .eq("id", currentBreakRowId);
      } catch (err) {
        console.warn("Failed to finalize break row:", err);
      }
      setCurrentBreakRowId(null);
    }

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

      // navigate back to project page or home
      navigate(`/project/${projectId}`);
    } catch (err) {
      console.error("Failed to end session:", err);
      alert("Could not finish session, please try again.");
    }
  };

  // Helper to format seconds to mm:ss
  const fmt = (s) => {
    if (s < 0) s = 0;
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  if (loading || !sessionRow) {
    return <div className="p-6">Loading session...</div>;
  }

  // derive the UI timers
  const segmentTotal = workMode ? workInterval : breakDuration;
  const segmentRemaining = Math.max(segmentTotal - cycleSeconds, 0);
  const totalRemaining = Math.max(plannedSeconds - elapsedWork, 0);
  const progressPercent = Math.min(
    100,
    Math.round((elapsedWork / plannedSeconds) * 100),
  );

  return (
    <div className="flex flex-col gap-6 px-5 items-center w-full mt-8">
      <Separator>Session</Separator>

      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <div>
            <h2 className="text-heading2">{sessionRow.system}</h2>
            <p className="text-sm text-textlight">
              Goal: {plannedMinutes} minutes • {sessionRow.system}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-textdark">Total tracked</p>
            <p className="text-lg text-heading2">{fmt(elapsedWork)}</p>
          </div>
        </div>

        {/* progress bar */}
        <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* segment timer / main timer */}
        <div className="w-full flex gap-4 items-center mt-2">
          <div className="flex-1">
            <p className="text-xs text-textlight">
              {workMode ? "Work time remaining" : "Break time remaining"}
            </p>
            <p className="text-m font-mono">{fmt(segmentRemaining)}</p>
          </div>

          <div className="w-32 text-center">
            <p className="text-xs text-textlight">Session remaining</p>
            <p className="text-m font-mono">{fmt(totalRemaining)}</p>
          </div>
        </div>

        {/* If on break, show tap button to mark break as taken */}
        {!workMode && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-textlight">On break</p>
            <button
              onClick={userTookBreak}
              className="px-6 py-3 bg-blue-600 text-white rounded"
            >
              I took the break
            </button>
            <p className="mt-2 text-xs text-textlight">
              Tap this if you actually took the break. If you don't, we'll store
              it as missed after the break finishes.
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4 mt-6">
          <Button onClick={handleRestart}>Restart</Button>
          <Button onClick={togglePause}>
            {isRunning ? "Pause" : "Resume"}
          </Button>
          <Button onClick={handleEndSession}>End</Button>
        </div>
      </div>
    </div>
  );
}
