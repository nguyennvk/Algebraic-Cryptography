import React from "react";

interface SimpleInputProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
}
export default function SimpleInput({name, value, onChange}: SimpleInputProps) {
    return (
        <div className="flex flex-row items-center">
            <p className="text-lg mt-4">
                {name}:
            </p>
            <input
                type="text"
                value={value}
                onChange={(e) => {onChange(e)}}
                className="border border-gray-300 rounded p-2 mt-4 ml-2"
            />
        </div>
    )
}