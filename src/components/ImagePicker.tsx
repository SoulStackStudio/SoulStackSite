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

  // Netlify functions reject bodies over ~6 MB, so big photos must be
  // shrunk in the browser before they ever leave the device.
  const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

  async function compressIfNeeded(file: File): Promise<{ blob: Blob; name: string }> {
    const resizable = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    if (!resizable || file.size <= 2 * 1024 * 1024) return { blob: file, name: file.name };

    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) return { blob: file, name: file.name };
    return { blob, name: file.name.replace(/\.[^.]+$/, "") + ".jpg" };
  }

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { blob, name } = await compressIfNeeded(file);
      if (blob.size > MAX_UPLOAD_BYTES) {
        throw new Error("Image is too large even after compression — please export it under 4 MB");
      }
      const form = new FormData();
      form.append("file", blob, name);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      let d: { url?: string; error?: string } | null = null;
      try {
        d = await res.json();
      } catch {
        // Netlify returns plain text (not JSON) for oversized/failed requests
      }
      if (!res.ok || !d?.url) {
        throw new Error(d?.error ?? "Upload failed — try a smaller image");
      }
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
          className="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-cream px-3 py-2 text-sm font-medium text-brand transition hover:bg-seafoam disabled:opacity-50"
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
