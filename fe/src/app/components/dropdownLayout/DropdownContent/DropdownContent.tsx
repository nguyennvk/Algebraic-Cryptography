import React from "react";
import "./DropdownContent.css";

interface DropdownContentProps {
    open: boolean;
    items?: React.ReactNode;
}

export default function DropdownContent({open, items}: DropdownContentProps) {
    return (
        <div className="dropdown-content" style={{ display: open ? "block" : "none" }}>
           {items}
        </div>
    )
}