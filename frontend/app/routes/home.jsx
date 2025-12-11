import { useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import SplitText from "gsap/SplitText";
import gsap from "gsap";

import Separator from "../components/UI_elements/Separator";
import SmallFlower from "../components/UI_elements/flower/SmallFlower";
import ProjectCard from "../components/UI_elements/project/ProjectCard";
import Button from "../components/UI_elements/Button";
import ProtectedRoute from "./ProtectedRoute";
import { useEffect, useState } from "react";
import { useAnimations } from "../context/AnimationContext";

export default function Home() {
  const { animationsEnabled } = useAnimations();
  const navigate = useNavigate();
  const { user } = UserAuth();

  const [projects, setProjects] = useState([]);
  const [totalSecondsAllProjects, setTotalSecondsAllProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleAddProject = () => {
    navigate("/new-project");
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h > 0 ? h + "h " : ""}${m}m`;
  };

  // --- FETCH PROJECTS ---
  useEffect(() => {
    if (!user) navigate("/auth");

    const loadProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select(`*, sessions!inner(tracked_seconds)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const projectsWithTime = data.map((project) => {
        const totalSeconds = project.sessions?.reduce(
          (sum, session) => sum + (session.tracked_seconds ?? 0),
          0,
        );
        return { ...project, totalTrackedSeconds: totalSeconds ?? 0 };
      });

      setProjects(projectsWithTime);

      setLoading(false);
    };

    loadProjects();
  }, [user]);

  // --- CALCULATE TOTAL TIME ---
  useEffect(() => {
    if (projects.length > 0) {
      const total = projects.reduce(
        (sum, project) => sum + (project.totalTrackedSeconds ?? 0),
        0,
      );
      setTotalSecondsAllProjects(total);
      console.log(projects);
    }
  }, [projects]);

  const totalTimeInApp = formatTime(totalSecondsAllProjects);

  const handleOpenProject = (id, passedData) => {
    navigate(`/project/${id}`, {
      state: { project: passedData }, // pass the whole project
    });
  };

  // --- GSAP ANIMATIONS ---
  useEffect(() => {
    if (loading) return; // wait until projects are loaded

    const tl = gsap.timeline();
    tl.set(".hidden-before-gsap", { visibility: "visible" });
    if (!animationsEnabled) return;
    // Animate SmallFlower
    tl.from(".small-flower", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    // Animate heading text
    const split = new SplitText(".text-heading1", {
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
      ".projects",
      { opacity: 0, duration: 0.6, ease: "expo.out" },
      "-=0.8",
    );
    tl.from(".stats", { opacity: 0, duration: 0.6, ease: "expo.out" }, "-=0.8");
    tl.from(
      ".button",
      { opacity: 0, duration: 0.6, ease: "expo.out" },
      "-=0.6",
    );
  }, [loading]);

  // --- RENDER ---
  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Loading projects...</p>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="flex flex-col gap-6 px-5 items-center max-w-xl">
        <p
          className="text-heading1 mt-20 w-full hidden-before-gsap"
          tabindex="0"
        >
          Your mind deserves a moment. You tracked{" "}
          <span className="gradientText2">{totalTimeInApp}</span> this week.
        </p>

        <div className="flex flex-col gap-6 w-full projects hidden-before-gsap">
          <Separator>Choose a project</Separator>

          <div className="relative h-[220px] w-full">
            <div className="overflow-y-scroll h-full flex flex-col gap-6 [&::-webkit-scrollbar]:hidden">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  //onClick={() => navigate(`/project/${project.id}`)}
                  onClick={() => handleOpenProject(project.id, project)}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-bgcolor to-transparent" />
          </div>
        </div>

        <div className="absolute bottom-17 button hidden-before-gsap">
          <Button onClick={handleAddProject}>Add new project</Button>
        </div>
        <div className="small-flower absolute top-4 right-3 hidden-before-gsap">
          <SmallFlower />
        </div>
      </main>
    </ProtectedRoute>
  );
}
