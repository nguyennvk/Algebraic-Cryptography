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

function parseExpression(obj: null | Record<number, number>){
    let expr = "";
    if (obj === null) return "";
    for (const [k, v] of Object.entries(obj)) {
        if (v == 1)
        {
            expr += k as string
        }
        else{
            expr += `${k}^${v}`
        }
        expr += "\\cdot"
    }
    return expr.slice(0, -5);
}

import SimpleInput from "@/components/inputLikeComponents/SimpleInput";
import { error } from "console";
export default function PowerModPage() {
    const [n, setN] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"factors": null});

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setN(value);
            setShowSolution(false);
        }
    };

    useEffect(
        () => {
            if (n){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [n]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">RSA (Integer Factorisation Problem)</h1>
                <p className="text-lg mt-4">
                    Return the factorization of n.
                </p>
                <SimpleInput value={n} name="n" onChange={handleNChange}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/rsa_crack?n=${n}`)
                            .then((res) => {
                                if (!res.ok) {
                                    setHaveSolution(false);
                                }
                                return res.json();
                                })
                            .then((data) => {
                                setSolution(data);
                                setShowSolution(true);
                            })
                            .catch((error) => {
                                console.error("Error fetching data:", error);
                            });
                        }}/>
                </div>
                <div className="mt-5" style={{display: showSolution&&haveSolution ? "block" : "none"}}>
                    <p>Result: <span>{<LatexText expression={`${parseExpression(solution.factors)}`}></LatexText>}</span></p>
                </div>
                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                <p className="flex justify-center mt-4 text-red-500">There is no solution to the equation.</p>
            </div>
            </div>
        </div>
        
    );
}
