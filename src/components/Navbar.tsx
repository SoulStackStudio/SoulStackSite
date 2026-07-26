"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LogOut, ShoppingBag } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { useCart } from "./CartProvider";
import AdminLoginModal from "./AdminLoginModal";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { isAdmin, openLogin, logout } = useAdmin();
  const { count, setOpen } = useCart();
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-sm tracking-widest uppercase transition ${
      pathname === href ? "text-brand" : "text-ink/60 hover:text-brand"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-seafoam/80 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <Link href="/" className="shrink-0">
            <span className="block font-display text-xl font-semibold tracking-wide text-ink sm:text-3xl">
              Soul <span className="text-brand">Stack</span> Studio
            </span>
            <span className="mt-0.5 block text-[8px] uppercase tracking-[0.35em] text-ink/50 sm:text-[10px] sm:tracking-[0.45em]">
              Photography
            </span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/shop" className={linkClass("/shop")}>
              Shop
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="relative text-ink/60 transition hover:text-brand"
              title="Cart"
              aria-label={`Open cart (${count} items)`}
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-cream">
                  {count}
                </span>
              )}
            </button>
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="hidden rounded-full bg-seafoam px-3 py-1 text-xs font-medium text-brand-deep sm:inline-block">
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
      <CartDrawer />
    </>
  );
}
