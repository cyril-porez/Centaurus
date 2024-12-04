import React, { useState } from "react";

export default function TextInput({ props }) {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const fieldset = `w-full mx-auto rounded-lg p-[4%] border border-${props.color} `;

  return (
    <div className="mb-[5%] w-full">
      <fieldset className={fieldset}>
        <legend className={"text-sm text-" + props.color}>
          {props.legend}
        </legend>

        <input
          className={
            "w-full focus:outline-none focus:ring-2 focus:ring-" + props.color
          }
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
