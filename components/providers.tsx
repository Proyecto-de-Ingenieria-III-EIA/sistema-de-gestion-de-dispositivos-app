"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { MobileNavProvider } from "@/components/providers/mobile-nav-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MobileNavProvider>
          {children}
        </MobileNavProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
