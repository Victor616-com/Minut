// authentication.jsx
import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import SignUp from "../components/authentication/SignUp";
import SignIn from "../components/authentication/SignIn";

const flower = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="271"
    height="271"
    viewBox="0 0 271 271"
    fill="none"
  >
    <path
      d="M2.89013 114.653C-1.72087 100.654 -0.814694 87.9051 5.60867 76.4063C8.18029 71.297 11.173 67.0354 14.5867 63.6217C19.7074 58.5011 24.6071 55.2931 29.2859 53.9979C33.9648 52.7027 36.5175 51.8417 36.9442 51.415L52.8953 46.8836L66.2352 56.383L78.3007 65.8881C81.6843 69.2717 89.5202 74.5473 101.808 81.7149C103.134 70.2387 103.389 60.679 102.573 53.0357L102.641 37.7417L103.348 21.8075L116.139 11.555C126.376 2.16342 138.925 -1.50326 153.785 0.554989C163.973 2.20913 172.662 6.63128 179.853 13.8214C184.082 18.051 187.041 21.4365 188.729 23.9779L195.679 37.3292L191.154 52.0057L185.993 66.0479C182.119 77.5354 179.531 86.4682 178.228 92.8464C187.582 91.1056 196.726 88.7285 205.661 85.7151L219.703 80.5549L236.928 76.0179L249.628 86.1574C253.865 88.6876 256.83 90.7986 258.522 92.4904C264.443 98.4117 268.44 107.103 270.514 118.564C271.73 131.728 268.063 144.277 259.514 156.21L249.261 169L232.692 169.074C222.496 169.119 217.398 169.141 217.398 169.141C209.755 168.326 200.195 168.581 188.719 169.906C195.891 181.344 201.379 188.967 205.186 192.773L214.057 204.205L223.556 217.544L219.025 233.496C218.598 233.922 217.737 236.475 216.442 241.154C215.147 245.833 211.939 250.732 206.818 255.853C203.404 259.267 199.143 262.259 194.033 264.831C182.108 271.681 169.359 272.587 155.787 267.55L139.876 263.159L134.216 245.979L129.821 231.342C128.152 224.552 124.791 216.071 119.738 205.897C110.773 215.708 105.218 222.955 103.073 227.637L94.0951 240.422L83.2024 253.852L66.6339 253.926C60.6862 253.952 54.9537 253.34 49.4365 252.09C43.4964 250.417 37.3542 246.409 31.0099 240.064C21.705 230.759 17.0845 218.885 17.1486 204.44L17.222 187.872L30.6524 176.979L43.4369 168.001C53.6669 160.309 61.1269 154.541 65.8171 150.696C53.5213 145.228 44.6149 141.869 39.0977 140.619C36.1257 140.207 31.4582 138.954 25.0951 136.858L7.2803 130.564L2.89013 114.653Z"
      fill="white"
    />
    <path
      d="M2.89013 114.653C-1.72087 100.654 -0.814694 87.9051 5.60867 76.4063C8.18029 71.297 11.173 67.0354 14.5867 63.6217C19.7074 58.5011 24.6071 55.2931 29.2859 53.9979C33.9648 52.7027 36.5175 51.8417 36.9442 51.415L52.8953 46.8836L66.2352 56.383L78.3007 65.8881C81.6843 69.2717 89.5202 74.5473 101.808 81.7149C103.134 70.2387 103.389 60.679 102.573 53.0357L102.641 37.7417L103.348 21.8075L116.139 11.555C126.376 2.16342 138.925 -1.50326 153.785 0.554989C163.973 2.20913 172.662 6.63128 179.853 13.8214C184.082 18.051 187.041 21.4365 188.729 23.9779L195.679 37.3292L191.154 52.0057L185.993 66.0479C182.119 77.5354 179.531 86.4682 178.228 92.8464C187.582 91.1056 196.726 88.7285 205.661 85.7151L219.703 80.5549L236.928 76.0179L249.628 86.1574C253.865 88.6876 256.83 90.7986 258.522 92.4904C264.443 98.4117 268.44 107.103 270.514 118.564C271.73 131.728 268.063 144.277 259.514 156.21L249.261 169L232.692 169.074C222.496 169.119 217.398 169.141 217.398 169.141C209.755 168.326 200.195 168.581 188.719 169.906C195.891 181.344 201.379 188.967 205.186 192.773L214.057 204.205L223.556 217.544L219.025 233.496C218.598 233.922 217.737 236.475 216.442 241.154C215.147 245.833 211.939 250.732 206.818 255.853C203.404 259.267 199.143 262.259 194.033 264.831C182.108 271.681 169.359 272.587 155.787 267.55L139.876 263.159L134.216 245.979L129.821 231.342C128.152 224.552 124.791 216.071 119.738 205.897C110.773 215.708 105.218 222.955 103.073 227.637L94.0951 240.422L83.2024 253.852L66.6339 253.926C60.6862 253.952 54.9537 253.34 49.4365 252.09C43.4964 250.417 37.3542 246.409 31.0099 240.064C21.705 230.759 17.0845 218.885 17.1486 204.44L17.222 187.872L30.6524 176.979L43.4369 168.001C53.6669 160.309 61.1269 154.541 65.8171 150.696C53.5213 145.228 44.6149 141.869 39.0977 140.619C36.1257 140.207 31.4582 138.954 25.0951 136.858L7.2803 130.564L2.89013 114.653Z"
      fill="url(#paint0_radial_40_412)"
    />
    <defs>
      <radialGradient
        id="paint0_radial_40_412"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(124.464 145.976) rotate(-163.856) scale(185.48 180.956)"
      >
        <stop stop-color="#5242F5" />
        <stop offset="0.243298" stop-color="#1FA1FD" />
        <stop offset="0.563865" stop-color="#D086FF" />
        <stop offset="0.77483" stop-color="#FD5538" />
      </radialGradient>
    </defs>
  </svg>
);

