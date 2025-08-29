import react from 'react';
import "./SearchBox.css";

export default function AutofillContent( { children }: { children: React.ReactNode[] }) {
    return (
        <div className="autofill-content" style={{ display: children.length > 0 ? 'block' : 'none' }}>
            {children}
        </div>
        )
}