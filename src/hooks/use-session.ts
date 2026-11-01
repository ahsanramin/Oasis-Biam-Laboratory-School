"use client";

import { useSession } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth-client";
import { useCallback, useMemo } from "react";

// =========================================
// 1. ROLE CONSTANTS
// =========================================
export const ROLES = {
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type AuthRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<AuthRole, number> = {
  [ROLES.ADMIN]: 100,
  [ROLES.MEMBER]: 10,
};

// =========================================
// 2. TYPES
// =========================================
export interface AuthUser extends SessionUser {
  role: AuthRole;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  error: Error | null;
  hasRole: (role: AuthRole | AuthRole[]) => boolean;
  hasMinimumRole: (role: AuthRole) => boolean;
  requireAuth: () => boolean;
  refetch: () => void;
}

// =========================================
// 3. MAIN HOOK
// =========================================
export function useAuth(): AuthState {
  const { data, isPending, error, refetch } = useSession();

  const user = useMemo<AuthUser | null>(() => {
    const raw = data?.user as (SessionUser & { role?: string }) | undefined;
    if (!raw) return null;
    return {
      ...raw,
      role: (raw.role as AuthRole) || ROLES.MEMBER,
    };
  }, [data?.user]);

  const hasRole = useCallback(
    (role: AuthRole | AuthRole[]): boolean => {
      if (!user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user]
  );

  const hasMinimumRole = useCallback(
    (role: AuthRole): boolean => {
      if (!user) return false;
      return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[role];
    },
    [user]
  );

  const requireAuth = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    if (!user) {
      const redirect = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.location.href = `/login?redirect=${redirect}`;
      return false;
    }
    return true;
  }, [user]);

  return useMemo<AuthState>(
    () => ({
      user,
      loading: isPending,
      isAuthenticated: !!user,
      isAdmin: user?.role === ROLES.ADMIN,
      isMember: user?.role === ROLES.MEMBER,
      error: (error as Error) || null,
      hasRole,
      hasMinimumRole,
      requireAuth,
      refetch,
    }),
    [user, isPending, error, hasRole, hasMinimumRole, requireAuth, refetch]
  );
}

// =========================================
// 4. SELECTIVE HOOKS
// =========================================
export function useUser(): SessionUser | null {
  const { data } = useSession();
  return (data?.user as SessionUser | undefined) ?? null;
}

export function useIsAuthenticated(): boolean {
  const { data } = useSession();
  return !!data?.user;
}

export function useIsAdmin(): boolean {
  const { data } = useSession();
  return (data?.user as { role?: string } | undefined)?.role === ROLES.ADMIN;
}

export function useHasRole(role: AuthRole | AuthRole[]): boolean {
  const { data } = useSession();
  const userRole = (data?.user as { role?: string } | undefined)?.role as
    | AuthRole
    | undefined;
  if (!userRole) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(userRole);
}

export function useSessionStatus():
  | "loading"
  | "authenticated"
  | "unauthenticated" {
  const { data, isPending } = useSession();
  if (isPending) return "loading";
  return data?.user ? "authenticated" : "unauthenticated";
}