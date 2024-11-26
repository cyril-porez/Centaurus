import React from "react";
import home from "../../assets/icons/home.png";
import { useNavigate } from "react-router-dom";

export default function HomeButton() {
  let navigate = useNavigate();

  const navigateHome = () => {
    navigate(`/`, { replace: false });
  };

  return (
    <button
      onClick={() => navigateHome()}
      className="bg-[#312E2D]
                            rounded-full
                            h-12 w-12
                            flex
                            items-center
                            justify-center
                          hover:bg-blue-700"
    >
      <img className="h-8 w-8" src={home} />
    </button>
  );
}
