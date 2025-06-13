// src/components/ui/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "./button"; // Menggunakan komponen Button yang sudah ada

const LogoutButton = () => {
  return (
    <Button
      variant="destructive" // Menggunakan varian warna merah
      onClick={() => signOut({ callbackUrl: "/login" })} // Memanggil fungsi signOut
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
