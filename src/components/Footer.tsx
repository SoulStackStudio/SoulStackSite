export default function Footer() {
  return (
    <footer className="border-t border-seafoam bg-mist">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-10 text-center">
        <p className="font-display text-lg text-ink">
          Soul <span className="text-brand">Stack</span> Studio
        </p>
        <p className="text-xs tracking-widest uppercase text-ink/40">
          Fine art photographic prints
        </p>
        <nav className="mt-2 flex gap-5 text-xs uppercase tracking-widest">
          <a href="/" className="text-ink/50 transition hover:text-brand">Home</a>
          <a href="/shop" className="text-ink/50 transition hover:text-brand">Shop</a>
          <a href="/exhibitions" className="text-ink/50 transition hover:text-brand">Exhibitions</a>
          <a href="/contact" className="text-ink/50 transition hover:text-brand">Contact</a>
        </nav>
        <p className="mt-2 text-xs text-ink/35">
          © {new Date().getFullYear()} Soul Stack Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
