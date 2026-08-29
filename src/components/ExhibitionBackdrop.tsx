/**
 * Decorative page wash: a faint contour-wave pattern plus two soft colour
 * glows from the site palette. Sits behind everything and is inert to input —
 * the photographs still carry all the real colour on the page.
 */
export default function ExhibitionBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft aqua glow, upper right */}
      <div className="absolute -right-32 -top-40 h-[38rem] w-[38rem] rounded-full bg-aqua/12 blur-3xl" />
      {/* cooler turquoise glow, lower left */}
      <div className="absolute -bottom-48 -left-40 h-[34rem] w-[34rem] rounded-full bg-turquoise/10 blur-3xl" />

      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="ssw-waves"
            width="160"
            height="56"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-4)"
          >
            <path
              d="M0 14 Q 40 0 80 14 T 160 14"
              fill="none"
              stroke="#29667C"
              strokeWidth="1"
            />
            <path
              d="M0 34 Q 40 20 80 34 T 160 34"
              fill="none"
              stroke="#4A8FC9"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="ssw-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.10" />
            <stop offset="45%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
          <mask id="ssw-mask">
            <rect width="100%" height="100%" fill="url(#ssw-fade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#ssw-waves)"
          mask="url(#ssw-mask)"
          opacity="0.16"
        />
      </svg>
    </div>
  );
}
