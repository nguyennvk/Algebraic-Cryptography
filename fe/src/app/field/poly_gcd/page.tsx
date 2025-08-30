'use client'
import React from "react";
import { useState, useEffect } from "react";
import LatexText from "@/components/textLikeComponents/LatexText";
import SolveButton from "@/components/button/SolveButton";
import dotenv from 'dotenv';
import {extractPoly, polyToLatex} from "@src/utils/polynomialFunction";
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5555';

function isDigit(str: string) {
    return /^\d+$/.test(str) || str === "";
}

import SimpleInput from "@/components/inputLikeComponents/SimpleInput";
import { error } from "console";
export default function PowerModPage() {
    const [poly1, setPoly1] = useState("");
    const [poly2, setPoly2] = useState("");
    const [p, setP] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({});
    const [error, setError] = useState("");

    const handlePoly1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
            setPoly1(value);
            setShowSolution(false);
    };

    const handlePoly2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
            setPoly2(value);
            setShowSolution(false);
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
            if (poly1&&poly2&&p){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [poly1, poly2, p]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">GCD of polynomial function</h1>
                <p className="text-lg mt-4">
                    Return the polynomial GCD of 2 polynomial functions in field  <span>{<LatexText expression="p"></LatexText>}</span>
                </p>
                <div>
                    <SimpleInput value={poly1} name="first function" onChange={handlePoly1Change}/>
                    <SimpleInput value={poly2} name="second function" onChange={handlePoly2Change}/>
                    <SimpleInput value={p} name="p" onChange={handlePChange}/>
                    <p className="text-lg mt-4">First polynomial: <span>{<LatexText expression={`${poly1}`}></LatexText>}</span></p>
                    <p className="text-lg mt-4">Second polynomial: <span>{<LatexText expression={`${poly2}`}></LatexText>}</span></p>
                </div>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            const payload = {
                                poly1: extractPoly(poly1),
                                poly2: extractPoly(poly2),
                                p: parseInt(p)
                            };
                            console.log(payload.poly1);
                            console.log(payload.poly2);
                            fetch(`${BACKEND_URL}/poly_gcd`,
                                {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(payload),
                                }
                            )
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
                    <p>Result: <span>{<LatexText expression={`${polyToLatex(solution)}`}></LatexText>}</span></p>
                </div>
                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                <p className="flex justify-center mt-4 text-red-500">There is no solution to the equation. {error}</p>
            </div>
            </div>
        </div>
        
    );
}
