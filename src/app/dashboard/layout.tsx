
"use client";
import * as React from "react";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Or a redirect, but AuthProvider also handles this
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header isDashboard={true} />
      <main className="flex-1 p-4 sm:px-6 sm:py-8 md:gap-8 bg-background rounded-lg shadow-sm mt-16"> {/* Added mt-16 for fixed header */}
        {children}
      </main>
    </div>
  );
}
