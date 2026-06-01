import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Calendar,
  Video,
  ExternalLink,
  Radio,
  Sparkles,
  Wrench,
  Loader2,
  AlertTriangle,
  Trophy,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  Award,
  Medal,
  Star,
  Clock,
  Play,
  Users,
} from "lucide-react";
import { fetchAarohan, toDirectImageUrl, type AarohanRow } from "../api";

// ─── Types ───────────────────────────────────────────────────────────
type SubCategory = "cultural" | "technical" | "esports";
type Status = "upcoming" | "past-recorded" | "past-unrecorded" | "live-now";

interface AarohanItem {
  id: string;
  title: string;
  subCategory: SubCategory;
  status: Status;
  winner?: string;
  firstRunnerUp?: string;
  secondRunnerUp?: string;
  honourableMentions?: string;
  youtubeLink?: string;
  imageUrl?: string;
  meetLink?: string;
}

// ─── Map sheet rows → AarohanItem ─────────────────────────────────────
function mapRowToAarohan(row: AarohanRow, index: number): AarohanItem | null {
  const rawSub = (row["Sub-Category"] || "").trim().toLowerCase();
  let subCategory: SubCategory;
  if (rawSub === "cultural" || rawSub === "culturals" || rawSub.includes("cultural")) {
    subCategory = "cultural";
  } else if (rawSub === "technical" || rawSub === "technicals" || rawSub.includes("technical")) {
    subCategory = "technical";
  } else if (
    rawSub === "esports" || rawSub === "e-sports" || rawSub === "sports" ||
    rawSub.includes("esport") || rawSub.includes("e-sport")
  ) {
    subCategory = "esports";
  } else {
    return null; // unknown sub-category
  }

  const rawStatus = (row.Status || "").trim().toLowerCase().replace(/\s+/g, "-");
  let status: Status;
  if (rawStatus === "upcoming") {
    status = "upcoming";
  } else if (rawStatus === "live-now") {
    status = "live-now";
  } else if (rawStatus === "past-recorded") {
    status = "past-recorded";
  } else if (rawStatus === "past-unrecorded") {
    status = "past-unrecorded";
  } else {
    status = "upcoming";
  }

  const title = (row["Name of Event"] || "").trim();
  if (!title) return null;

  return {
    id: `aarohan-${index}`,
    title,
    subCategory,
    status,
    winner: (row["Winner "] || "").trim() || undefined,
    firstRunnerUp: (row["First Runner-up"] || "").trim() || undefined,
    secondRunnerUp: (row["Secong Runner-up"] || "").trim() || undefined,
    honourableMentions: (row["Honourable mentions "] || "").trim() || undefined,
    youtubeLink: (row["YouTube link"] || "").trim() || undefined,
    imageUrl: (row.Images || "").trim() ? toDirectImageUrl(row.Images) : undefined,
    meetLink: (row["Meet-Link"] || "").trim() || undefined,
  };
}

// ─── Sub-category Tabs ───────────────────────────────────────────────
const SUB_TABS: {
  label: string;
  value: SubCategory;
  icon: React.ReactNode;
  activeClasses: string;
  inactiveClasses: string;
}[] = [
  {
    label: "Culturals",
    value: "cultural",
    icon: <Sparkles size={16} />,
    activeClasses: "bg-[#9b2c5a] text-white border-[#9b2c5a] shadow-[0_4px_16px_rgba(155,44,90,0.3)]",
    inactiveClasses: "hover:bg-[#9b2c5a]/10 hover:text-[#9b2c5a] hover:border-[#9b2c5a]/30",
  },
  {
    label: "Technicals",
    value: "technical",
    icon: <Wrench size={16} />,
    activeClasses: "bg-[#1d5fa0] text-white border-[#1d5fa0] shadow-[0_4px_16px_rgba(29,95,160,0.3)]",
    inactiveClasses: "hover:bg-[#1d5fa0]/10 hover:text-[#1d5fa0] hover:border-[#1d5fa0]/30",
  },
  {
    label: "E-Sports",
    value: "esports",
    icon: <Trophy size={16} />,
    activeClasses: "bg-[#b8860b] text-white border-[#b8860b] shadow-[0_4px_16px_rgba(184,134,11,0.3)]",
    inactiveClasses: "hover:bg-[#b8860b]/10 hover:text-[#b8860b] hover:border-[#b8860b]/30",
  },
];

// ─── Status Badge ────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  if (status === "live-now")
    return (
      <span className="evt-badge evt-badge--live">
        <span className="evt-live-dot" />
        🔴 Live Now
      </span>
    );
  if (status === "upcoming")
    return <span className="evt-badge evt-badge--upcoming">Upcoming</span>;
  if (status === "past-recorded")
    return <span className="evt-badge evt-badge--recorded">Recorded</span>;
  return <span className="evt-badge evt-badge--past">Past</span>;
}