function authentication() {
  const [authState, setAuthState] = useState("signIn");

  // Animation refs
  const flowerRef = useRef(null);
  const contentRef = useRef(null);
  const minutRef = useRef(null);

  const toggleAuthState = () => {
    setAuthState((prev) => (prev === "signIn" ? "signUp" : "signIn"));
  };

  useGSAP(() => {
    if (!flowerRef.current || !contentRef.current) {
      return;
    }
    const tl = gsap.timeline();

    tl.from(flowerRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
    });
    tl.from(minutRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
    });
    tl.to(
      flowerRef.current,
      {
        scale: 0.15,
        x: () => {
          const flowerRect = flowerRef.current.getBoundingClientRect();
          const minutRect = minutRef.current.getBoundingClientRect();

          const scale = 0.15;

          const scaledFlowerWidth = flowerRect.width * scale;

          // Position flower's TOP-LEFT corner to text TOP-RIGHT corner
          return (
            minutRect.right -
            flowerRect.left -
            (flowerRect.width - scaledFlowerWidth) / 2 -
            20
          );
        },
        y: () => {
          const flowerRect = flowerRef.current.getBoundingClientRect();
          const minutRect = minutRef.current.getBoundingClientRect();

          const scale = 0.15;

          const scaledFlowerHeight = flowerRect.height * scale;

          // Align flower TOP to text TOP
          return (
            minutRect.top -
            flowerRect.top -
            (flowerRect.height - scaledFlowerHeight) / 2 -
            10
          );
        },
        duration: 2,
        ease: "expo.out",
      },
      "<",
    );
    tl.to([flowerRef.current, minutRef.current], {
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
      delay: 0.8,
    });
    tl.from(contentRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
    });
  });

  return (
    <div className="flex items-center justify-center h-dvh w-full relative">
      <div
        className="absolute z-60 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ref={flowerRef}
      >
        {flower}
      </div>
      <p
        className="z-100 text-heading1 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ref={minutRef}
      >
        Minut
      </p>
      <div
        className="flex items-center justify-center relative h-dvh w-full"
        ref={contentRef}
      >
        {authState === "signIn" ? (
          <SignIn toggleAuthState={toggleAuthState} />
        ) : (
          <SignUp toggleAuthState={toggleAuthState} />
        )}
      </div>
    </div>
  );
}

export default authentication;
