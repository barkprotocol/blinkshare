import React from "react";

export default function SimpleTooltip({ children, content, position = "bottom" }) {
  if (!content) return children;

  // Positions mapping
  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  const positionClass = positionClasses[position] || positionClasses.bottom;

  return (
    <div className="relative group">
      {children}
      {content && (
        <div
          className={`absolute ${positionClass} left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none`}
          aria-describedby="tooltip-content"
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
