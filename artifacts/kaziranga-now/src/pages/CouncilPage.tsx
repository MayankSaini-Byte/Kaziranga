import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Users,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  X,
  Phone,
  Mail,
  User,
  Award,
  Crown,
  Flower2,
} from "lucide-react";
import { fetchCouncil, type CouncilRow } from "../api";

// ─── Types ───────────────────────────────────────────────────────────
interface CouncilMember {
  id: string;
  name: string;
  stage: string;
  type: string;
  tagline: string;
  phone: string;
  email: string;
  imageUrl: string;
}

function mapRow(row: CouncilRow, index: number): CouncilMember | null {
  const name = row.Name?.trim();
  if (!name) return null;
  return {
    id: `council-${index}`,
    name,
    stage: row.Role?.trim() || "",
    type: row["Council Type"]?.trim() || "",
    tagline: row.Tagline?.trim() || "",
    phone: (row.Phone || (row as any)[" Phone"] || (row as any)["Phone "] || "")?.trim(),
    email: (row.Email || (row as any)[" Email"] || (row as any)["Email "] || "")?.trim(),
    imageUrl: row["Image URL"]?.trim() || "",
  };
}

// ─── Grid Preview Card (Pokemon Card Style) ──────────────────────────
function CouncilCard({
  member,
  index,
  isExecutive,
  isHovered,
  isAnyHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  member: CouncilMember;
  index: number;
  isExecutive: boolean;
  isHovered: boolean;
  isAnyHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const firstName = member.name.trim().split(" ")[0].toUpperCase();

  const role = member.stage.toLowerCase();
  let borderClass = "border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]";
  let glowColor = "rgba(255,255,255,0.02)";
  let roleColor = "text-[#6fcf97]";

  if (role.includes("house secretary") || role === "house secretary") {
    borderClass = "border-red-600 shadow-[0_0_25px_rgba(239,68,68,0.45)]";
    glowColor = "rgba(239,68,68,0.12)";
    roleColor = "text-red-400 font-bold";
  } else if (role.includes("deputy secretary") || role === "deputy secretary" || role.includes("deputy")) {
    borderClass = "border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.45)]";
    glowColor = "rgba(234,179,8,0.12)";
    roleColor = "text-yellow-400 font-bold";
  } else if (role.includes("web admin") || role === "web admin" || role.includes("admin")) {
    borderClass = "border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.45)]";
    glowColor = "rgba(59,130,246,0.12)";
    roleColor = "text-blue-400 font-bold";
  } else {
    borderClass = "border-[#1e5631]/50 shadow-[0_0_20px_rgba(30,86,49,0.2)]";
    glowColor = "rgba(30,86,49,0.06)";
    roleColor = "text-[#6fcf97]";
  }

  const isDimmed = isAnyHovered && !isHovered;

  return (
    <motion.div
      className="council-card-wrapper w-full max-w-[320px] aspect-[3/4] cursor-pointer relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Inner blur/scale layer — owns the hover dim effect via plain CSS
          so it never fights with Framer Motion's entrance animation. */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `scale(${isHovered ? 1.04 : isDimmed ? 0.96 : 1})`,
          filter: isDimmed ? "blur(4px)" : "blur(0px)",
          opacity: isDimmed ? 0.45 : 1,
          transition:
            "transform 350ms cubic-bezier(0.22,1,0.36,1), filter 350ms cubic-bezier(0.22,1,0.36,1), opacity 350ms cubic-bezier(0.22,1,0.36,1)",
          willChange: "transform, filter, opacity",
          transformOrigin: "center center",
        }}
      >
      <div
        className={`absolute inset-0 w-full h-full rounded-[24px] border-[3px] ${borderClass} overflow-hidden bg-[#060c08] flex flex-col justify-between select-none z-10`}
      >
        {/* Distorted SVG Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grid-grad-page" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#1e5631" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path d="M 10,0 Q 18,60 10,120 M 30,0 Q 38,60 30,120 M 50,0 Q 58,60 50,120 M 70,0 Q 78,60 70,120 M 90,0 Q 98,60 90,120" fill="none" stroke="url(#grid-grad-page)" strokeWidth="0.35" />
            <path d="M 0,10 Q 50,18 100,10 M 0,30 Q 50,38 100,30 M 0,50 Q 50,58 100,50 M 0,70 Q 50,78 100,70 M 0,90 Q 50,98 100,90 M 0,110 Q 50,118 100,110" fill="none" stroke="url(#grid-grad-page)" strokeWidth="0.35" />
          </svg>
        </div>

        {/* Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[65px] pointer-events-none z-0 opacity-40"
          style={{ backgroundColor: glowColor }}
        />

        {/* Corners */}
        <svg className="absolute top-3 left-3 w-10 h-10 opacity-70 pointer-events-none z-10 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
          <path d="M25,20 C40,5 65,15 75,25 C85,35 80,60 65,70 C50,80 30,75 20,60 C10,45 10,35 25,20 Z" fill="url(#chrome-grad-c)" />
        </svg>
        <svg className="absolute top-3 right-3 w-10 h-10 opacity-70 pointer-events-none z-10 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
          <path d="M70,25 C80,40 75,65 65,75 C55,85 30,80 20,65 C10,50 15,30 25,20 C35,10 60,10 70,25 Z" fill="url(#chrome-grad-d)" />
        </svg>

        <div className="relative flex-grow flex items-end justify-center z-10 h-full mt-6">
          {/* Layer 2: White cursive first name overlay */}
          <div className="absolute inset-x-0 top-12 flex items-center justify-center pointer-events-none z-10 rotate-[-5deg]">
            <span className="text-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-signature font-bold">
              {member.name.split(" ")[0]}
            </span>
          </div>

          {/* Layer 3: Image Cutout */}
          <div className="relative w-full h-full flex items-end justify-center overflow-hidden z-20 pb-3.5 px-2">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse rounded-b-2xl">
                <User className="text-white/20" size={48} />
              </div>
            )}
            {imgError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-b-2xl">
                <User className="text-white/20" size={48} />
              </div>
            ) : (
              <img
                src={member.imageUrl}
                alt={member.name}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className="w-full h-full object-contain object-bottom transition-all duration-500 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                style={{ opacity: imgLoaded ? 1 : 0 }}
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}

