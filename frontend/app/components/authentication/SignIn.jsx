import React, { useRef, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

import { useAnimations } from "../../context/AnimationContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import InputField from "../UI_elements/InputField";
import Button from "../UI_elements/Button";

function SignIn({ toggleAuthState }) {
  const { animationsEnabled } = useAnimations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState("");

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  // Animaton refs
  const tagRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const bottomTextRef = useRef(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An error occured during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    if (!animationsEnabled) return;
    if (
      !tagRef.current ||
      !inputRef.current ||
      !buttonRef.current ||
      !bottomTextRef.current
    ) {
      return;
    }
    const tl = gsap.timeline();

    tl.from(tagRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
    });

    tl.from(
      inputRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.6",
    ); // Start 0.8s earlier
    tl.from(
      buttonRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.5",
    ); // Start 0.8s earlier
    tl.from(
      bottomTextRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.4",
    );
  });
  return (
    <div>
      <p className="text-m absolute top-[90px] left-[30px]" ref={tagRef}>
        /Sign In
      </p>
      <form
        onSubmit={handleSignIn}
        className="flex flex-col items-center gap-[70px]"
      >
        <div className="flex flex-col gap-5" ref={inputRef}>
          {error && (
            <p className="text-m text-red-400 wrap-break-word max-w-[285px]">
              {error}
            </p>
          )}
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            type="email"
            onChange={setEmail}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            type="password"
            onChange={setPassword}
          />
        </div>
        <div className="flex flex-col items-center gap-5">
          <Button
            gradient="gradient6"
            type="submit"
            loading={loading}
            loadingText="Signing In..."
            ref={buttonRef}
          >
            Sign In
          </Button>
          <p className="text-s text-textlight" ref={bottomTextRef}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={toggleAuthState}
              className="gradientText7 underline focus:outline-none"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
