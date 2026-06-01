function RhinoBody({ cx, cy, s, color = "#1e3c1a", animClass = "" }: {
  cx: number; cy: number; s: number; color?: string; animClass?: string;
}) {
  return (
    <g fill={color} className={animClass}>
      <ellipse cx={cx} cy={cy} rx={50 * s} ry={26 * s} />
      <ellipse cx={cx - 28 * s} cy={cy - 16 * s} rx={18 * s} ry={14 * s} />
      <ellipse cx={cx - 50 * s} cy={cy - 6 * s} rx={12 * s} ry={17 * s} />
      <ellipse cx={cx - 64 * s} cy={cy - 14 * s} rx={17 * s} ry={13 * s} />
      <ellipse cx={cx - 79 * s} cy={cy - 10 * s} rx={9 * s} ry={8 * s} />
      <polygon points={`${cx - 85 * s},${cy - 30 * s} ${cx - 91 * s},${cy - 12 * s} ${cx - 78 * s},${cy - 18 * s}`} />
      <ellipse cx={cx - 56 * s} cy={cy - 26 * s} rx={4 * s} ry={7 * s} transform={`rotate(-15, ${cx - 56 * s}, ${cy - 26 * s})`} />
      <rect x={cx - 44 * s} y={cy + 22 * s} width={12 * s} height={28 * s} rx={4 * s} />
      <rect x={cx - 24 * s} y={cy + 23 * s} width={12 * s} height={26 * s} rx={4 * s} />
      <rect x={cx + 14 * s} y={cy + 23 * s} width={12 * s} height={26 * s} rx={4 * s} />
      <rect x={cx + 34 * s} y={cy + 22 * s} width={12 * s} height={28 * s} rx={4 * s} />
      <path
        d={`M ${cx + 52 * s} ${cy - 2 * s} C ${cx + 61 * s} ${cy - 14 * s} ${cx + 67 * s} ${cy - 4 * s} ${cx + 62 * s} ${cy + 8 * s}`}
        stroke={color}
        fill="none"
        strokeWidth={5 * s}
        strokeLinecap="round"
      />
    </g>
  );
}