// ─── 3D Showcase Card (Flippable popup version) ─────────────────────
function ShowcaseCard({
  member,
}: {
  member: CouncilMember;
}) {
  const [isFlipped, setIsFlipped] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const firstName = member.name.trim().split(" ")[0].toUpperCase();

  const role = member.stage.toLowerCase();
  let borderClass = "border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]";
  let glowColor = "rgba(255,255,255,0.02)";
  let roleColor = "text-[#6fcf97]";

  if (role.includes("house secretary") || role === "house secretary") {
    borderClass = "border-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]";
    glowColor = "rgba(239,68,68,0.15)";
    roleColor = "text-red-400 font-bold";
  } else if (role.includes("deputy secretary") || role === "deputy secretary" || role.includes("deputy")) {
    borderClass = "border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]";
    glowColor = "rgba(234,179,8,0.15)";
    roleColor = "text-yellow-400 font-bold";
  } else if (role.includes("web admin") || role === "web admin" || role.includes("admin")) {
    borderClass = "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]";
    glowColor = "rgba(59,130,246,0.15)";
    roleColor = "text-blue-400 font-bold";
  } else {
    borderClass = "border-[#1e5631] shadow-[0_0_25px_rgba(30,86,49,0.25)]";
    glowColor = "rgba(30,86,49,0.08)";
    roleColor = "text-[#6fcf97]";
  }

  return (
    <div className="w-full h-full relative" style={{ perspective: "1000px" }}>
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT FACE */}
        <div
          className={`absolute inset-0 w-full h-full rounded-[24px] border-[3px] ${borderClass} overflow-hidden bg-[#060c08] flex flex-col justify-between select-none z-10`}
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden" 
          }}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
            <svg className="w-full h-full" viewBox="0 0 100 120" preserveAspectRatio="none">
              <path d="M 10,0 Q 18,60 10,120 M 30,0 Q 38,60 30,120 M 50,0 Q 58,60 50,120 M 70,0 Q 78,60 70,120 M 90,0 Q 98,60 90,120" fill="none" stroke="#10b981" strokeOpacity="0.4" strokeWidth="0.35" />
              <path d="M 0,10 Q 50,18 100,10 M 0,30 Q 50,38 100,30 M 0,50 Q 50,58 100,50 M 0,70 Q 50,78 100,70 M 0,90 Q 50,98 100,90 M 0,110 Q 50,118 100,110" fill="none" stroke="#10b981" strokeOpacity="0.4" strokeWidth="0.35" />
            </svg>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[65px] pointer-events-none z-0 opacity-40" style={{ backgroundColor: glowColor }} />

          {/* Corners */}
          <svg className="absolute top-3 left-3 w-10 h-10 opacity-70 pointer-events-none z-10 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="chrome-grad-s-a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="75%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            <path d="M25,20 C40,5 65,15 75,25 C85,35 80,60 65,70 C50,80 30,75 20,60 C10,45 10,35 25,20 Z" fill="url(#chrome-grad-s-a)" />
          </svg>
          <svg className="absolute top-3 right-3 w-10 h-10 opacity-70 pointer-events-none z-10 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="chrome-grad-s-b" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#cbd5e1" />
                <stop offset="60%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <path d="M70,25 C80,40 75,65 65,75 C55,85 30,80 20,65 C10,50 15,30 25,20 C35,10 60,10 70,25 Z" fill="url(#chrome-grad-s-b)" />
          </svg>

          <div className="relative flex-grow flex items-end justify-center z-10 h-full mt-6">
            <div className="absolute inset-x-0 top-12 flex items-center justify-center pointer-events-none z-10 rotate-[-5deg]">
              <span className="text-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-signature font-bold">
                {member.name.split(" ")[0]}
              </span>
            </div>

            <div className="relative w-full h-full flex items-end justify-center overflow-hidden z-20 pb-3.5 px-2">
              {!imgLoaded && !imgError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse rounded-b-2xl">
                  {/* Clean loading state - no icon */}
                </div>
              )}
              {imgError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-b-2xl">
                  {/* Clean error state - no icon */}
                </div>
              ) : (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain object-bottom filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                  style={{ opacity: imgLoaded ? 1 : 0 }}
                />
              )}
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className={`absolute inset-0 w-full h-full rounded-[24px] border-[3px] ${borderClass} overflow-hidden bg-[#040805]/98 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none`}
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, rgba(16,185,129,0.3) 0%, transparent 70%)" }} />

          {member.imageUrl && !imgError && (
            <img
              src={member.imageUrl}
              alt=""
              className="absolute inset-x-0 bottom-0 max-h-[85%] max-w-[85%] mx-auto object-contain object-bottom opacity-20 pointer-events-none z-0 filter saturate-50"
            />
          )}

          <div className="relative z-10 space-y-4 w-full flex flex-col items-center justify-center">
            <div className="space-y-1 w-full text-center">
              <h3 className="text-xl font-bold text-white tracking-wide font-sans truncate">{member.name}</h3>
              <div className={`text-xs font-serif uppercase tracking-wider ${roleColor} truncate`}>{member.stage}</div>
            </div>

            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent my-1" />

            {member.tagline && <p className="text-xs text-white/80 italic px-2 max-w-[240px] leading-relaxed font-light">"{member.tagline}"</p>}

            <div className="space-y-2.5 w-full max-w-[220px] flex flex-col items-center justify-center pt-2">
              {member.phone && (
                <a href={`tel:${member.phone}`} onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-white/80 hover:text-white transition-all text-xs">
                  <Phone size={12} className="text-emerald-400" />
                  <span className="truncate">{member.phone}</span>
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-white/80 hover:text-white transition-all text-xs">
                  <Mail size={12} className="text-emerald-400" />
                  <span className="truncate">{member.email}</span>
                </a>
              )}

              <div className="text-[10px] text-white/30 pt-3 flex items-center gap-1 select-none animate-pulse">
                <span>Tap to flip back</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────
