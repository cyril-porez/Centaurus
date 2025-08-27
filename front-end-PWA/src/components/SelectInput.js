import React from "react";

export default function SelectInput({ value, onValueChange }) {
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (onValueChange) onValueChange(newValue);
  };
  return (
    <div className="mb-[5%] w-full">
      <label className="block mb-1 text-sm text-centaurus-oxford-blue">
        Catégorie:
      </label>
      <select
        className="
          w-full h-11 px-3
          rounded-md
          border-2 border-centaurus-oxford-blue
          focus:outline-none
          focus:border-2 focus:border-centaurus-dark-cerelea 
        "
        value={value}
        onChange={handleChange}
      >
        <option value="" disabled>
          Sélectionner
        </option>
        <option value="Pur Sang">Pur Sang</option>
        <option value="Trait/Attelage">Trait/Attelage</option>
        <option value="Autre">Autre</option>
      </select>
    </div>
  );
}
