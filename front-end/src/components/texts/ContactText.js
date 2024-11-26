import React from "react";

export default function ContactText({ props }) {
  return (
    <div className="flex flex-col">
      <p
        className="
                text-sm
                text-[#C6A77C]"
      >
        Si tu as des questions sur l'utilisation de ces données, tu peux nous
        écrire :
      </p>
      <a
        className="
                text-sm
                rounded-full
                border
                border-[#C6A77C]
                text-[#312E2D]
                p-3
                mx-auto
                w-fit"
        href={`mailto:${props.mail}`}
      >
        {props.mail}
      </a>
    </div>
  );
}
