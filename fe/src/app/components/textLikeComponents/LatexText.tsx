import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexProps {
  expression: string;
  displayMode?: boolean; // true for block, false for inline
  style?: React.CSSProperties; // optional style prop
  className?: string; // optional className prop
}

export default function LatexText({ expression, displayMode = false, style, className }: LatexProps) {
    const spanRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (spanRef.current) {
        katex.render(expression, spanRef.current, {
            throwOnError: false,
            displayMode,
        });
        }
    }, [expression, displayMode]);

    return <span className={className} ref={spanRef} style={style}/>;

}