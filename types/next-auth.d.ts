import "next-auth";
import { DefaultSession } from "next-auth"
import { Enum_RoleName } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Enum_RoleName
    } & DefaultSession["user"]
  }
} 