import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Better Auth সার্ভার আপনার Express Backend-এ রান করছে।
// লোকালহোস্টে এটি http://localhost:5000 হবে।
// Vercel-এ এটি আপনার Backend-এর Vercel URL হবে (যেমন: https://your-backend.vercel.app)।
const AUTH_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, ""); // Removes trailing slashes

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  plugins: [inferAdditionalFields()],
  fetchOptions: {
    credentials: "include", // Cross-domain cookies (Vercel) এর জন্য জরুরি
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: "admin" | "member";
  phone?: string;
  address?: string;
};

export type Session = typeof authClient.$Infer.Session;