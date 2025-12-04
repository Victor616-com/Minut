import React from "react";
import placeholderImage from "../../../../assets/images/placeholder.png";
import ArrowIcon from "../../icons/ArrowIcon";
function ProjectCard({ project, onClick }) {
  const initials =
    project.name.slice(0, 1).toUpperCase() +
    project.name.slice(1, 2).toLowerCase();
  return (
    <div
      className="flex flex-row w-full justify-between items-center"
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-4">
        <div
          className="w-11 h-11 flex items-center justify-center"
          style={{ backgroundColor: `#${project.color}` }}
        >
          <p className="text-header2 text-black">{initials}</p>
        </div>
        <div>
          <p className="text-m text-headercolor">{project.name}</p>
          <p className="text-xs text-textlight">34h 14m</p>
        </div>
      </div>
      <ArrowIcon direction="right" />
    </div>
  );
}

export default ProjectCard;
