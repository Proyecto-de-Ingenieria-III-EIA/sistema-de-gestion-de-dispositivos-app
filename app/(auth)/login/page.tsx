'use client';

import React, { Suspense, useEffect } from "react";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  let callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  if (callbackUrl === "/") callbackUrl = "/dashboard";

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push(callbackUrl);
    } else {
      // Add a try-catch directly here and add better logging
      try {
        console.log("Attempting to sign in with Auth0...");
        signIn("auth0", { callbackUrl, redirect: false });
      } catch (error) {
        console.error("Error during sign in attempt:", error);
      }
    }
  }, [session, status, router, callbackUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </SessionProvider>
  );
}