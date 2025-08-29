import React from "react";
import "./SearchBox.css";

interface AutofillItemProps {
    children?: React.ReactNode;
    onClick?: () => void;
}

export default function AutofillItem({ children, onClick }: AutofillItemProps) {
    return (
       <div className="autofill-item" onClick={onClick}>
        {children}
        </div>
    )
}