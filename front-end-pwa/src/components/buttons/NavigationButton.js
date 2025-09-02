import React from "react";
export default function NavigationButton({ props }) {
  return (
    <button
      className="bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                rounded-full
                shadow-xl
                py-5 w-80
                mx-auto"
    >
      {props.title}
    </button>
  );
}
