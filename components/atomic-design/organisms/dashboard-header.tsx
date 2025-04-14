"use client"

import { Menu, X } from "lucide-react"
import { ThemeToggle } from "../molecules/theme-toggle";
import { UserNav } from ".";
import { useMobileNavContext } from "@/hooks/use-mobile-nav"

export function DashboardHeader() {
  const { isOpen, toggle } = useMobileNavContext();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-semibold">
          <button 
            className="flex items-center justify-center rounded-md p-2 hover:bg-accent"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <span className="hidden sm:inline-block">W3MyPC Device Manager</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
} 