"use client";

import { useRef, useState } from "react";
import { Upload, Link2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

/** URL input + file-upload button. Uploads go to /api/upload (admin only). */
export default function ImagePicker({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? "Upload failed");
      onChange(d.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
            className="w-full rounded-lg border border-seafoam bg-mist py-2 pl-9 pr-3 text-sm outline-none focus:border-turquoise"
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-white px-3 py-2 text-sm font-medium text-brand transition hover:bg-seafoam disabled:opacity-50"
        >
          <Upload size={14} />
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" className="h-24 w-full rounded-lg object-cover" />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