function CouncilNavbar() {
  return (
    <nav className="w-full bg-[#0a1e12] border-b border-[#1e5631]/30 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-90">
      <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        <Link href="/">
          <button className="group flex items-center gap-2 text-white/80 hover:text-[#6fcf97] font-semibold text-sm transition-colors">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#1e5631]/40 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span>Back to Home</span>
          </button>
        </Link>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-[#6fcf97]" />
          <span className="font-bold text-white tracking-widest uppercase text-sm">Council</span>
        </div>
      </div>
    </nav>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────
function SkeletonCards({ count = 3, isExecutive = false }: { count?: number; isExecutive?: boolean }) {
  return (
    <div className={`council-grid ${isExecutive ? 'council-grid--executive' : 'council-grid--house'}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="council-skeleton council-skeleton--dark">
          <div className="council-skeleton-image council-skeleton-image--dark" />
          <div className="council-skeleton-body">
            <div className="council-skeleton-line council-skeleton-line--dark" style={{ width: "65%", height: 16 }} />
            <div className="council-skeleton-line council-skeleton-line--dark" style={{ width: "40%", height: 12 }} />
            <div className="council-skeleton-line council-skeleton-line--dark" style={{ width: "90%", height: 12 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
export default function CouncilPage() {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<CouncilMember | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCouncil()
      .then((rows) => {
        if (!cancelled) {
          const mapped = rows
            .map(mapRow)
            .filter((m): m is CouncilMember => m !== null);
          setMembers(mapped);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load council");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const executiveMembers = members.filter((m) => m.type.toLowerCase() === "upper");
  const houseMembers = members.filter((m) => m.type.toLowerCase() !== "upper");

  return (
    <motion.div 
      className="min-h-screen flex flex-col font-sans selection:bg-[#1e5631] selection:text-white bg-[#0a1e12]"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <CouncilNavbar />

      <main className="flex-grow">
        <section className="council-section council-section--dark min-h-[calc(100vh-64px)]">
          {/* Blobs for ambiance */}
          <div className="tak-blob tak-blob--top" />
          <div className="tak-blob tak-blob--bottom" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="council-header"
            >
              <div className="council-badge council-badge--dark">
                <Users size={16} />
                Student Council 2025-26
              </div>
              <h1 className="council-title council-title--dark">
                Meet the students shaping the future of Kaziranga House.
              </h1>
              <p className="council-subtitle council-subtitle--dark">
                From cultural events to technical innovations, our council works tirelessly to bring the Kaziranga spirit to life.
              </p>
            </motion.div>

            {loading && (
              <div className="space-y-16">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-8 text-center">Upper House</h2>
                  <SkeletonCards count={3} isExecutive={true} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-8 text-center">Lower House</h2>
                  <SkeletonCards count={4} />
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="section-error section-error--dark mt-8 mx-auto max-w-md">
                <AlertTriangle size={24} />
                <div className="text-center">
                  <h3 className="font-bold mb-1">Failed to Load</h3>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && members.length > 0 && (
              <div className="space-y-20">
                {/* Executive Council */}
                {executiveMembers.length > 0 && (
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-3xl md:text-4xl font-serif font-bold text-white mb-10 text-center flex items-center justify-center gap-3"
                    >
                      <Crown className="text-[#ffc900]" size={28} />
                      Upper House
                    </motion.h2>
                    <div 
                      className="council-grid council-grid--executive"
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {executiveMembers.map((member, i) => (
                        <CouncilCard
                          key={member.id}
                          member={member}
                          index={i}
                          isExecutive={true}
                          isHovered={hoveredId === member.id}
                          isAnyHovered={hoveredId !== null}
                          onMouseEnter={() => setHoveredId(member.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() => setSelectedMember(member)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* House Council */}
                {houseMembers.length > 0 && (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="w-full h-px bg-gradient-to-r from-transparent via-[#1e5631]/50 to-transparent mb-16"
                    />
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-2xl md:text-3xl font-serif font-bold text-white mb-10 text-center flex items-center justify-center gap-3"
                    >
                      <Flower2 className="text-[#6fcf97]" size={26} />
                      Lower House
                    </motion.h2>
                    <div 
                      className="council-grid council-grid--house"
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {houseMembers.map((member, i) => (
                        <CouncilCard
                          key={member.id}
                          member={member}
                          index={i}
                          isExecutive={false}
                          isHovered={hoveredId === member.id}
                          isAnyHovered={hoveredId !== null}
                          onMouseEnter={() => setHoveredId(member.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() => setSelectedMember(member)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && members.length === 0 && (
              <div className="evt-empty bg-white/5 border-white/10 max-w-2xl mx-auto py-16">
                <span className="evt-empty-emoji">🦏</span>
                <p className="text-white/60">Council information is being updated.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Pop-up Card Overlay with backdrop-blur */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            {/* Floating Close Button */}
            <button
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm cursor-pointer shadow-lg border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMember(null);
              }}
              aria-label="Close popup"
            >
              <X size={24} />
            </button>

            {/* Popup Card container with spring pop animation */}
            <motion.div
              className="w-full max-w-[340px] md:max-w-[360px] aspect-[3/4]"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 350, damping: 25 }
              }}
              exit={{
                scale: 0.85,
                opacity: 0,
                y: 30,
                transition: { duration: 0.2 }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ShowcaseCard member={selectedMember} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
