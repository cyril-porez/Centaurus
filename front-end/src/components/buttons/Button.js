import React from "react";

export default function Button() {
  return (
    <button
      className="bg-sky-blue
                hover:bg-sky-blue-hover
                text-white
                text-xl
                font-bold
                rounded-full
                shadow-lg
                w-full 
                p-[10px] 
                py-5 w-80
                mx-auto
                transition
                duration-300
                flex
                items-center
                justify-center"
      type="submit"
    >
      <span className="mt-2">Ajouter</span>
      <span className="text-[40px] font-extrabold ml-1 align-middle">
        {">"}
      </span>
    </button>
  );
}
