'use client'
import React from "react";
import { useState, useEffect } from "react";
import LatexText from "@/components/textLikeComponents/LatexText";
import SolveButton from "@/components/button/SolveButton";
import dotenv from 'dotenv';
import beautifyExpression from "@src/utils/BeautifyExpression";
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5555';

function isDigit(str: string) {
    return /^\d+$/.test(str) || str === "";
}

import SimpleInput from "@/components/inputLikeComponents/SimpleInput";
import { error } from "console";
export default function MulInversePage() {
    const [a, setA] = useState("");
    const [p, setP] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"inverse": null});
    const [error, setError] = useState("");

    const handleAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setA(value);
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
            if (a&&p){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [a, p]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">Multiplicative Inverse</h1>
                <p className="text-lg mt-4">
                    Return the modulo inverse of <span>{<LatexText expression="a"></LatexText>}</span> with respect to <span>{<LatexText expression="p"></LatexText>}</span>
                </p>
                <SimpleInput value={a} name="a" onChange={handleAChange}/>
                <SimpleInput value={p} name="p" onChange={handlePChange}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/mul_inverse?a=${a}&p=${p}`)
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
                    <p>Result: <span>{<LatexText expression={`${solution.inverse}`}></LatexText>}</span></p>
                </div>
                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                    <p className="flex justify-center mt-4 text-red-500">There is no solution. {error}</p>
                </div>

            </div>
        </div>
        
    );
}
