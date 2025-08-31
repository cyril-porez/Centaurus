import React from "react";

export default function TextInput({ props, value, onValueChange }) {
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (onValueChange) onValueChange(newValue);
  };

  const fieldset = `w-full mx-auto rounded-lg p-[4%] border ${props.colorBorder} `;

  return (
    <div className="mb-[5%] w-full">
      <fieldset className={fieldset}>
        <legend className={`text-sm ${props.textColor}`}>{props.legend}</legend>
        <input
          className={`w-full focus:outline-none focus:ring-2 ${props.inputBoderColor}`}
          type={props.type}
          value={value}
          onChange={handleChange}
          placeholder={props.placeholder}
          id=""
        />
      </fieldset>
    </div>
  );
}
