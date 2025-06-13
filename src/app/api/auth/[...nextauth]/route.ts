// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { AuthOptions } from "next-auth"; // Impor tipe AuthOptions

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          // --- LANGKAH 1: Login untuk mendapatkan TOKEN ---
          const loginResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              identifier: credentials.identifier,
              password: credentials.password,
            }
          );

          // Berdasarkan info darimu, respons login ada di `loginResponse.data.data`
          const accessToken = loginResponse.data.data;

          if (!accessToken || typeof accessToken !== "string") {
            console.error("Token tidak diterima dari backend saat login.");
            return null; // Jika tidak ada token, login gagal
          }

          // --- LANGKAH 2: Gunakan TOKEN untuk mengambil DETAIL PENGGUNA ---
          const profileResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              headers: {
                // Kirim token yang baru didapat di header Authorization
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          // Respons dari /me ada di `profileResponse.data.data`
          const user = profileResponse.data.data;

          if (user) {
            // Gabungkan data user dari /me dan token dari /login
            // untuk diberikan ke callback `jwt`
            return {
              id: user._id, // Ambil id dari data user
              fullname: user.fullname,
              username: user.username,
              email: user.email,
              accessToken: accessToken, // Gunakan token yang didapat dari login
            };
          }

          return null;
        } catch (error: any) {
          // Tangkap error dari kedua panggilan API
          const errorMessage =
            error.response?.data?.meta?.message ||
            "Identifier atau password salah.";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    // Callback jwt dan session tidak perlu diubah, sudah benar
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
