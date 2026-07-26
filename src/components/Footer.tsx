export default function Footer() {
  return (
    <footer className="border-t border-seafoam bg-mist">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-10 text-center">
        <p className="font-display text-lg text-ink">
          Soul <span className="text-brand">Stacked</span> Studio
        </p>
        <p className="text-xs tracking-widest uppercase text-ink/40">
          Fine art photographic prints
        </p>
        <p className="mt-2 text-xs text-ink/35">
          © {new Date().getFullYear()} Soul Stacked Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
