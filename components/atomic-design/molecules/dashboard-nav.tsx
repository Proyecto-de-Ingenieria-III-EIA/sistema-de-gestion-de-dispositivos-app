"use client"

import Link from "next/link"
import { BarChart3, LayoutDashboard } from "lucide-react"

interface DashboardNavProps {
  currentPath: string;
}

export function DashboardNav({ currentPath }: DashboardNavProps) {
  return (
    <div className="hidden border-r bg-background md:block md:w-64">
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
              }`}>
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/loans"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/loans"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}>
            <BarChart3 className="h-4 w-4" />
            <span>Loans</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

