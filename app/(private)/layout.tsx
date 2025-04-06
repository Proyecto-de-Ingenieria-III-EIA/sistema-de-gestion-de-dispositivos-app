import "../globals.css"
import { Metadata } from "next";
import { Inter } from "next/font/google"
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard - W3MyPC Device Management",
  description: "Manage your devices"
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">{children}</div>
        </Providers>
      </body>
    </html>
  );
}