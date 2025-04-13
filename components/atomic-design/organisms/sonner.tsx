"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type SonnerToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: SonnerToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as SonnerToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Export with a different name to avoid conflicts
export { Toaster as SonnerToaster }
