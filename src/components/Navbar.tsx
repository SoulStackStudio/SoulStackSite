"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, LogOut, Menu, ShoppingBag, X } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { useCart } from "./CartProvider";
import AdminLoginModal from "./AdminLoginModal";
import CartDrawer from "./CartDrawer";
import CartToast from "./CartToast";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { isAdmin, openLogin, logout } = useAdmin();
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // With exactly one visible exhibition, the nav link skips the listing page
  // and goes straight there; it reverts to "/exhibitions" on its own once a
  // second show is unhidden.
  const [exhibitionsHref, setExhibitionsHref] = useState("/exhibitions");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        const visible = (d.exhibitions ?? []).filter((e: { hidden?: boolean }) => !e.hidden);
        if (visible.length === 1) setExhibitionsHref(`/exhibitions/${visible[0].slug}`);
      })
      .catch(() => {});
  }, []);

  // Never leave the menu hanging open across a navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  // An exhibition page should still light up the Exhibitions link (isCurrent
  // is always called with the canonical "/exhibitions", not hrefFor's result).
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const hrefFor = (href: string) => (href === "/exhibitions" ? exhibitionsHref : href);

  const linkClass = (href: string) =>
    `text-sm tracking-widest uppercase transition ${
      isCurrent(href) ? "text-brand" : "text-ink/60 hover:text-brand"
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
            {/* Inline from sm up; on phones these live in the panel below. */}
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={hrefFor(l.href)}
                className={`hidden sm:inline ${linkClass(l.href)}`}
              >
                {l.label}
              </Link>
            ))}

            <button
              onClick={() => setOpen(true)}
              className="relative text-ink/60 transition hover:text-brand"
              title="Cart"
              aria-label={`Open cart (${count} items)`}
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span
                  key={count}
                  className="badge-pop absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-cream"
                >
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

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-ink/60 transition hover:text-brand sm:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </div>

        {/* Four links won't fit inline on a narrow phone, so they get a panel. */}
        {menuOpen && (
          <nav className="border-t border-seafoam/70 bg-cream/95 backdrop-blur-md sm:hidden">
            <div className="mx-auto flex max-w-6xl flex-col px-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={hrefFor(l.href)}
                  onClick={() => setMenuOpen(false)}
                  className={`border-b border-seafoam/40 py-3.5 last:border-0 ${linkClass(l.href)}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      <AdminLoginModal />
      <CartDrawer />
      <CartToast />
    </>
  );
}
