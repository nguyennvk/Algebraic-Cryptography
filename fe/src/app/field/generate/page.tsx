'use client'
import React from "react";
import { useState, useEffect } from "react";
import LatexText from "@/components/textLikeComponents/LatexText";
import SolveButton from "@/components/button/SolveButton";
import dotenv from 'dotenv';
import {polyToLatex} from "@src/utils/polynomialFunction";
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5555';

function isDigit(str: string) {
    return /^\d+$/.test(str) || str === "";
}


import SimpleInput from "@/components/inputLikeComponents/SimpleInput";
import { error } from "console";
export default function PowerModPage() {
    const [p, setP] = useState("");
    const [d, setD] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({
        "add": [], 
        "prod": [],
        "elements": {},
        "irreducible_poly": {}
    });
    const [elements, setElements] = useState([]);
    const [error, setError] = useState("");

    const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setP(value);
            setShowSolution(false);
        }
    };

    const handleDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setD(value);
            setShowSolution(false);
        }
    };

    useEffect(
        () => {
            if (p&&d){
                setEquation(true)
            } else {
                setEquation(false);
                setShowSolution(false);
            }
        }, [p, d]
    )

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl">Generate Field</h1>
                <p className="text-lg mt-4">
                    Generate a finite field with <span>{<LatexText expression="p^d"></LatexText>}</span> elements
                </p>
                <SimpleInput value={p} name="p" onChange={handlePChange}/>
                <SimpleInput value={d} name="d" onChange={handleDChange}/>
                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            fetch(`${BACKEND_URL}/generate_field?p=${p}&d=${d}`)
                            .then(async (res) => {
                            if (!res.ok) {
                                setHaveSolution(false);
                                setShowSolution(true);
                                setError((await res.json()).error)
                            }
                            else{
                                const data = await res.json()
                                setSolution(data);
                                setShowSolution(true);
                                setHaveSolution(true);
                                setElements(data["elements"].map(n=>[polyToLatex(n)]));
                                console.log(data);
                            }
                            })
                            .catch((error) => {
                                console.error("Error fetching data:", error);
                            });
                        }}/>
                </div>

                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                    <p className="flex justify-center mt-4 text-red-500">{error}</p>
                </div>
            </div>
                <div className="mt-5 ml-10" style={{display: showSolution&&haveSolution ? "block" : "none"}}>
                    <p>Irreducible polynomial: <span>{<LatexText expression={`${polyToLatex(solution.irreducible_poly)}`}></LatexText>}</span></p>
                    <p>Elements in the field:</p>
                    <table className="mt-5">
                        <tbody>
                           {elements.map((poly, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-2 py-1 text-center">
                                        <span>{<LatexText expression={`${poly}`}></LatexText>}</span>
                                    </td>
                                </tr>
                            ))} 
                        </tbody>
                    </table>
                    <p className="mt-5">Addition table:</p>
                    <table className="mt-5">
                        <tbody>
                           {solution["add"].map((row, index) => (
                                <tr key={index}>
                                    {
                                        row.map((e, r) => (
                                        <td key={r} className="border border-gray-300 px-2 py-1 text-center">
                                            <span>{<LatexText expression={`${polyToLatex(e)}`}></LatexText>}</span>
                                        </td>
                                        ))
                                    }
                                </tr>
                            ))} 
                        </tbody>
                    </table>
                    <p className="mt-5">Product table:</p>
                    <table className="mt-5">
                        <tbody>
                           {solution["prod"].map((row, index) => (
                                <tr key={index}>
                                    {
                                        row.map((e, r) => (
                                        <td key={r} className="border border-gray-300 px-2 py-1 text-center">
                                            <span>{<LatexText expression={`${polyToLatex(e)}`}></LatexText>}</span>
                                        </td>
                                        ))
                                    }
                                </tr>
                            ))} 
                        </tbody>
                    </table>

                </div>
        </div>
    );
}
