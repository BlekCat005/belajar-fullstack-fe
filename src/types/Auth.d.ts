// src/types/Auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string | null; // <-- UBAH KE STRING
      username?: string | null;
      fullname?: string | null;
      email?: string | null;
    };
  }

  interface User {
    id?: string | null; // <-- UBAH KE STRING
    username?: string | null;
    fullname?: string | null;
    email?: string | null;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id?: string | null; // <-- UBAH KE STRING
      username?: string | null;
      fullname?: string | null;
      email?: string | null;
    };
  }
}
