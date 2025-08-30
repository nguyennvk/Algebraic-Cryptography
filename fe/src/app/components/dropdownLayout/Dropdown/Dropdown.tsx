'use client'
import react from 'react';
import {useRouter} from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import DropdownButton from '@/components/dropdownLayout/DropdownButton/DropdownButton';
import DropdownContent from '@/components/dropdownLayout/DropdownContent/DropdownContent';
import DropdownItem from '@/components/dropdownLayout/DropdownItem/DropdownItem';
import "./Dropdown.css";

interface DropdownProps {
    buttonText?: string;
    items: string[];
    routes: string[];
}

export default function Dropdown({ buttonText, items, routes}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        console.log("Dropdown toggled");
    };

    const itemsComponents = items.map((item, index) => (
        <DropdownItem key={index} onClick={() => router.push(routes[index])}>
            {item}
        </DropdownItem>
    ));

    useEffect(() => {
        const handler = (event: MouseEvent) => {
          if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
            setIsOpen(false);
          }
        };
    
        document.addEventListener("click", handler);
    
        return () => {
          document.removeEventListener("click", handler);
        };
      }, [dropdownRef]);

    return (
        <div ref={dropdownRef} className="dropdown">
            <DropdownButton open={isOpen} onClick={toggleDropdown}>
              {buttonText}
            </DropdownButton>
            <DropdownContent open={isOpen} items={itemsComponents}/>
        </div>
    )
}