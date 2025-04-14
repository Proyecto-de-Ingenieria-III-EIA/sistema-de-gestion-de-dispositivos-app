"use client"

import { ReactNode } from "react";
import { NavContext, useNav } from "../hooks/use-mobile-nav";

interface NavProviderProps {
  children: ReactNode;
}

export function NavProvider({ children }: NavProviderProps) {
  const navState = useNav();

  return (
    <NavContext.Provider value={navState}>
      {children}
    </NavContext.Provider>
  );
}

// Keep old component name for backward compatibility
export const MobileNavProvider = NavProvider; 