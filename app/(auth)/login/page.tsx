'use client';

import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, useSession, SessionProvider } from "next-auth/react";

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
      try {
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