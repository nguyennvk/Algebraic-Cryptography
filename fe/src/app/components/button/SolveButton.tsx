import React from 'react';
import "./button.css";
export default function SolveButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="solve-button"
        >
            Solve
        </button>
    );
}