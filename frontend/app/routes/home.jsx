import { useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import gsap from "gsap";

import Separator from "../components/UI_elements/Separator";
import SmallFlower from "../components/UI_elements/flower/SmallFlower";
import ProjectCard from "../components/UI_elements/project/ProjectCard";
import Button from "../components/Button";
import ArrowIcon from "../components/icons/ArrowIcon";

export default function Home() {
  const { signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/auth");
    } catch (err) {
      console.error(err);
    }
  };

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
      "-=0.2",
    );
  });

  return (
    <main className="flex flex-col gap-6 px-5 items-center">
      <div className="small-flower absolute top-3 right-3 ">
        <SmallFlower />
      </div>

      <p className="text-heading1 mt-14 w-full">
        Your mind deserves a moment. You tracked {""}
        <span className="gradientText2">46h 32m</span> this week.
      </p>
      <div className="flex flex-col gap-6 w-full projects">
        <Separator>Choose a project</Separator>

        <div className="relative h-[190px] w-full">
          {/* SCROLLABLE CONTENT */}
          <div className="overflow-y-scroll h-full flex flex-col gap-6 [&::-webkit-scrollbar]:hidden">
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
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
      <div className="w-full flex flex-row justify-between stats">
        <p className="text-m text-textdark">See your stats</p>
        <ArrowIcon direction="right" color="var(--text-color-dark)" />
      </div>
      <div className="absolute bottom-17 button">
        <Button>Add new project</Button>
      </div>

      <p
        className="text-m text-textlight absolute bottom-6 left-5"
        onClick={handleSignOut}
      >
        Log Out
      </p>
    </main>
  );
}