export default function RhinoWaterScene() {
  return (
    <div className="w-full overflow-hidden select-none pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 1200 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d2010" />
            <stop offset="60%" stopColor="#1a3a1a" />
            <stop offset="100%" stopColor="#2d5a27" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f3a2a" />
            <stop offset="100%" stopColor="#071a14" />
          </linearGradient>
          <linearGradient id="mistGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8d9b0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b8d9b0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="reflectGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#071a14" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#071a14" stopOpacity="0.1" />
          </linearGradient>

          {/* Keyframe animations embedded in SVG */}
          <style>{`
            @keyframes rhinoBob1 {
              0%, 100% { transform: translateY(0px); }
              45% { transform: translateY(-5px); }
              70% { transform: translateY(-2px); }
            }
            @keyframes rhinoBob2 {
              0%, 100% { transform: translateY(0px); }
              35% { transform: translateY(-4px); }
              65% { transform: translateY(-1px); }
            }
            @keyframes rhinoBob3 {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-3px); }
            }
            @keyframes waveShimmer {
              0% { transform: translateX(0px); opacity: 0.5; }
              50% { transform: translateX(80px); opacity: 0.2; }
              100% { transform: translateX(160px); opacity: 0.5; }
            }
            @keyframes waveShimmer2 {
              0% { transform: translateX(0px); opacity: 0.35; }
              50% { transform: translateX(-60px); opacity: 0.15; }
              100% { transform: translateX(0px); opacity: 0.35; }
            }
            @keyframes waveFlow {
              0% { transform: translateX(0); }
              100% { transform: translateX(-1200px); }
            }
            @keyframes mistDrift {
              0%, 100% { transform: translateX(0); opacity: 0.45; }
              50% { transform: translateX(40px); opacity: 0.25; }
            }
            @keyframes reedSway {
              0%, 100% { transform-origin: 50% 100%; transform: rotate(-4deg); }
              50% { transform-origin: 50% 100%; transform: rotate(4deg); }
            }
            @keyframes reedSway2 {
              0%, 100% { transform-origin: 50% 100%; transform: rotate(3deg); }
              50% { transform-origin: 50% 100%; transform: rotate(-5deg); }
            }
            @keyframes birdFly {
              0% { transform: translateX(-60px) translateY(0); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateX(1260px) translateY(-40px); opacity: 0; }
            }
            @keyframes birdFly2 {
              0% { transform: translateX(-60px) translateY(0); opacity: 0; }
              10% { opacity: 0.8; }
              90% { opacity: 0.8; }
              100% { transform: translateX(1260px) translateY(20px); opacity: 0; }
            }
            .rhino-1 { animation: rhinoBob1 4.5s ease-in-out infinite; }
            .rhino-2 { animation: rhinoBob2 5.2s ease-in-out infinite 0.8s; }
            .rhino-3 { animation: rhinoBob3 3.8s ease-in-out infinite 1.5s; }
            .shimmer-1 { animation: waveShimmer 5s ease-in-out infinite; }
            .shimmer-2 { animation: waveShimmer2 6s ease-in-out infinite 1s; }
            .shimmer-3 { animation: waveShimmer 7s ease-in-out infinite 2s; }
            .wave-flow { animation: waveFlow 10s linear infinite; }
            .mist-layer { animation: mistDrift 8s ease-in-out infinite; }
            .reed-sway { animation: reedSway 3s ease-in-out infinite; }
            .reed-sway2 { animation: reedSway2 3.5s ease-in-out infinite 0.5s; }
            .bird-fly { animation: birdFly 18s linear infinite 3s; }
            .bird-fly2 { animation: birdFly2 22s linear infinite 10s; }
          `}</style>

          <clipPath id="waterClip">
            <rect x="0" y="260" width="1200" height="170" />
          </clipPath>
          <clipPath id="landClip">
            <rect x="0" y="0" width="1200" height="275" />
          </clipPath>
          <clipPath id="waveClip">
            <rect x="0" y="240" width="1200" height="190" />
          </clipPath>
        </defs>

        {/* Forest background */}
        <rect width="1200" height="430" fill="url(#forestGrad)" />

        {/* Background tree canopy — multiple layers */}
        {[
          { cx: 60,   cy: 210, rx: 100, ry: 80,  c: "#0d1f0d" },
          { cx: 170,  cy: 195, rx: 110, ry: 90,  c: "#0f240f" },
          { cx: 290,  cy: 205, rx: 105, ry: 85,  c: "#0d1f0d" },
          { cx: 410,  cy: 188, rx: 120, ry: 95,  c: "#0f240f" },
          { cx: 540,  cy: 200, rx: 115, ry: 88,  c: "#0d1f0d" },
          { cx: 660,  cy: 185, rx: 125, ry: 95,  c: "#0f240f" },
          { cx: 790,  cy: 198, rx: 110, ry: 86,  c: "#0d1f0d" },
          { cx: 910,  cy: 182, rx: 120, ry: 92,  c: "#0f240f" },
          { cx: 1040, cy: 196, rx: 115, ry: 88,  c: "#0d1f0d" },
          { cx: 1160, cy: 204, rx: 110, ry: 84,  c: "#0f240f" },
        ].map((t, i) => (
          <ellipse key={i} cx={t.cx} cy={t.cy} rx={t.rx} ry={t.ry} fill={t.c} opacity="0.85" />
        ))}

        {/* Midground treeline — lighter green */}
        {[
          { cx: 100,  cy: 238, rx: 80, ry: 60, c: "#1a3a1a" },
          { cx: 230,  cy: 228, rx: 90, ry: 68, c: "#1e421e" },
          { cx: 360,  cy: 234, rx: 85, ry: 64, c: "#1a3a1a" },
          { cx: 490,  cy: 224, rx: 95, ry: 70, c: "#1e421e" },
          { cx: 620,  cy: 232, rx: 88, ry: 66, c: "#1a3a1a" },
          { cx: 750,  cy: 226, rx: 92, ry: 68, c: "#1e421e" },
          { cx: 880,  cy: 230, rx: 86, ry: 64, c: "#1a3a1a" },
          { cx: 1010, cy: 222, rx: 95, ry: 70, c: "#1e421e" },
          { cx: 1140, cy: 234, rx: 88, ry: 66, c: "#1a3a1a" },
        ].map((t, i) => (
          <ellipse key={i} cx={t.cx} cy={t.cy} rx={t.rx} ry={t.ry} fill={t.c} opacity="0.75" />
        ))}

        {/* Ground bank */}
        <ellipse cx="600" cy="266" rx="660" ry="28" fill="#254a1e" />
        <rect x="0" y="263" width="1200" height="14" fill="#254a1e" />

        {/* Water body */}
        <rect x="0" y="265" width="1200" height="165" fill="url(#waterGrad)" />

        {/* Animated flowing wave strips */}
        <g clipPath="url(#waveClip)" className="wave-flow">
          <path
            d="M0,272 Q100,264 200,272 Q300,280 400,272 Q500,264 600,272 Q700,280 800,272 Q900,264 1000,272 Q1100,280 1200,272 Q1300,264 1400,272 Q1500,280 1600,272 Q1700,264 1800,272 Q1900,280 2000,272 Q2100,264 2200,272 Q2300,280 2400,272"
            stroke="#1a6a4a"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M0,284 Q120,275 240,284 Q360,293 480,284 Q600,275 720,284 Q840,293 960,284 Q1080,275 1200,284 Q1320,293 1440,284 Q1560,275 1680,284 Q1800,293 1920,284 Q2040,275 2160,284 Q2280,293 2400,284"
            stroke="#1a6a4a"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />
        </g>

        {/* Static water shimmer lines */}
        <g clipPath="url(#waterClip)">
          <path d="M80,295 Q200,290 340,297" stroke="#2a8a60" strokeWidth="1.5" fill="none" className="shimmer-1" />
          <path d="M420,310 Q540,305 680,312" stroke="#2a8a60" strokeWidth="1.2" fill="none" className="shimmer-2" />
          <path d="M750,300 Q870,295 990,302" stroke="#2a8a60" strokeWidth="1.5" fill="none" className="shimmer-1" />
          <path d="M150,325 Q300,320 450,326" stroke="#2a8a60" strokeWidth="1" fill="none" className="shimmer-3" />
          <path d="M600,338 Q720,332 860,339" stroke="#2a8a60" strokeWidth="1" fill="none" className="shimmer-2" />
          <path d="M920,350 Q1020,345 1130,352" stroke="#2a8a60" strokeWidth="1" fill="none" className="shimmer-1" />
          {/* Water ripple rings */}
          <ellipse cx="300" cy="370" rx="60" ry="10" fill="none" stroke="#2a8a60" strokeWidth="1" opacity="0.2" className="shimmer-2" />
          <ellipse cx="800" cy="385" rx="45" ry="8" fill="none" stroke="#2a8a60" strokeWidth="1" opacity="0.15" className="shimmer-3" />
          <ellipse cx="550" cy="355" rx="35" ry="6" fill="none" stroke="#2a8a60" strokeWidth="0.8" opacity="0.2" className="shimmer-1" />
        </g>

        {/* Reeds — left bank */}
        {[18, 38, 58, 80, 104, 128, 155].map((x, i) => (
          <g key={`rl-${i}`} className={i % 2 === 0 ? "reed-sway" : "reed-sway2"}>
            <line x1={x} y1={264} x2={x + (i % 2 === 0 ? -4 : 3)} y2={188 + (i * 6) % 35} stroke="#3a6a25" strokeWidth={3} strokeLinecap="round" />
            <ellipse
              cx={x + (i % 2 === 0 ? -4 : 3)}
              cy={183 + (i * 6) % 35}
              rx={5} ry={12}
              fill="#5a8a30"
              opacity={0.85}
              transform={`rotate(${i % 2 === 0 ? -12 : 12}, ${x}, 200)`}
            />
          </g>
        ))}

        {/* Reeds — right bank */}
        {[1040, 1065, 1090, 1115, 1138, 1162, 1182].map((x, i) => (
          <g key={`rr-${i}`} className={i % 2 === 0 ? "reed-sway2" : "reed-sway"}>
            <line x1={x} y1={264} x2={x + (i % 2 === 0 ? 4 : -3)} y2={190 + (i * 6) % 32} stroke="#3a6a25" strokeWidth={3} strokeLinecap="round" />
            <ellipse
              cx={x + (i % 2 === 0 ? 4 : -3)}
              cy={185 + (i * 6) % 32}
              rx={5} ry={12}
              fill="#5a8a30"
              opacity={0.85}
              transform={`rotate(${i % 2 === 0 ? 12 : -12}, ${x}, 200)`}
            />
          </g>
        ))}

        {/* ── Rhino 1 — large adult, center-left ── */}
        <g clipPath="url(#landClip)" className="rhino-1">
          <RhinoBody cx={380} cy={238} s={0.85} color="#1a3218" />
        </g>
        {/* Reflection 1 */}
        <g clipPath="url(#waterClip)" opacity={0.22} className="rhino-1">
          <g transform="scale(1,-1) translate(0,-534)">
            <RhinoBody cx={380} cy={238} s={0.85} color="#0a2018" />
          </g>
        </g>

        {/* ── Rhino 2 — medium, right of center ── */}
        <g clipPath="url(#landClip)" className="rhino-2">
          <RhinoBody cx={780} cy={244} s={0.68} color="#172c15" />
        </g>
        {/* Reflection 2 */}
        <g clipPath="url(#waterClip)" opacity={0.18} className="rhino-2">
          <g transform="scale(1,-1) translate(0,-534)">
            <RhinoBody cx={780} cy={244} s={0.68} color="#0a1c10" />
          </g>
        </g>

        {/* ── Rhino 3 — calf, far right ── */}
        <g clipPath="url(#landClip)" className="rhino-3">
          <RhinoBody cx={1010} cy={252} s={0.44} color="#203d1e" />
        </g>

        {/* Birds flying across (two groups) */}
        <g className="bird-fly" opacity="0.6">
          <path d="M0,120 Q4,115 8,120 Q12,125 16,120" stroke="#8ab87a" strokeWidth="1.5" fill="none" />
          <path d="M20,116 Q24,111 28,116 Q32,121 36,116" stroke="#8ab87a" strokeWidth="1.5" fill="none" />
        </g>
        <g className="bird-fly2" opacity="0.45">
          <path d="M0,100 Q3.5,96 7,100 Q10.5,104 14,100" stroke="#8ab87a" strokeWidth="1.2" fill="none" />
        </g>

        {/* Mist overlay — drifts slowly */}
        <rect x="-40" y="0" width="1280" height="220" fill="url(#mistGrad)" className="mist-layer" />

        {/* Water darkening fade at top */}
        <rect x="0" y="265" width="1200" height="165" fill="url(#reflectGrad)" />
      </svg>
    </div>
  );
}
