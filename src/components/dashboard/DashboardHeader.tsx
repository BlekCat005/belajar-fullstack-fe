// src/components/dashboard/DashboardHeader.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "@/components/ui/LogoutButton";
import { Session } from "next-auth"; // Impor tipe Session

// Kita definisikan tipe props untuk komponen ini
interface DashboardHeaderProps {
  user: Session["user"];
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  // Ambil inisial dari nama lengkap, misal "Budi Santoso" -> "BS"
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "??";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 py-4 border-b h-14 bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar>
          {/* Jika ada URL gambar, tampilkan. Jika tidak, tampilkan fallback */}
          <AvatarImage src="/img/user.jpg" alt={`@${user?.username}`} />
          <AvatarFallback>{getInitials(user?.fullname)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-bold">{user?.fullname}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <div className="ml-auto">
        <LogoutButton />
      </div>
    </header>
  );
}
