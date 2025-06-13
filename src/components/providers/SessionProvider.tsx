// src/components/providers/SessionProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

// Ini adalah komponen sederhana yang hanya membungkus aplikasi kita
// dengan provider dari Next-Auth.
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
