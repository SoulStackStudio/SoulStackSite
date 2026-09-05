/**
 * Grey Soul Stack Studio mark, laid over every print photo automatically —
 * no per-photo editing needed. The parent must be `position: relative`.
 */
export default function Watermark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/watermark.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain p-[6%] opacity-55"
    />
  );
}
