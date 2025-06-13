// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  // 1. Ganti state 'email' menjadi 'identifier'
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        // 2. Kirim 'identifier', bukan lagi 'email'
        identifier: identifier,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard"); // Arahkan ke dashboard setelah login
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 3. Ubah komponen Input untuk 'identifier' */}
            <div className="space-y-1">
              <Label htmlFor="identifier">Email atau Username</Label>
              <Input
                id="identifier"
                type="text" // Ganti jadi text agar bisa username atau email
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="Masukkan email atau username"
                disabled={loading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mencoba Masuk..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Daftar di sini
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
