import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router";
import Separator from "../components/UI_elements/Separator";
import { UserAuth } from "../context/AuthContext";

function stats() {
  const navigate = useNavigate();
  const { user } = UserAuth();

  const [stats, setStats] = useState({
    totalFocusSeconds: 0,
    sessionsCompleted: 0,
    breakCompliance: 0,
    totalBreakSeconds: 0,
  });

  const [loading, setLoading] = useState(true);

  const handleSignOut = async (e) => {
    e.preventDefault();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return console.warn("No active session to sign out.");

    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoading(true);

      try {
        // 1️⃣ Get all completed sessions for the user
        const { data: sessions, error: sessionError } = await supabase
          .from("sessions")
          .select("id, tracked_seconds, breaks_count")
          .eq("user_id", user.id)
          .eq("status", "completed");

        if (sessionError) throw sessionError;

        // Total focus time
        const totalFocusSeconds = sessions.reduce(
          (sum, s) => sum + (s.tracked_seconds ?? 0),
          0,
        );

        // Sessions completed
        const sessionsCompleted = sessions.length;

        // 2️⃣ Get all breaks for the user's sessions
        const { data: breaks, error: breaksError } = await supabase
          .from("session_breaks")
          .select("taken, break_started_at, break_ended_at")
          .in(
            "session_id",
            sessions.map((s) => s.id),
          );

        if (breaksError) throw breaksError;

        console.log(breaks);
        // Break compliance
        const totalBreaks = breaks.length;
        const takenBreaks = breaks.filter((b) => b.taken).length;
        const breakCompliance = totalBreaks
          ? Math.round((takenBreaks / totalBreaks) * 100)
          : 0;

        // Total break time in seconds
        const totalBreakSeconds = breaks.reduce((sum, b) => {
          if (b.taken && b.break_started_at && b.break_ended_at) {
            return (
              sum +
              (new Date(b.break_ended_at) - new Date(b.break_started_at)) / 1000
            );
          }
          return sum;
        }, 0);

        setStats({
          totalFocusSeconds,
          sessionsCompleted,
          breakCompliance,
          totalBreakSeconds,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h > 0 ? h + "h " : ""}${m}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-5 flex flex-col gap-8">
      <p
        className="text-m gradientText2 absolute top-3 right-5"
        onClick={handleSignOut}
      >
        /Sign Out
      </p>
      <div className="flex flex-col gap-6 mt-20">
        <div className="w-full flex flex-col gap-5 ">
          <Separator>Your stats</Separator>
        </div>
        <div className="w-full flex flex-row justify-between">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-heading3">Total focus time</p>
              <p className="text-stats gradientText2">
                {stats.totalFocusSeconds - stats.totalBreakSeconds}
              </p>
            </div>
            <div>
              <p className="text-heading3">Sessions completed</p>
              <p className="text-stats gradientText4">
                {stats.sessionsCompleted} sessions
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-heading3">Break compliance</p>
              <p className="text-stats gradientText7">
                {stats.breakCompliance}%
              </p>
            </div>
            <div>
              <p className="text-heading3">Total break time</p>
              <p className="text-stats gradientText6">
                {stats.totalBreakSeconds}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-5 ">
        <Separator>Break compliance</Separator>
      </div>
    </div>
  );
}

export default stats;
