import React from "react";
import home from "../../assets/icons/home.png";
import { useNavigate } from "react-router-dom";

export default function HomeButton({ className = "", ariaLabel = "Accueil" }) {
  let navigate = useNavigate();

  const navigateHome = () => {
    navigate(`/`, { replace: false });
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => navigateHome()}
      className={`
        bg-[#312E2D] hover:bg-blue-700
        rounded-full h-12 w-12
        flex items-center justify-center
        shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-centaurus-oxford-blue
        ${className}
      `}
    >
      <img src={home} alt="home logo" className="h-6 w-6" />
    </button>
  );
}
