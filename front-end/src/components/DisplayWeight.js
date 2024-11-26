import React from "react";

export default function DisplayWeight({ props }) {
    return (
        <div className={baseStyle}>
            {props.title}
        </div>
    );
}

const baseStyle = `
    text-[30px]
    bg-transparent 
    text-gray-500
    py-5 px-5
    my-2 mx-auto
    w-11/12 
    border-solid
    border-2
    border-blue-600 
    rounded-2xl
    transition-all
    shadow-2xl
    text-center
`;