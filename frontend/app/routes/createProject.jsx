// src/routes/createProject.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router"; // or react-router you use
import { UserAuth } from "../context/AuthContext";
import { useAnimations } from "../context/AnimationContext.jsx";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";

import InputField from "../components/UI_elements/InputField.jsx";
import Button from "../components/UI_elements/Button.jsx";
import Separator from "../components/UI_elements/Separator.jsx";
import SmallFlower from "../components/UI_elements/flower/SmallFlower.jsx";
import BackIcon from "../components/icons/BackIcon.jsx";

export default function CreateProject() {
  const { animationsEnabled } = useAnimations();
  const { user } = UserAuth(); // assume this returns user object with id
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const colorList = [
    "e783ff",
    "8381fd",
    "ff4d07",
    "e97ad7",
    "2f3cc0",
    "00bae2",
    "e783ff",
    "fc573d",
    "f7bef9",
    "cb247f",
    "0ae449",
    "cbc3f6",
  ];

  const handleOpenProject = (id, passedData) => {
    navigate(`/project/${id}`, {
      state: { project: passedData }, // pass the whole project
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return setError("Please enter project name");
    setLoading(true);

    try {
      // Pick a random color
      const randomColor =
        colorList[Math.floor(Math.random() * colorList.length)];

      // Insert project row
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            user_id: user.id,
            name,
            color: randomColor,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setLoading(false);
      // Navigate to project page using the ID
      //navigate(`/project/${data.id}`);
      handleOpenProject(data.id, data);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert(err.message || "Error creating project");
    }
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
      ".separator",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=1",
    ); // Start 0.8s earlier
    tl.from(
      ".inputField",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.7",
    ); // Start 0.8s earlier
    tl.from(
      ".button",
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.4",
    );
  });

  return (
    <div className="flex flex-col gap-8 px-5 items-center w-full max-w-xl">
      <div className="small-flower absolute top-4 right-3 ">
        <SmallFlower />
      </div>
      <BackIcon />
      <h2 className="text-heading1 mt-20">
        Rest isn’t a luxury. It’s part of doing your best work.
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full items-center mt-10"
      >
        <div className="w-full separator">
          <Separator>Define your project</Separator>
        </div>

        <InputField
          label="Project name"
          type="text"
          value={name}
          placeholder="Enter project name"
          className="w-full inputField mt-5"
          inputClassName="w-full"
          onChange={setName}
        />
        <div className="absolute bottom-17 button">
          <Button
            gradient="white"
            type="submit"
            loading={loading}
            loadingText="Creating..."
          >
            Create Project
          </Button>
        </div>
        <p className="text-m text-red-400 wrap-break-word w-full">{error}</p>
      </form>
    </div>
  );
}
