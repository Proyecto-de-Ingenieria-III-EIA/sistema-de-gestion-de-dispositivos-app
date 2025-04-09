'use client';

import React, { Suspense, useEffect } from "react";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push(callbackUrl);
    } else {
      signIn("auth0", { callbackUrl, redirect: false })
        .then((result) => {
          if (result?.ok) {
            router.push(callbackUrl);
          }
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