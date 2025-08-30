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
export default function GCDPage() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"gcd": null});

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


    useEffect(
        () => {
            if (a&&b){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [a, b]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">Greatest Common Divisor</h1>
                <p className="text-lg mt-4">
                    Return the greatest common divisor of <span>{<LatexText expression="a"></LatexText>}</span> and <span>{<LatexText expression="b"></LatexText>}</span>
                </p>
                <SimpleInput value={a} name="a" onChange={handleAChange}/>
                <SimpleInput value={b} name="b" onChange={handleBChange}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/gcd?a=${a}&b=${b}`)
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
                    <p>Result: <span>{<LatexText expression={`${solution.gcd}`}></LatexText>}</span></p>
                </div>
            </div>
        </div>
        
    );
}
