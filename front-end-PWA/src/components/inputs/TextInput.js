import React from "react";

export default function TextInput({ props, value, onValueChange }) {
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className="mb-[5%] w-full">
      <label className={`text-sm ${props.textColor}`}>{props.legend}:</label>
      <input
        className={`w-full focus:outline-none focus:ring-2 ${props.inputBoderColor}`}
        type={props.type}
        value={value}
        onChange={handleChange}
        placeholder={props.placeholder}
        id=""
      />
    </div>
  );
}
