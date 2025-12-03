import React from "react";
import placeholderImage from "../../../../assets/images/placeholder.png";
import ArrowIcon from "../../icons/ArrowIcon";
function ProjectCard() {
  return (
    <div className="flex flex-row w-full justify-between items-center">
      <div className="flex flex-row items-center gap-4">
        <img src={placeholderImage} className="w-12 h-12 bg-cover" alt="" />
        <div>
          <p className="text-m text-headercolor">LineUp</p>
          <p className="text-xs text-textlight">34h 14m</p>
        </div>
      </div>
      <ArrowIcon direction="right" />
    </div>
  );
}

export default ProjectCard;
