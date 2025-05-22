'use client';

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/atomic-design/molecules";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  let callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  if (callbackUrl === "/") callbackUrl = "/dashboard";

  useEffect(() => {
    // Check for error in URL
    const error = searchParams.get("error");
    if (error) {
      setError(
        error === "OAuthSignin" 
          ? "There was a problem signing in with Auth0. Please try again."
          : "An error occurred during sign in. Please try again."
      );
    }

    if (status === "loading") return;
    
    if (session) {
      router.push(callbackUrl);
    } else {
      try {
        signIn("auth0", { 
          callbackUrl, 
          redirect: false 
        }).catch((error) => {
          console.error("Sign in error:", error);
          setError("Failed to initiate sign in. Please try again.");
        });
      } catch (error) {
        console.error("Error during sign in attempt:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }, [session, status, router, callbackUrl, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Signing in...</h1>
          <p className="text-muted-foreground">Please wait while we redirect you to the login page.</p>
        </div>
      </div>
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