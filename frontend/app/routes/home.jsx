import { useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import { useGSAP } from "@gsap/react";
import { supabase } from "../supabaseClient";
import SplitText from "gsap/SplitText";
import gsap from "gsap";

import Separator from "../components/UI_elements/Separator";
import SmallFlower from "../components/UI_elements/flower/SmallFlower";
import ProjectCard from "../components/UI_elements/project/ProjectCard";
import Button from "../components/UI_elements/Button";
import ArrowIcon from "../components/icons/ArrowIcon";
import ProtectedRoute from "./ProtectedRoute";
import { useEffect, useState } from "react";
import BackIcon from "../components/icons/BackIcon";

export default function Home() {
  const navigate = useNavigate();

  const { user, signOut } = UserAuth();
  const [projects, setProjects] = useState([]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/auth");
    } catch (err) {
      console.error(err);
    }
  };

  // --- FETCH PROJECTS ---
  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setProjects(data);
      console.log("Fetched projects:", data); // Remove before deployment
    };

    loadProjects();
  }, [user]);

  const handleAddProject = () => {
    navigate("/new-project");
  };

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline();

    // Scale up the SmallFlower
    tl.from(".small-flower", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    // Then animate split text
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
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.8",
    ); // Start 0.8s earlier
    tl.from(
      ".stats",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.8",
    ); // Start 0.8s earlier
    tl.from(
      ".button",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.6",
    );
  });

  return (
    <ProtectedRoute>
      <main className="flex flex-col gap-6 px-5 items-center">
        <div className="small-flower absolute top-4 right-3 ">
          <SmallFlower />
        </div>

        <p className="text-heading1 mt-20 w-full">
          Your mind deserves a moment. You tracked {""}
          <span className="gradientText2">46h 32m</span> this week.
        </p>
        <div className="flex flex-col gap-6 w-full projects">
          <Separator>Choose a project</Separator>

          <div className="relative h-[220px] w-full">
            {/* SCROLLABLE CONTENT */}
            <div className="overflow-y-scroll h-full flex flex-col gap-6 [&::-webkit-scrollbar]:hidden">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              ))}
            </div>

            <div
              className="
                pointer-events-none
                absolute bottom-0 left-0 w-full h-16
                bg-gradient-to-t from-bgcolor to-transparent
            "
            />
          </div>
        </div>

        <div className="absolute bottom-17 button">
          <Button onClick={handleAddProject}>Add new project</Button>
        </div>

        <p
          className="text-m text-textlight absolute bottom-6 left-5"
          onClick={handleSignOut}
        >
          Log Out
        </p>
      </main>
    </ProtectedRoute>
  );
}
