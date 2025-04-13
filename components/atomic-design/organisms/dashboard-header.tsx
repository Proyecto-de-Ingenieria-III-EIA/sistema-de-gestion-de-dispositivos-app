import { ThemeToggle } from "../molecules/theme-toggle";
import { UserNav } from ".";



export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-semibold">
          <span className="hidden sm:inline-block">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
} 