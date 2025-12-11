// components/UI_elements/RadioGroup.jsx
import React from "react";

export default function RadioGroup({ options, selected, onChange, className }) {
  return (
    <div
      className={`flex flex-col w-full gap-4 ${className || ""}`}
      role="radiogroup"
      aria-label="Theme options"
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 cursor-pointer select-none text-m text-inputcolor"
        >
          {/* Hidden native input */}
          <input
            type="radio"
            name={option.name || "radio-group"}
            value={option.value}
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only" // screen-reader only
          />
          {/* Custom radio */}
          <span
            className={`w-5 h-5 shrink-0 rounded-full border-2 border-inputcolor flex items-center justify-center
            ${selected === option.value ? "" : "bg-transparent"} transition-all`}
          >
            {/* Inner dot when selected */}
            {selected === option.value && (
              <span className="w-2.5 h-2.5 bg-inputcolor rounded-full" />
            )}
          </span>
          {option.label}
        </label>
      ))}
    </div>
  );
}
