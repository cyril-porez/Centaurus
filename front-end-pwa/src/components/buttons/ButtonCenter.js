import React from "react";

export default function Button({ props }) {
  return (
    <button
      id={props.key}
      onClick={props.onClick}
      className={baseStyle + hoverStyle}
    >
      {props.title}
    </button>
  );
}

const baseStyle = `
    bg-transparent 
    text-gray-500
    py-7 px-5
    my-2 mx-auto
    w-full
    border
    border-neutral-400 
    rounded-2xl
    transition-all
`;

const hoverStyle = `
    hover:font-semibold 
    hover:border-cyan-500 
    hover:bg-gray-100
    hover:shadow-md
`;
