import "../globals.css"
import { Metadata } from "next";
import { Inter } from "next/font/google"
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard - StreamLine",
  description: "Manage your account"
}

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 ${inter.className}`}>
      {children}
    </div>
  );
}