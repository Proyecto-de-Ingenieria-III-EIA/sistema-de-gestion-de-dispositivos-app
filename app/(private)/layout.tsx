import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/auth";

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
      <main className="flex-1 overflow-auto">
        <div className="container">{children}</div>
      </main>
  );
}