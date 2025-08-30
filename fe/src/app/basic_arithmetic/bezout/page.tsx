'use client'
import React from "react";
import { useState, useEffect } from "react";
import LatexText from "@/components/textLikeComponents/LatexText";
import SolveButton from "@/components/button/SolveButton";
import dotenv from 'dotenv';
import beautifyExpression from "@src/utils/beautifyExpression";
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5555';

function isDigit(str: string) {
    return /^\d+$/.test(str) || str === "";
}
// inner object: maps string -> number
type InnerMap = Record<string, number>;

// refined/raw: maps string -> InnerMap
type NestedMap = Record<string, InnerMap>;

interface Solution {
  k: number | null;
  raw: NestedMap;
  gcd: number | null;
  refined: NestedMap;
  x: number | null;
  y: number | null;
}

import SimpleInput from "@/components/inputLikeComponents/SimpleInput";
import { error } from "console";
export default function BezoutPage() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [c, setC] = useState("");
    const [equation, setEquation] = useState(false);
    const [solution, setSolution] = useState<Solution>({
    k: null,
    raw: {},
    gcd: null,
    refined: {},
    x: null,
    y: null,
    });
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [error, setError] = useState("");

    const handleAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setA(value);
            setShowSolution(false);
        }
    };
    const handleBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setB(value);
            setShowSolution(false);
        }
    };
    const handleCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setC(value);
            setShowSolution(false);
        }
    };

    useEffect(() => {
        if (a && b && c) {
            setEquation(true);
        } else {
            setEquation(false);
            setShowSolution(false);
        }
    }, [a, b, c]);


    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">Bezout&apos;s Identity</h1>
                <p className="relative z-0 text-lg mt-4">
                    Please enter a, b, c as the equation <span>{<LatexText expression="ax+by=c"></LatexText>}</span>.
                </p>
                <SimpleInput value={a} name="a" onChange={handleAChange}/>
                <SimpleInput value={b} name="b" onChange={handleBChange}/>
                <SimpleInput value={c} name="c" onChange={handleCChange}/>
                <div style={{display: equation ? "block" : "none"}}>
                    <LatexText className="text-3xl" expression={beautifyExpression({'x': a, 'y': b})+"="+c} displayMode={true}/>
                </div>
                <div style={{display: equation ? "block" : "none"}}>
                <SolveButton onClick={() => {
                        if (!equation) {
                            setShowSolution(false);
                            return;
                        }
                        fetch(`${BACKEND_URL}/bezout?a=${a}&b=${b}&c=${c}`)
                        .then(async (res) => {
                            if (!res.ok) {
                                setHaveSolution(false);
                                setShowSolution(true);
                                setError((await res.json()).error)
                            }
                            else{
                                setSolution(await res.json());
                                setShowSolution(true);
                                setHaveSolution(true);
                            }
                            })
                        .catch((error) => {
                            console.error("Error fetching data:", error);
                        });
                        
                    }}/>
                </div>
            </div>
            {haveSolution && 
            <div className="w-screen ml-10" style={{display: showSolution&&haveSolution ? "block" : "none"}}>
                <div>
                    <p>Consider the problem:</p>
                    <div className="flex flex-row items-center">
                        <LatexText expression={beautifyExpression({'x': a, 'y': b})+`=gcd(${a},${b})=`+solution.gcd} displayMode={true}/>
                    </div>
                    <p>We have the following:</p>
                    {Object.entries(solution.raw).reverse().map(([key, value]) => (
                            <div key={key}>
                                <LatexText key={key} expression={key+"="+beautifyExpression(value)+"="+`${a}\\cdot${solution.refined[key][a]}+${b}\\cdot${solution.refined[key][b]}`}/>
                            </div>
                        ))}
                </div>
                <div className="mt-5">
                    <p>The solution to the above equation is:</p>
                    <LatexText expression={`x=${solution.x}, y=${solution.y}`}/>
                    <p>The factor is {solution.k}</p>
                    <p>So the solution to the original equation is:</p>
                    {solution.x != null && solution.y != null && solution.k != null && (
                    <LatexText
                        expression={`x=${solution.x}\\cdot${solution.k}=\\textcolor{green}{${solution.x * solution.k}}, 
                                    y=${solution.y}\\cdot${solution.k}=\\textcolor{green}{${solution.y * solution.k}}`}
                    />
                    )}
                </div>
                <div className="mt-5">
                    <p>The general solution is:</p>
                    {solution.x != null && solution.y != null && solution.k != null && solution.gcd != null &&(
                     <LatexText expression={`(${solution.x*solution.k}-k\\cdot${solution.k*parseInt(b)/solution.gcd}, ${solution.y*solution.k}+k\\cdot${solution.k*parseInt(a)/solution.gcd})`}/>
                    )}

                </div>
            </div>}
            <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                <p className="flex justify-center mt-4 text-red-500">There is no solution to the equation. {error}</p>
            </div>

        </div>
        
    );
}
