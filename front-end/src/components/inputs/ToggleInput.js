import React from "react";

export default function ToggleInput(props) {
  return (
    <div
      className="
            flex flex-row
            align-baseline justify-center 
            space-x-2 w-5/6 mx-auto
            mb-[2%]"
    >
      <label>
        <input type="checkbox" className="text-homa-beige" />
        <span className="text-sm text-homa-beige text-lg">{props?.text}</span>
      </label>
    </div>
  );
}
