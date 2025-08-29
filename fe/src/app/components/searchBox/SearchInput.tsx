'use client'
import React, { useState, useRef, useEffect } from 'react';
import "./SearchBox.css";
import dotenv from 'dotenv';
dotenv.config();

interface SearchInputProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}
export default function SearchInput({searchTerm, setSearchTerm}: SearchInputProps) {
    
    return (
        <input
            type="text"
            placeholder="Search..."
            className="search-input w-210"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    )
}