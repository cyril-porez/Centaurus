import React from "react";
import ajouter from "../../assets/icons/ajouter.png";

export default function AddHorseButton({ onClick }) {
  return (
    <button
      className="
                border-solid
                border-2
                border-[#312E2D]
                flex
                items-center
                justify-evenly
                py-1 w-56
                mx-auto"
      onClick={onClick}
      type="submit"
    >
      <img className="h-8 w-8" src={ajouter} alt="" />
      Ajouter un cheval
    </button>
  );
}
