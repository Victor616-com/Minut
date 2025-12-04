import React from "react";

function Separator({ children }) {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full h-px bg-textdark"></div>
      <p className="text-m">/{children}</p>
    </div>
  );
}

export default Separator;
