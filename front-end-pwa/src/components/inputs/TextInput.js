import React from "react";

export default function TextInput({ props, value, onValueChange }) {
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className="w-full">
      <label className={`block mb-1 text-sm text-centaurus-oxford-blue`}>
        {props.label}:
      </label>
      <input
        type={props.type}
        value={value}
        onChange={handleChange}
        placeholder={props.placeholder}
        id=""
        className={`
          w-full h-11 px-3
          rounded-md
          border-2 border-centaurus-oxford-blue
          focus:outline-none
          focus:border-2 focus:border-centaurus-dark-cerelean
        `}
      />
    </div>
  );
}
