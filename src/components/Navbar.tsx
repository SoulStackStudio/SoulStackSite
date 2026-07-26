"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LogOut } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import AdminLoginModal from "./AdminLoginModal";

export default function Navbar() {
  const { isAdmin, openLogin, logout } = useAdmin();
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-sm tracking-widest uppercase transition ${
      pathname === href ? "text-brand" : "text-ink/60 hover:text-brand"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-seafoam/80 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-ink.png"
              alt="Soul Stack Studio"
              className="h-10 w-auto sm:h-12"
            />
          </Link>
          <nav className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/shop" className={linkClass("/shop")}>
              Shop
            </Link>
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-seafoam px-3 py-1 text-xs font-medium text-brand-deep">
                  Admin mode
                </span>
                <button
                  onClick={logout}
                  className="text-ink/40 transition hover:text-brand"
                  title="Exit admin mode"
                  aria-label="Exit admin mode"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="text-ink/25 transition hover:text-brand"
                title="Studio access"
                aria-label="Studio access"
              >
                <Lock size={15} />
              </button>
            )}
          </nav>
        </div>
      </header>
      <AdminLoginModal />
    </>
  );
}
