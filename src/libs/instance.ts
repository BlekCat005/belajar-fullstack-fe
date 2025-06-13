// Impor yang dibutuhkan
import environment from "@/config/environment"; // Mengambil konfigurasi lingkungan (seperti API_URL)
import { SessionExtended } from "@/types/Auth"; // Tipe kustom untuk sesi, mungkin menambahkan accessToken
import axios from "axios";
import { getSession } from "next-auth/react"; // Fungsi dari NextAuth untuk mendapatkan sesi di sisi klien

// Header default untuk semua permintaan
const headers = {
  "Content-Type": "application/json",
};

// Membuat instance Axios
const instance = axios.create({
  baseURL: environment.API_URL, // URL dasar API dari konfigurasi lingkungan
  headers, // Menggunakan header default di atas
  timeout: 60 * 1000, // Timeout permintaan dalam milidetik (60 detik)
});

// Interceptor untuk Permintaan (Request Interceptor)
instance.interceptors.request.use(
  async (request) => {
    // Mendapatkan sesi pengguna saat ini menggunakan NextAuth
    const session: SessionExtended | null = await getSession();
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
