// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Impor komponen baru kita
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Jika sudah login, tampilkan layout baru
  if (status === "authenticated" && session) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-muted/40">
        {/* Gunakan komponen Header dan kirim data user sebagai props */}
        <DashboardHeader user={session.user} />

        {/* Area konten utama */}
        <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-8">
          <DashboardContent />
        </main>
      </div>
    );
  }

  return null;
}
