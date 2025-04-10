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
  console.log("callbackUrl", callbackUrl);

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push(callbackUrl);
    } else {
      signIn("auth0", { callbackUrl, redirect: false })
        .then((result) => {
          if (result?.ok) {
            console.log("Callback URL:", callbackUrl);
            router.push(callbackUrl);
          } else {
            // Imprime el error devuelto por signIn para depuración
            console.error("SignIn did not succeed:", result?.error);
          }
        })
        .catch((error) => {
          console.error("Error signing in:", error);
        });
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