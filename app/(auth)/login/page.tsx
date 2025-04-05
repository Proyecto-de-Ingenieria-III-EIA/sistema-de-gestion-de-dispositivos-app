'use client';

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/private";

  useEffect(() => {
    signIn("auth0", { callbackUrl });
  }, [callbackUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting to Auth0...</p>
    </div>
  );
}