"use client"

import Link from "next/link"
import { BarChart3, LayoutDashboard } from "lucide-react"
import { useMobileNavContext } from "@/hooks/use-mobile-nav"

interface DashboardNavProps {
  currentPath: string;
}

export function DashboardNav({ currentPath }: DashboardNavProps) {
  const { isOpen, setIsOpen } = useMobileNavContext();

  return (
    <>
      {/* Overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation sidebar - toggleable on all screen sizes */}
      <div
        id="mobile-nav"
        className={`fixed left-0 top-0 z-30 h-full w-64 transform border-r bg-background pt-16 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col gap-2 p-4">
          <div className="flex h-12 items-center border-b px-4 font-semibold">
            <span>Navigation</span>
          </div>
          <nav className="grid gap-1 px-2 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/dashboard"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/loans"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/loans"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Loans</span>
            </Link>
            <Link
              href="/map"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/map"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Map</span>
            </Link>
            <Link
              href="/Devices"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/Devices"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Device Management</span>
            </Link>
            <Link
              href="/components"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/components"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Component Registration</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}

