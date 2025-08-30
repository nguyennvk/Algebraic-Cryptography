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
    const [n, setN] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"result": null});

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
                <h1 className="text-4xl">Carmichael function</h1>
                <p className="text-lg mt-4">
                    Return the smallest number <span>{<LatexText expression="m"></LatexText>}</span> such 
                    that every number coprime with <span>{<LatexText expression="n"></LatexText>}</span> raise
                    to <span>{<LatexText expression="m"></LatexText>}</span> 
                    congurent to 1 mod  <span>{<LatexText expression="n"></LatexText>}</span>
                </p>
                <SimpleInput value={n} name="n" onChange={handleNChange}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/carmichael_func?n=${n}`)
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
                    <p>Result: <span>{<LatexText expression={`${solution.result}`}></LatexText>}</span></p>
                </div>
            </div>
        </div>
        
    );
}
