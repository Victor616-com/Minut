import React from "react";

function InputField({
  label,
  labelClassName,
  inputClassName,
  value,
  placeholder = "",
  className = "",
  capitalizeWords,
  onChange = () => {},
  type = "text",
}) {
  return (
    <div className={`${className}`}>
      {label && (
        <label
          for={type}
          className={`block text-m mb-3 ml-2 text-inputcolor ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          let val = e.target.value;

          // ✅ Apply capitalization only if prop is passed
          if (capitalizeWords) {
            val = val
              .toLowerCase()
              .split(" ")
              .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
              .join(" ");
          }

          onChange(val);
        }}
        className={` border border-inputcolor rounded-sm w-[285px] h-[45px] outline-none text-m text-inputcolor px-5 ${inputClassName}`}
      />
    </div>
  );
}

export default InputField;
