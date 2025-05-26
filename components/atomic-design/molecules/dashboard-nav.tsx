"use client"

import Link from "next/link"
import { BarChart3, LayoutDashboard, Users, Ticket, Smartphone } from "lucide-react"
import { useMobileNavContext } from "@/hooks/use-mobile-nav"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/atomic-design/atoms/button"
import { Enum_RoleName } from "@prisma/client"

interface DashboardNavProps {
  currentPath: string;
}

export function DashboardNav({ currentPath }: DashboardNavProps) {
  const { isOpen, setIsOpen } = useMobileNavContext();
  const { data: session } = useSession();
  
  console.log('Session data:', session);
  console.log('User role:', session?.user?.role);

  const userRole = session?.user?.role as Enum_RoleName
  const canAccessUsers = userRole === Enum_RoleName.ADMIN
  const canAccessTickets = userRole && [
    Enum_RoleName.ADMIN,
    Enum_RoleName.TECHNICAL,
    Enum_RoleName.COORDINATOR
  ].includes(userRole)
  const canAccessDevices = userRole === Enum_RoleName.ADMIN

  console.log('Can access users:', canAccessUsers);
  console.log('Can access tickets:', canAccessTickets);
  console.log('Can access devices:', canAccessDevices);

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
          <nav className="flex flex-col gap-2">
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
            {canAccessUsers && (
              <Link
                href="/users"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/users"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Users className="h-4 w-4" />
                <span>Users</span>
              </Link>
            )}
            {canAccessTickets && (
              <Link
                href="/tickets"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/tickets"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Ticket className="h-4 w-4" />
                <span>Tickets</span>
              </Link>
            )}
            {canAccessDevices && (
              <Link
                href="/devices"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/devices"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Smartphone className="h-4 w-4" />
                <span>Devices</span>
              </Link>
            )}
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
              href="/peripherals"
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
              href="/peripherals"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${currentPath === "/peripherals"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>peripherals</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}