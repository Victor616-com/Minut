import React from "react";

function SessionEndIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="30"
      viewBox="0 0 23 30"
      fill="none"
    >
      <g clipPath="url(#clip0_126_526)">
        <mask
          id="mask0_126_526"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="23"
          height="30"
        >
          <path
            d="M21 0H2C0.89543 0 0 0.89543 0 2V28C0 29.1046 0.89543 30 2 30H21C22.1046 30 23 29.1046 23 28V2C23 0.89543 22.1046 0 21 0Z"
            fill="white"
          />
        </mask>

        <g mask="url(#mask0_126_526)">
          <path
            d="M21 0H2C0.89543 0 0 0.89543 0 2V28C0 29.1046 0.89543 30 2 30H21C22.1046 30 23 29.1046 23 28V2C23 0.89543 22.1046 0 21 0Z"
            stroke="var(--text-color-light)"
            strokeWidth="5"
          />
        </g>
      </g>

      <defs>
        <clipPath id="clip0_126_526">
          <rect width="23" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SessionEndIcon;
