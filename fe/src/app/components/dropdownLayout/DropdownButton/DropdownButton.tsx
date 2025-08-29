'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./DropdownButton.css";

interface DropdownButtonProps {
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function Dropdown({open, onClick, children}: DropdownButtonProps) {
 
  return (
    <div onClick={onClick} className='dropdown-btn'>
        {children}
        <span className='dropdown-icon'>
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </span>
    </div>
  );
}