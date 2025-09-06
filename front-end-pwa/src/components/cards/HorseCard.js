// @ts-nocheck
import React from "react";

import pen from "../../assets/icons/pencil.png";
import garbage from "../../assets/icons/garbage.png";

const initialsFrom = (fullName = "") =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => (s[0] || "").toUpperCase())
    .join(" ");

const ageLabel = (age) =>
  age == null ? "�" : `${age} an${Number(age) > 1 ? "s" : ""}`;

export default function HorseCard({
  name,
  age, // nombre d�j� calcul� (ex: 2)
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="w-full rounded-xl border border-black/20 bg-white p-3 shadow-sm
            flex items-center gap-3"
      role="group"
      aria-label={`Cheval ${name ?? ""}`}
    >
      {/* Avatar avec initiales */}
      <div className="w-10 h-10 rounded-full bg-centaurus-dark-cerelean text-white grid place-items-center font-semibold shrink-0">
        {initialsFrom(name)}
      </div>

      {/* Nom + �ge */}
      <div className="flex-1 min-w-0">
        <div className="text-base font-medium text-centaurus-oxford-blue truncate">
          {name || "�"}
        </div>
        <div className="text-sm text-black/70">{ageLabel(age)}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 grid place-items-center"
          aria-label="�diter"
        >
          <img src={pen} alt="" className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 grid place-items-center"
          aria-label="Supprimer"
        >
          <img src={garbage} alt="" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
