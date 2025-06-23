// src/libs/instance.ts

// Impor yang dibutuhkan
import environment from "@/config/environment";
import axios from "axios";
import { getSession } from "next-auth/react";

// Header default untuk semua permintaan
const headers = {
  "Content-Type": "application/json",
};

// Membuat instance Axios
const instance = axios.create({
  baseURL: environment.API_URL, //
  headers,
  timeout: 60 * 1000,
});

// Interceptor untuk Permintaan (Request Interceptor)
instance.interceptors.request.use(
  async (request) => {
    // Mendapatkan sesi pengguna saat ini menggunakan NextAuth
    // Tipe data sudah otomatis benar berkat file Auth.d.ts yang baru
    const session = await getSession();

    // Jika sesi ada dan memiliki accessToken
    if (session && session.accessToken) {
      // Tambahkan header Authorization dengan Bearer token
      request.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return request; // Kembalikan konfigurasi permintaan yang sudah dimodifikasi (atau yang asli)
  },
  (error) => Promise.reject(error) // Jika ada error saat membuat permintaan, teruskan error tersebut
);

// Interceptor untuk Respons (Response Interceptor)
instance.interceptors.response.use(
  (response) => response, // Jika respons sukses, langsung kembalikan responsnya
  (error) => Promise.reject(error) // Jika ada error pada respons, teruskan error tersebut
);

export default instance; // Ekspor instance Axios yang sudah dikonfigurasi
