import { useState } from "react";

export default function TextInput({ props }) {
  const [value, setValue] = useState(null);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="mb-[5%] w-full">
      <fieldset
        className="w-full
                mx-auto
                rounded-lg
                border
                border-homa-beige
                p-[4%]"
      >
        <legend className="text-sm text-homa-beige">{props.legend}</legend>

        <input
          className="w-full focus:outline-none focus:ring-2 focus:ring-homa-beige"
          type={props.type}
          value=""
          onChange={handleChange}
          placeholder={props.placeholder}
          id=""
        />
      </fieldset>
    </div>
  );
}
