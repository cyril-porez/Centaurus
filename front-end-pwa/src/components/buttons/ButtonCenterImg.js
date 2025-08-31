import React from "react";

export default function ButtonCenter({ props }) {
    return (
        <button className={baseStyle + hoverStyle} onClick={props.onClick}>
            <img className="h-10 w-10 mr-2" src={props.src}></img>
            {props.title}
        </button>
    );
}

const baseStyle = `
    bg-transparent 
    text-gray-500
    py-7 px-5
    my-2 mx-auto
    w-11/12 
    border
    border-neutral-400 
    rounded-2xl
    transition-all
    flex flex-row
    justify-start
`;

const hoverStyle = `
    hover:font-semibold 
    hover:border-cyan-500 
    hover:bg-gray-100
    hover:shadow-md
`;