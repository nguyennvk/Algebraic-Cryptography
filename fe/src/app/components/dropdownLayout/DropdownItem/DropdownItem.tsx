import React from "react";
import "./DropdownItem.css";

interface DropdownItemProps {
    children?: React.ReactNode;
    onClick?: () => void;
}

export default function DropdownItem({children, onClick}: DropdownItemProps) {
    return (
        <div className="dropdown-item" onClick={onClick}>
            {children}
        </div>
    )
}