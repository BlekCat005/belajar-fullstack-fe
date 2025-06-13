// src/components/dashboard/DashboardContent.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react"; // Impor ikon

export default function DashboardContent() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daftar Barang Saya</CardTitle>
            <CardDescription>
              Semua barang yang sudah kamu tambahkan akan muncul di sini.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="w-4 h-4" />
            Tambah Barang
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="py-10 text-center border-2 border-dashed rounded-lg">
          <h3 className="text-2xl font-bold tracking-tight">
            Kamu belum punya barang
          </h3>
          <p className="text-muted-foreground">
            Klik tombol Tambah Barang untuk memulai.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
