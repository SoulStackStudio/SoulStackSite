"use client";

import { useState } from "react";
import { X, Lock } from "lucide-react";
import { useAdmin } from "./AdminProvider";

export default function AdminLoginModal() {
  const { loginOpen, closeLogin, login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loginOpen) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await login(password);
    setBusy(false);
    if (err) setError(err);
    else setPassword("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      onClick={closeLogin}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-brand">
            <Lock size={18} />
            <h3 className="text-xl font-display font-semibold text-ink">Studio Access</h3>
          </div>
          <button onClick={closeLogin} className="text-ink/40 hover:text-ink" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-seafoam bg-mist px-4 py-2.5 outline-none focus:border-turquoise focus:ring-2 focus:ring-aqua/30"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-lg bg-brand py-2.5 font-medium text-white transition hover:bg-brand-deep disabled:opacity-50"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
