import { type NextAuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";

// Verify required environment variables are set
const requiredEnvVars = [
  "AUTH_AUTH0_ID",
  "AUTH_AUTH0_SECRET",
  "AUTH_AUTH0_ISSUER",
  "AUTH_SECRET"
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}

export const authConfig = {
  providers: [
    Auth0({
      clientId: process.env.AUTH_AUTH0_ID!,
      clientSecret: process.env.AUTH_AUTH0_SECRET!,
      issuer: process.env.AUTH_AUTH0_ISSUER!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
} satisfies NextAuthOptions;