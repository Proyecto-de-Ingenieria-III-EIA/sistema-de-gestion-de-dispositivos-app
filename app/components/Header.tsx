"use client"

import Link from "next/link"
import { Button, Skeleton } from "@/components/atomic-design/atoms"
import { useSession } from "next-auth/react"
import { UserNav } from "@/components/atomic-design/organisms"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/atomic-design/molecules/theme-toggle"

export default function Header() {
  const { status } = useSession()
  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"
  
  // Add mounted state to avoid hydration mismatches
  const [mounted, setMounted] = useState(false)
  
  // Only show auth-dependent UI after component has mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              StreamLine
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link
              href="#features"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {!mounted ? (
              // Show static skeleton during SSR and hydration
              <div className="flex items-center space-x-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ) : isLoading ? (
              // Show loading state when auth is being determined
              <div className="flex items-center space-x-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ) : isAuthenticated ? (
              // Show authenticated UI
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <UserNav />
              </>
            ) : (
              // Show unauthenticated UI
              <>
                <Link href="/login" className="hidden sm:inline-flex">
                  <Button variant="outline">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

