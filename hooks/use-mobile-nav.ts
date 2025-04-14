import { useState, useEffect, createContext, useContext } from 'react';

type NavContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
};

const initialState: NavContextType = {
  isOpen: false,
  setIsOpen: () => {},
  toggle: () => {},
};

export const NavContext = createContext<NavContextType>(initialState);

export function useNav() {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggle = () => setIsOpen(prev => !prev);
  
  // Close the menu when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleEscapeKey);
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    toggle
  };
}

export function useNavContext() {
  return useContext(NavContext);
}

// Keep old function names for backward compatibility
export const MobileNavContext = NavContext;
export const useMobileNavContext = useNavContext; 