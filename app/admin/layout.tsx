
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminSidebar from "./sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "Admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
