'use client'
import React from "react";
import { useState, useEffect } from "react";
import LatexText from "@/components/textLikeComponents/LatexText";
import SolveButton from "@/components/button/SolveButton";
import dotenv from 'dotenv';
import {parsePoly, extractPoly} from "@src/utils/polynomialFunction";
dotenv.config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5555';

function isDigit(str: string) {
    return /^\d+$/.test(str) || str === "";
}


import SimpleInput from "@/components/inputLikeComponents/SimpleInput";
import { error } from "console";
export default function PowerModPage() {
    const [n, setN] = useState("");
    const [x0, setX0] = useState("");
    const [poly, setPoly] = useState("");
    const [equation, setEquation] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [haveSolution, setHaveSolution] = useState(true);
    const [solution, setSolution] = useState({"steps": null, "result": null});
    const [error, setError] = useState("");

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setN(value);
            setShowSolution(false);
        }
    };
    const handleX0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isDigit(value)) {
            setX0(value);
            setShowSolution(false);
        }
    };
    const handlePolyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPoly(value)
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
                    Crack RSA problem with not large number using Pollard’s Rho algorithm with steps and customized
                    polynomial.
                </p>
                <SimpleInput value={n} name="n" onChange={handleNChange}/>
                <SimpleInput value={x0} name="x0" onChange={handleX0Change}/>
                <SimpleInput value={poly} name="poly" onChange={handlePolyChange}/>
                <p className="text-lg mt-4">Your polynomial: <span>{<LatexText expression={`${poly}`}></LatexText>}</span></p>

                <div className="mt-5" style={{display: equation ? "block" : "none"}}>
                    <SolveButton onClick={() => {
                            const payload = {
                                n: parseInt(n),
                                poly: extractPoly(poly),
                                x0: parseInt(x0)
                            };
                            fetch(`${BACKEND_URL}/rsa_crack_rho`,
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
                    <p>Result: <span>{<LatexText expression={`${solution.result}`}></LatexText>}</span> is one of the factor.</p>
                </div>
                {haveSolution && solution["steps"] !== null &&
                <div className="w-screen ml-10" style={{display: showSolution&&haveSolution ? "block" : "none"}}>
                    <div>
                        <p>Consider the adjusted Pollard's method:</p>
                        <table className="border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                <th className="border border-gray-300 px-2 py-1"><span>{<LatexText expression="x_m"></LatexText>}</span></th>
                                <th className="border border-gray-300 px-2 py-1"><span>{<LatexText expression="x_{2^k-1}"></LatexText>}</span></th>
                                <th className="border border-gray-300 px-2 py-1"><span>{<LatexText expression="gcd(x_m-x_{2^k-1}, n)"></LatexText>}</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {solution["steps"].map((p, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-2 py-1"><span>{<LatexText expression={`x_{${index}}`}></LatexText>}</span> = {p.x_m}</td>
                                    <td className="border border-gray-300 px-2 py-1"><span>{p.x_k != null && <LatexText expression={`x_{${2**p.k-1}}=`}></LatexText>}</span> {p.x_k}</td>
                                    <td className="border border-gray-300 px-2 py-1">{p.gcd}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>}
                <div style={{display: showSolution&&!haveSolution ? "block" : "none"}}>
                    <p className="flex justify-center mt-4 text-red-500">There is no solution to the equation. Double check your polynomial</p>
                </div>
            </div>
        </div>

    );
}
