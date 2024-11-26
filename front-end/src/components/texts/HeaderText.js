import React from "react"
export default function HeaderText({ props }) {
    return (
        <div className="text-center">
            <h1 className="text-blue-900 text-4xl font-bold">{props.title}</h1>
            <h3 className="text-blue-900 text-2xl font-semibold italic">{props.subtitle}</h3>
        </div>
    )
}