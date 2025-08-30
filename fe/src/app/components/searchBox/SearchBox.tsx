'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from './SearchInput';
import AutofillContent from './AutofillContent';
import AutofillItem from './AutofillItem';
import "./SearchBox.css";
import dotenv from 'dotenv';
dotenv.config();


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5555';
export default function SearchBox() {
    const [searchTerm, setSearchTerm] = useState('');
const [autoItem, setAutoItem] = useState<React.ReactNode[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch(`${BACKEND_URL}/autofill?word=${searchTerm}`).then(res => res.json()).then(data => {
            setAutoItem(Object.keys(data).map((item, index) => {
                return (
                    <AutofillItem key={index} onClick={() => router.push(data[item][0])}>{item}</AutofillItem>
                )
            }
            ));
        }
        ).catch(err => {
            console.error("Error fetching data:", err);
        }
        );
    }, [searchTerm]);


    return (
    <div className="search-box">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <AutofillContent>{autoItem}</AutofillContent>
    </div>
    )
}