import { motion } from "framer-motion";
import { useContent } from "@/hooks/useData";

// ── Pixelated SVG filter ─────────────────────────────────────────────────────
// Renders at small size then magnifies, giving a true blocky pixel look.
function PixelFilter() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <filter id="pixel-filter" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
          <feFlood x="4" y="4" height="2" width="2" />
          <feComposite width="10" height="10" />
          <feTile result="tiles" />
          <feComposite in="SourceGraphic" in2="tiles" operator="in" />
          <feMorphology operator="dilate" radius="5" result="pixel" />
          <feComposite in="pixel" in2="SourceGraphic" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

// ── Pixel text component ─────────────────────────────────────────────────────
// Technique: render at tiny size → scale up → browser pixelates it naturally
function PixelText({
  children,
  className = "",
  scale = 6,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="overflow-hidden flex items-center justify-center"
      style={{ lineHeight: 1 }}
    >
      {/* Outer wrapper preserves layout */}
      <div
        className={`pixel-text-wrapper ${className}`}
        style={{
          /* Render at 1/scale size then blow it up — creates hard pixel edges */
          fontSize: `calc(1em / ${scale})`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          imageRendering: "pixelated",
          WebkitFontSmoothing: "none",
          MozOsxFontSmoothing: "unset",
          letterSpacing: "0.15em",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function BlogSection() {
  const { data: content } = useContent();
  const blogsData = content?.blogs;

  return (
    <section
      id="house-stories"
      className="relative overflow-hidden"
      style={{ minHeight: "520px" }}
    >
      <PixelFilter />

      {/* ── Full-cover background image ───────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/house-stories-bg.png"
          alt="House Stories background"
          className="w-full h-full object-cover"
          style={{ imageRendering: "auto" }}
        />
        {/* Dark overlay so text pops */}
        <div className="absolute inset-0 bg-[#061209]/55" />
      </div>

      {/* ── Subtle vignette ───────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(4,12,6,0.7) 100%)",
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center py-28 md:py-40 px-4 text-center gap-10">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-12 bg-[#6fcf97]/50" />
          <span
            className="text-[#6fcf97]/70 text-xs tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            {blogsData?.sectionTitle || "House Stories"}
          </span>
          <div className="h-px w-12 bg-[#6fcf97]/50" />
        </motion.div>

        {/* ── UPCOMING — pixelated Art Nouveau letterpress ────────────────── */}
        {/* Scale(3) on a small base font → nearest-neighbour pixel edges */}
        <div
          className="w-full flex items-center justify-center"
          style={{ height: "clamp(60px, 9vw, 110px)", overflow: "hidden" }}
        >
          <div
            className="relative"
            style={{
              fontSize: "clamp(8px, 2vw, 26px)",
              transform: "scale(3)",
              transformOrigin: "center center",
              imageRendering: "pixelated",
              WebkitFontSmoothing: "none",
              MozOsxFontSmoothing: "unset",
              fontFamily: "'Cinzel Decorative', serif",
              fontWeight: 900,
              color: "transparent",
              background:
                "linear-gradient(135deg, #a8e6cf 0%, #6fcf97 40%, #c8f7dc 60%, #6fcf97 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              letterSpacing: "0.18em",
              whiteSpace: "nowrap",
            }}
          >
            UPCOMING.....
          </div>
        </div>

        {/* ── Subtitle — pixelated, scale(2) keeps it narrower ─────────────── */}
        <div
          className="w-full flex items-center justify-center"
          style={{ height: "clamp(24px, 3.5vw, 48px)", overflow: "hidden" }}
        >
          <div
            style={{
              fontSize: "clamp(6px, 0.9vw, 12px)",
              transform: "scale(2)",
              transformOrigin: "center center",
              imageRendering: "pixelated",
              WebkitFontSmoothing: "none",
              MozOsxFontSmoothing: "unset",
              fontFamily: "'Cinzel Decorative', serif",
              fontWeight: 400,
              color: "#a8e6cf",
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
              opacity: 0.85,
            }}
          >
            Perspectives, reviews, and memories
          </div>
        </div>

        {/* ── Animated dots ───────────────────────────────────────────────── */}
        <div className="flex gap-3 items-center mt-2">
          {[0, 0.25, 0.5].map((delay, i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-[#6fcf97]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: 1.4, repeat: Infinity, delay }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
