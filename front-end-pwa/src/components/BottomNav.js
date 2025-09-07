// @ts-nocheck
import React from "react";
import { NavLink } from "react-router-dom";
import icCalc from "../assets/icons/calculator.png";
import icGraph from "../assets/icons/line-chart.png";
import icHome from "../assets/icons/mdi--home.png";
import icHorse from "../assets/icons/mdi--horse-variant.png";
import icUser from "../assets/icons/mdi--user.png";

/**
 * items: [{ to, label, icon }]
 *  - to:    route (string)
 *  - label: texte sous l�ic�ne
 *  - icon:  chemin d�image (png/svg) OU un �l�ment React (<svg/>)
 */
export default function BottomNav({
  items = [
    {
      to: "/horses/calculation/ChoiceHorse",
      label: "Calcul",
      icon: icCalc,
    },
    {
      to: "/horses/follow/follow-weight",
      label: "Suivi",
      icon: icGraph,
    },
    {
      to: "/",
      label: "Accueil",
      icon: icHome,
    },
    { to: "/horses/my-horse/my-horses", label: "Chevaux", icon: icHorse },
    {
      to: "/users/profile",
      label: "Profil",
      icon: icUser,
    },
  ],
}) {
  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-50
        bg-white/95 backdrop-blur
        border-t border-black/10
        pb-[max(env(safe-area-inset-bottom),0.5rem)]
      "
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="mx-auto w-full max-w-[360px]">
        <ul className="grid grid-cols-5">
          {items.map(({ to, label, icon }) => (
            <li key={to} className="min-w-0">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex flex-col items-center justify-center gap-1",
                    "py-2",
                    "text-[11px] font-medium",
                    isActive
                      ? "text-centaurus-dark-cerelean"
                      : "text-black/70 hover:text-black",
                  ].join(" ")
                }
              >
                {typeof icon === "string" ? (
                  <img
                    src={icon}
                    alt=""
                    className="w-6 h-6 pointer-events-none"
                    onError={(e) =>
                      (e.currentTarget.style.visibility = "hidden")
                    }
                  />
                ) : (
                  icon
                )}
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
