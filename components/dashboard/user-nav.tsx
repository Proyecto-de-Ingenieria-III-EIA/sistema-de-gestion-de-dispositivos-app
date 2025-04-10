"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

export function UserNav() {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">User</p>
            <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              await signOut({ redirect: false });

              // Get Auth0 domain and ensure it has https:// prefix
              let auth0Domain = process.env.NEXT_PUBLIC_AUTH0_ISSUER || "";
              if (!auth0Domain.startsWith("https://") && !auth0Domain.startsWith("http://")) {
                auth0Domain = `https://${auth0Domain}`;
              }

              const returnTo = encodeURIComponent(window.location.origin);
              const logoutUrl = `${auth0Domain}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${returnTo}`;

              window.location.href = logoutUrl;
            } catch (error) {
              console.error("Logout error:", error);
            }
          }}
          className="cursor-pointer"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

