import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

/**
 * Determine the base URL for the Better Auth server.
 * 
 * - If you are using Option A (Direct Cross-Domain): 
 *   Set NEXT_PUBLIC_BETTER_AUTH_URL to "https://olbs-server.vercel.app"
 * 
 * - If you are using Option B (Vercel Rewrites - Recommended):
 *   Set NEXT_PUBLIC_BETTER_AUTH_URL to "https://oasis-biam-laboratory-school.vercel.app"
 */
const getAuthBaseURL = () => {
  // 1. Prioritize the explicit Better Auth URL environment variable
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  
  // 2. Fallback to the general API URL if the specific one is missing
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 3. Fallback for local development if env vars are missing
  return "http://localhost:5000";
};

export const authClient = createAuthClient({
  // Remove any trailing slashes to prevent double-slash errors in API calls
  baseURL: getAuthBaseURL().replace(/\/+$/, ""),
  
  // Keep your plugins
  plugins: [inferAdditionalFields()],
  
  fetchOptions: {
    // CRITICAL: This must be "include" for cross-origin or proxy cookies to work
    credentials: "include", 
  },
});

// Export the methods for easy use in your components
export const { 
  useSession, 
  signIn, 
  signUp, 
  signOut,
  getSession, // Useful for server components
} = authClient;

// Types for your custom user fields
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