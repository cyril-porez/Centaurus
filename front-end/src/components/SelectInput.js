import React from "react";

export default function SelectInput(params) {
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
        <legend className="text-sm text-homa-beige">Catégorie</legend>
        <select
          className="w-full focus:outline-none focus:ring-2 focus:ring-homa-beige"
          // onChange={(e) => setCategory(e.target.value)}
        >
          <option selected disabled>
            Sélectionner
          </option>
          <option>Pur Sang</option>
          <option>Trait/Attelage</option>
          <option>Autre</option>
        </select>
      </fieldset>
    </div>
  );
}
