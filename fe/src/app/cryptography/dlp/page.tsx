'use client'
import React from "react";
import { useState, useEffect } from "react";
import LatexText from "@/components/textLikeComponents/LatexText";
import SolveButton from "@/components/button/SolveButton";
import dotenv from 'dotenv';
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5555';

function isDigit(str: string) {
    return /^\d+$/.test(str) || str === "";
}

import SimpleInput from "@/components/inputLikeComponents/SimpleInput";
import { error } from "console";
export default function PowerModPage() {
    const [g, setG] = useState("");
    const [y, setY] = useState("");
    const [p, setP] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"x": null, "i": null, "j": null});
    const [error, setError] = useState("");

    const handleGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setG(value);
            setShowSolution(false);
        }
    };

    const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setY(value);
            setShowSolution(false);
        }
    };

    const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setP(value);
            setShowSolution(false);
        }
    };

    useEffect(
        () => {
            if (g&&y&&p){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [g, y, p]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">DLP (Discrete Logarithm Problem)</h1>
                <p className="text-lg mt-4">
                    Crack DLP problem with not large number using Shank&apos;s Babystep-Giantstep algorithm.<br></br>
                    Returning <span>{<LatexText expression="n"></LatexText>}</span> such that <span>{<LatexText expression="g^n \equiv y \text{ mod } p"></LatexText>}</span> and&nbsp;
                    <span>{<LatexText expression="i, j"></LatexText>}</span> as index in Baby and Giant step, respectively.

                </p>
                <SimpleInput value={g} name="g" onChange={handleGChange}/>
                <SimpleInput value={y} name="y" onChange={handleYChange}/>
                <SimpleInput value={p} name="p" onChange={handlePChange}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/dlp_crack?g=${g}&y=${y}&p=${p}`)
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
                <div className="mt-5" style={{display: showSolution&&haveSolution ? "block" : "none"}}>
                    <p>Result: <span>{<LatexText expression={`${solution.x}`}></LatexText>}</span></p>
                    <p>Index in Baby set: <span>{<LatexText expression={`${solution.i}`}></LatexText>}</span></p>
                    <p>Index in Giant set: <span>{<LatexText expression={`${solution.j}`}></LatexText>}</span></p>
                </div>
                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                <p className="flex justify-center mt-4 text-red-500">There is no solution to the equation. {error}</p>
            </div>
            </div>
        </div>
        
    );
}
