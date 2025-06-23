// src/app/register/page.tsx
"use client";

import React, { useState } from "react";

// Impor komponen Shadcn UI
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
import { useRouter } from "next/navigation"; // Uncomment jika ingin redirect
import instance from "@/lib/instance";
import axios from "axios";

export default function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter(); // Uncomment jika ingin redirect

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await instance.post("/auth/register", {
        fullname,
        username,
        email,
        password,
      });

      setSuccessMessage(response.data.meta?.message || "Registrasi berhasil!");
      setFullname("");
      setUsername("");
      setEmail("");
      setPassword("");

      //   Opsional: Redirect;
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      // Tetap gunakan unknown untuk error handling yang lebih aman
      let errorMessageToDisplay = "Terjadi kesalahan yang tidak diketahui.";

      if (axios.isAxiosError(err)) {
        // Gunakan type guard dari Axios
        if (err.response) {
          // Error berasal dari respons API (status bukan 2xx)
          const responseData = err.response.data; // Ini adalah body respons error dari backend

          if (responseData && responseData.meta && responseData.meta.message) {
            errorMessageToDisplay = responseData.meta.message;
          }
          // Penanganan error spesifik per field dari backend
          if (
            responseData &&
            responseData.data &&
            typeof responseData.data === "object" &&
            Object.keys(responseData.data).length > 0 &&
            err.response.status === 400
          ) {
            const fieldErrorKey = Object.keys(responseData.data)[0];
            errorMessageToDisplay = `${
              fieldErrorKey.charAt(0).toUpperCase() + fieldErrorKey.slice(1)
            }: ${responseData.data[fieldErrorKey]}`;
          } else if (
            responseData &&
            responseData.data &&
            typeof responseData.data === "string"
          ) {
            errorMessageToDisplay = `${responseData.meta.message}: ${responseData.data}`;
          }
        } else if (err.request) {
          errorMessageToDisplay =
            "Tidak bisa terhubung ke server. Periksa koneksi internet Anda.";
        } else {
          errorMessageToDisplay = err.message;
        }
      } else if (err instanceof Error) {
        errorMessageToDisplay = err.message;
      } else if (typeof err === "string") {
        errorMessageToDisplay = err;
      }

      setError(errorMessageToDisplay);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Buat Akun Baru</CardTitle>
          <CardDescription className="text-center">
            Masukkan detail di bawah untuk membuat akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input fields ... */}
            <div className="space-y-1">
              <Label htmlFor="fullname">Nama Lengkap</Label>
              <Input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                placeholder="Nama lengkap Anda"
                disabled={loading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Pilih username"
                disabled={loading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@anda.com"
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
              <p className="text-sm text-center text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-sm text-center text-green-500 dark:text-green-400">
                {successMessage}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login di sini
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
