import React from "react";

function InputField({
  value,
  placeholder = "",
  className = "",
  capitalizeWords,
  onChange = () => {},
  type = "text",
}) {
  return (
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
      className={`${className} border border-inputcolor rounded-sm w-[285px] h-[45px] outline-none text-m text-inputcolor px-5`}
    />
  );
}

export default InputField;
