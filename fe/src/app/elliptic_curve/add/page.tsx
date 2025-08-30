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
    const [x1, setX1] = useState("");
    const [y1, setY1] = useState("");
    const [x2, setX2] = useState("");
    const [y2, setY2] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"result": []});
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
    const handleX1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setX1(value);
            setShowSolution(false);
        }
    };
    const handleY1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setY1(value);
            setShowSolution(false);
        }
    };
    const handleX2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setX2(value);
            setShowSolution(false);
        }
    };
    const handleY2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setY2(value);
            setShowSolution(false);
        }
    };
    useEffect(
        () => {
            if (a&&p&&b&&x1&&y1&&x2&&y2){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [a, p, b, x1, y1, x2, y2]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">Points addition on an Elliptic Curve</h1>
                <p className="text-lg mt-4">
                    Return the addition of point P = (x1, y1) and Q = (x2, y2) on an Elliptic Curve <span>{<LatexText expression="y^2=x^3+ax+b"></LatexText>}</span> lives 
                                        in <span>{<LatexText expression="F_p"></LatexText>}</span> 
                </p>
                <SimpleInput value={a} name="a" onChange={handleAChange}/>
                <SimpleInput value={b} name="b" onChange={handleBChange}/>
                <SimpleInput value={p} name="p" onChange={handlePChange}/>
                <SimpleInput value={x1} name="x1" onChange={handleX1Change}/>
                <SimpleInput value={y1} name="y1" onChange={handleY1Change}/>
                <SimpleInput value={x2} name="x2" onChange={handleX2Change}/>
                <SimpleInput value={y2} name="y2" onChange={handleY2Change}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/elliptic_curve/points_add?a=${a}&b=${b}&p=${p}&x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`)
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
                    <p>Result: <span>{<LatexText expression={`(${solution.result})`}></LatexText>}</span></p>
                </div>
                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                    <p className="flex justify-center mt-4 text-red-500">There is no solution to the equation. {error}</p>
                </div>

            </div>
        </div>
        
    );
}