// ─── Competition Card ────────────────────────────────────────────────

function AarohanCard({ item, index }: { item: AarohanItem; index: number }) {
  const isLive = item.status === "live-now";
  const isUpcoming = item.status === "upcoming";
  const isRecorded = item.status === "past-recorded";
  const isUnrecorded = item.status === "past-unrecorded";
  const hasResults = item.winner || item.firstRunnerUp || item.secondRunnerUp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className={`evt-card ${isLive ? "evt-card--live" : ""}`}
      data-testid={`card-aarohan-${item.id}`}
    >
      {/* Event image */}
      {item.imageUrl && (
        <div className="evt-card-image">
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
        </div>
      )}

      {/* Header */}
      <div className="evt-card-header">
        <StatusBadge status={item.status} />
      </div>

      {/* Title */}
      <h3 className="evt-card-title">{item.title}</h3>

      {/* ── Competition Results ── */}
      {hasResults && (
        <div className="mt-3 space-y-2">
          {item.winner && (
            <div className="flex items-start gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
                <Trophy size={13} />
              </span>
              <span className="text-[#1e5631] font-semibold break-words">{item.winner}</span>
            </div>
          )}
          {item.firstRunnerUp && (
            <div className="flex items-start gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/30 text-slate-500 flex-shrink-0 mt-0.5">
                <Medal size={13} />
              </span>
              <span className="text-[#1e5631]/80 break-words">{item.firstRunnerUp}</span>
            </div>
          )}
          {item.secondRunnerUp && (
            <div className="flex items-start gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600/15 text-orange-700 flex-shrink-0 mt-0.5">
                <Award size={13} />
              </span>
              <span className="text-[#1e5631]/70 break-words">{item.secondRunnerUp}</span>
            </div>
          )}
        </div>
      )}

      {/* Honourable Mentions */}
      {item.honourableMentions && (
        <div className="mt-3 flex items-start gap-2 text-xs text-[#1e5631]/60">
          <Star size={12} className="mt-0.5 flex-shrink-0 text-[#1e5631]/40" />
          <span className="line-clamp-2">
            <span className="font-semibold text-[#1e5631]/70">Honourable: </span>
            {item.honourableMentions}
          </span>
        </div>
      )}

      {/* Meet Link for upcoming */}
      {(isLive || isUpcoming) && item.meetLink && (
        <div className="mt-2 text-xs text-[#1e5631] font-semibold flex items-center gap-1">
          <span className="opacity-60">Meet Link:</span>
          <a
            href={item.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-[#1e5631] truncate"
          >
            {item.meetLink}
          </a>
        </div>
      )}

      {/* Action buttons */}
      <div className="evt-card-actions">
        {(isLive || isUpcoming) && item.meetLink && (
          <a
            href={item.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`evt-btn ${isLive ? "evt-btn--live" : "evt-btn--join"}`}
          >
            {isLive ? <Radio size={15} /> : <Video size={15} />}
            {isLive ? "Join Live" : "Join Session"}
            <ExternalLink size={12} />
          </a>
        )}

        {item.youtubeLink ? (
          <a
            href={item.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="evt-btn evt-btn--youtube"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Watch on YouTube
            <ExternalLink size={12} />
          </a>
        ) : (isRecorded || isUnrecorded) ? (
          <span className="evt-card-no-recording">
            Recording not available
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}

// ─── Navbar for Aarohan Page ──────────────────────────────────────────
function AarohanNavbar() {
  return (
    <nav className="w-full bg-[#1e5631]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-sm py-3">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 font-bold uppercase text-white hover:text-[#6fcf97] transition-colors cursor-pointer group">
            <ArrowLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
            <span className="tracking-wide">Back to Home</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 text-white">
          <Sparkles size={18} />
          <span className="font-bold tracking-tight">AAROHAN</span>
        </div>
      </div>
    </nav>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function AarohanPage() {
  const [activeTab, setActiveTab] = useState<SubCategory>("cultural");
  const [items, setItems] = useState<AarohanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "past">("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [dropdownOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAarohan()
      .then((rows) => {
        if (!cancelled) {
          const mapped = rows
            .map(mapRowToAarohan)
            .filter((e): e is AarohanItem => e !== null);
          setItems(mapped);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load Aarohan data");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter by search query (global search across all tabs)
  let filtered = items;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(q) ||
      (e.winner && e.winner.toLowerCase().includes(q)) ||
      (e.firstRunnerUp && e.firstRunnerUp.toLowerCase().includes(q)) ||
      (e.secondRunnerUp && e.secondRunnerUp.toLowerCase().includes(q)) ||
      (e.honourableMentions && e.honourableMentions.toLowerCase().includes(q))
    );
  } else {
    // Filter by active tab sub-category
    filtered = filtered.filter((e) => e.subCategory === activeTab);
  }

  // Filter by status
  if (statusFilter !== "all") {
    filtered = filtered.filter(e => {
      if (statusFilter === "upcoming") return e.status === "upcoming" || e.status === "live-now";
      if (statusFilter === "past") return e.status === "past-recorded" || e.status === "past-unrecorded";
      return true;
    });
  }

  // Sort: live-now first, then upcoming, then past
  const statusOrder: Record<Status, number> = {
    "live-now": 0,
    upcoming: 1,
    "past-recorded": 2,
    "past-unrecorded": 3,
  };
  const sorted = [...filtered].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#6fcf97] selection:text-black">
      <AarohanNavbar />

      <main className="flex-grow pb-24 evt-section min-h-screen relative" style={{ paddingTop: "2rem" }}>
        {/* Background */}
        <div className="evt-bg" />
        <div className="evt-blob evt-blob--top" />
        <div className="evt-blob evt-blob--bottom" />

        <div className="container mx-auto px-4 md:px-6 pt-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="evt-header"
          >
            <h2 className="evt-section-title">Aarohan Competitions</h2>
            <p className="evt-section-subtitle">
              Results and recordings from Kaziranga House competitions — culturals, technicals & e-sports.
            </p>
          </motion.div>

          {/* Sub-category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#1a3a1a]/[0.07] border border-[#1a3a1a]/10">
              {SUB_TABS.map((tab) => (
                <button
                  key={tab.value}
                  data-testid={`button-aarohan-tab-${tab.value}`}
                  onClick={() => setActiveTab(tab.value)}
                  className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    activeTab === tab.value
                      ? tab.activeClasses
                      : `bg-transparent text-[#4a6741] border-transparent ${tab.inactiveClasses}`
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Search & Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 mb-8 max-w-3xl mx-auto items-stretch justify-center mt-4"
          >
            {/* Search Input */}
            <div className="relative w-full sm:w-2/3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e5631] z-10" size={18} />
              <input
                type="text"
                placeholder="Search by event name, winner, or participant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/70 backdrop-blur-md border border-[#1e5631]/20 rounded-full text-[#1e5631] placeholder-[#1e5631]/50 focus:outline-none focus:border-[#1e5631] focus:ring-1 focus:ring-[#1e5631] transition-all shadow-[0_4px_16px_-4px_rgba(30,86,49,0.08)] font-medium"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative w-full sm:w-1/3 custom-dropdown-container">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1e5631] pointer-events-none z-10" size={18} />
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full pl-11 pr-10 py-3 bg-white/70 backdrop-blur-md border border-[#1e5631]/20 rounded-full text-[#1e5631] flex items-center justify-between text-left font-semibold shadow-[0_4px_16px_-4px_rgba(30,86,49,0.08)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1e5631] transition-all hover:bg-white/80"
              >
                <span>
                  {statusFilter === "all" && "All Status"}
                  {statusFilter === "upcoming" && "Upcoming & Live"}
                  {statusFilter === "past" && "Past Events"}
                </span>
              </button>
              <ChevronDown
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#1e5631] pointer-events-none transition-transform duration-200 z-10 ${dropdownOpen ? 'rotate-180' : ''}`}
                size={16}
              />

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-[#1e5631]/20 rounded-[20px] shadow-[0_10px_25px_-5px_rgba(30,86,49,0.15)] overflow-hidden p-1.5 flex flex-col gap-1"
                  >
                    {[
                      { value: "all", label: "All Status" },
                      { value: "upcoming", label: "Upcoming & Live" },
                      { value: "past", label: "Past Events" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt.value as "all" | "upcoming" | "past");
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 rounded-[14px] flex items-center justify-between ${
                          statusFilter === opt.value
                            ? "bg-[#1e5631] text-white font-semibold"
                            : "text-[#1a3a1a] hover:bg-[#1e5631]/10 hover:text-[#1e5631]"
                        }`}
                      >
                        {opt.label}
                        {statusFilter === opt.value && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="section-loading">
              <Loader2 size={32} className="spin-icon text-white" />
              <span className="text-white/70">Loading Aarohan events…</span>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="section-error">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Cards grid */}
          {!loading && !error && (
            <div className="evt-grid">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="evt-grid-inner"
                >
                  {sorted.length > 0 ? (
                    sorted.map((item, i) => (
                      <AarohanCard key={item.id} item={item} index={i} />
                    ))
                  ) : (
                    <div className="evt-empty text-white/70">
                      <span className="evt-empty-emoji">🦏</span>
                      <p>No competitions in this category yet.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
