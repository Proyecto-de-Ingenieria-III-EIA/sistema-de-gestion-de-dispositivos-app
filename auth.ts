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

// Ensure the issuer URL is properly formatted
const issuer = process.env.AUTH_AUTH0_ISSUER!.replace(/\/$/, ''); // Remove trailing slash if present


export const authConfig = {
  providers: [
    Auth0({
      clientId: process.env.AUTH_AUTH0_ID!,
      clientSecret: process.env.AUTH_AUTH0_SECRET!,
      issuer,
      authorization: {
        params: {
          scope: 'openid profile email',
          response_type: 'code',
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after login
      return `${baseUrl}/dashboard`;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  },
} satisfies NextAuthOptions;