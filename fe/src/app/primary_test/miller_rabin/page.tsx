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
    const [a, setA] = useState("");
    const [n, setN] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"result": null});
    const [error, setError] = useState("");

    const handleAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setA(value);
            setShowSolution(false);
        }
    };

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setN(value);
            setShowSolution(false);
        }
    };

    useEffect(
        () => {
            if (a&&n){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [a, n]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">Miller Rabin Primary Test</h1>
                <p className="text-lg mt-4">
                    Determine whether <span>{<LatexText expression="a"></LatexText>}</span> is a witness of <span>{<LatexText expression="n"></LatexText>}</span> under Miller Rabin Primary Test

                </p>
                <SimpleInput value={a} name="a" onChange={handleAChange}/>
                <SimpleInput value={n} name="n" onChange={handleNChange}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/primary?test=miller_rabin&a=${a}&n=${n}`)
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
                    <p>Result: <span>{<LatexText expression={`${solution.result}`}></LatexText>}</span></p>
                </div>
                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                    <p className="flex justify-center mt-4 text-red-500">{error}</p>
                </div>

            </div>
        </div>
        
    );
}
