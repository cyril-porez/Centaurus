import React from "react";

export default function Button({ name, onSubmit, className = "" }) {
  return (
    <button
      className="
        inline-flex items-center justify-center
        w-full h-12
        rounded-md
        bg-centaurus-dark-cerelean text-white
        text-base font-medium
        shadow-md shadow-black/10
        hover:brightness-110
        active:translate-y-px
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-centaurus-oxford-blue
        transition
      "
      type="submit"
      onClick={onSubmit}
    >
      {name}
    </button>
  );
}
