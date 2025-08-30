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
export default function CarmichaelFuncPage() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [p, setP] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"determinant": null});
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
    const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setP(value);
            setShowSolution(false);
        }
    };
    useEffect(
        () => {
            if (a&&p&&b){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [a, p, b]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">Elliptic Curve determinant</h1>
                <p className="text-lg mt-4">
                    Return the determinant of an Elliptic Curve <span>{<LatexText expression="y^2=x^3+ax+b"></LatexText>}</span> lives 
                                        in <span>{<LatexText expression="F_p"></LatexText>}</span>
                </p>
                <SimpleInput value={a} name="a" onChange={handleAChange}/>
                <SimpleInput value={b} name="b" onChange={handleBChange}/>
                <SimpleInput value={p} name="p" onChange={handlePChange}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/elliptic_curve/determinant?a=${a}&b=${b}&p=${p}`)
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
                    <p>Result: <span>{<LatexText expression={`${solution.determinant}`}></LatexText>}</span></p>
                </div>
                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                    <p className="flex justify-center mt-4 text-red-500">There is no solution to the equation. {error}</p>
                </div>

            </div>
        </div>
        
    );
}