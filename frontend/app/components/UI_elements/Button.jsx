import React from "react";

function Button({
  children,
  loading = false,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  loadingText = "Loading...",
  gradient = "white",
  ref,
}) {
  return (
    <button
      title={loading ? loadingText : children}
      ref={ref}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`
        relative rounded-sm px-5 py-3.5 text-heading2 w-fit
        gradient-border-${gradient}
        ${className}
      `}
    >
      <span
        className={`relative z-10 gradientText${gradient.replace("gradient", "")}`}
      >
        {loading ? loadingText : children}
      </span>
    </button>
  );
}

export default Button;
