import React, { useState } from "react";
import SessionEndIcon from "../../../icons/SessionEndIcon";
import SessionPauseIcon from "../../../icons/SessionPauseIcon";
import SessionPlayIcon from "../../../icons/SessionPlayIcon";
import SessionRestartIcon from "../../../icons/SessionRestartIcon";

const iconMap = {
  end: SessionEndIcon,
  pause: SessionPauseIcon,
  play: SessionPlayIcon,
  restart: SessionRestartIcon,
};

const labelMap = {
  end: "End session",
  pause: "Pause session",
  play: "Play session",
  restart: "Restart session",
};

function SessionControlButton({
  variant = "pause",
  loading = false,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  loadingText = "Loading...",
  gradient = "white",
  toggleOnClick = true, // allows pause <-> play switch
  ...props
}) {
  // Handle toggling only for pause/play
  const [currentVariant, setCurrentVariant] = useState(variant);

  const Icon = iconMap[currentVariant] || (() => null);
  const label = labelMap[currentVariant] || "Button";

  const handleClick = (e) => {
    if (
      toggleOnClick &&
      (currentVariant === "pause" || currentVariant === "play")
    ) {
      setCurrentVariant((prev) => (prev === "pause" ? "play" : "pause"));
    }

    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      aria-label={label}
      title={label}
      aria-busy={loading || undefined}
      className={`flex items-center justify-center cursor-pointer ${className}`}
      {...props}
    >
      {loading ? <span>{loadingText}</span> : <Icon />}
    </button>
  );
}

export default SessionControlButton;
