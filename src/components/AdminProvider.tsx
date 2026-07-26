"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/types";

interface AdminContextValue {
  isAdmin: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (password: string) => Promise<string | null>; // returns error message or null
  logout: () => Promise<void>;
  /** Fetches the latest content, applies the mutation, saves it, and refreshes the page. */
  updateContent: (mutate: (content: SiteContent) => SiteContent) => Promise<string | null>;
  saving: boolean;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/admin")
      .then((r) => r.json())
      .then((d) => setIsAdmin(!!d.admin))
      .catch(() => {});
  }, []);

  const login = useCallback(async (password: string) => {
    const res = await fetch("/api/auth/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      return d?.error ?? "Login failed";
    }
    setIsAdmin(true);
    setLoginOpen(false);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/admin", { method: "DELETE" });
    setIsAdmin(false);
    router.refresh();
  }, [router]);

  const updateContent = useCallback(
    async (mutate: (content: SiteContent) => SiteContent) => {
      setSaving(true);
      try {
        const current: SiteContent = await fetch("/api/content").then((r) => r.json());
        const next = mutate(structuredClone(current));
        const res = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          return d?.error ?? "Save failed";
        }
        router.refresh();
        return null;
      } catch {
        return "Save failed — check your connection";
      } finally {
        setSaving(false);
      }
    },
    [router]
  );

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        loginOpen,
        openLogin: () => setLoginOpen(true),
        closeLogin: () => setLoginOpen(false),
        login,
        logout,
        updateContent,
        saving,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
