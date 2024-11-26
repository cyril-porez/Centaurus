import React from "react";

export default function ToggleInput({ props }) {
  return (
    <div
      className="
            flex flex-row
            align-baseline justify-center 
            space-x-2 w-5/6 mx-auto"
    >
      <input type="checkbox" />
      <label className="text-sm">{props?.text}</label>
    </div>
  );
}
