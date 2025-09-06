import React from "react";
export const HeaderText = ({ props }) => {
  return (
    <div className="text-center">
      <h1 className="text-color-title text-4xl font-bold">{props.title}</h1>
      <h3 className="text-color-title text-2xl font-semibold italic py-2">
        {props.subtitle}
      </h3>
    </div>
  );
};
