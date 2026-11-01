import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

/**
 * Better Auth Client Configuration
 * 
 * Using Vercel Rewrites: The browser thinks it is talking to the frontend,
 * but vercel.json proxies the /api requests to the backend. This eliminates 
 * all cross-domain cookie issues.
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

  // 3. Fallback for local development
  return "http://localhost:5000";
};

export const authClient = createAuthClient({
  // Remove any trailing slashes to prevent double-slash errors
  baseURL: getAuthBaseURL().replace(/\/+$/, ""),
  
  plugins: [inferAdditionalFields()],
  
  fetchOptions: {
    // CRITICAL: This must be "include" to send cookies
    credentials: "include", 
  },
});

// Export the methods for easy use in your components
export const { 
  useSession, 
  signIn, 
  signUp, 
  signOut,
  getSession, 
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