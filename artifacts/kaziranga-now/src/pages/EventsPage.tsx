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
  Zap,
  Loader2,
  AlertTriangle,
  Trophy,
  Lightbulb,
  ArrowLeft,
  Mic2,
  Search,
  Filter,
  ChevronDown,
  SlidersHorizontal,
  Award,
  Medal,
  Star
} from "lucide-react";
import { fetchEvents, fetchAarohan, toDirectImageUrl, type EventRow, type AarohanRow } from "../api";

// ─── Types ───────────────────────────────────────────────────────────
type Category = "guest-sessions" | "aarohan-culturals" | "aarohan-technicals" | "aarohan-esports" | "curiosity-hour";
type TopTab = "guest-sessions" | "aarohan" | "curiosity-hour";
type AarohanSubTab = "aarohan-culturals" | "aarohan-technicals" | "aarohan-esports";
type Status = "upcoming" | "past-recorded" | "past-unrecorded" | "live-now";

interface EventItem {
  id: string;
  title: string;
  date: string;
  category: Category;
  status: Status;
  speaker?: string;
  description?: string;
  imageUrl?: string;
  meetLink?: string;
  youtubeLink?: string;
  winner?: string;
  firstRunnerUp?: string;
  secondRunnerUp?: string;
  honourableMentions?: string;
}

// ─── Map sheet rows → EventItem ──────────────────────────────────────
function mapRowToEvent(row: EventRow, index: number): EventItem | null {
  const rawCategory = (row.Category || "").trim().toLowerCase();
  let category: Category;
  if (rawCategory === "live-session" || rawCategory === "live-sessions" || rawCategory === "live session" || rawCategory === "guest-sessions" || rawCategory === "guest session" || rawCategory === "guest-session") {
    category = "guest-sessions";
  } else if (rawCategory === "cultural" || rawCategory === "aarohan-culturals" || rawCategory === "aarohan culturals") {
    category = "aarohan-culturals";
  } else if (rawCategory === "technical" || rawCategory === "aarohan-technicals" || rawCategory === "aarohan technicals") {
    category = "aarohan-technicals";
  } else if (rawCategory === "sports" || rawCategory === "esports" || rawCategory === "e-sports" || rawCategory === "aarohan-esports" || rawCategory === "aarohan esports" || rawCategory === "aarohan e-sports") {
    category = "aarohan-esports";
  } else if (rawCategory === "curiosity-hour" || rawCategory === "curiosity hour" || rawCategory.includes("curiosity") || rawCategory.includes("curosity")) {
    category = "curiosity-hour";
  } else {
    // Unknown category — skip row
    return null;
  }

  const rawStatus = (row.status || "").trim().toLowerCase().replace(/\s+/g, "-");
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
    status = "upcoming"; // default
  }

  return {
    id: `evt-${index}`,
    title: row.Title?.trim() || "",
    date: row.Date?.trim() || "",
    category,
    status,
    speaker: row.Speaker?.trim() || undefined,
    description: row.description?.trim() || undefined,
    imageUrl: row.Image_url?.trim() ? toDirectImageUrl(row.Image_url) : undefined,
    meetLink: row.meet_link?.trim() || undefined,
    youtubeLink: row.youtube_url?.trim() || undefined,
  };
}

function mapRowToEventFromAarohan(row: AarohanRow, index: number): EventItem | null {
  const rawSub = (row["Sub-Category"] || "").trim().toLowerCase();
  let category: Category;
  if (rawSub === "cultural" || rawSub === "culturals" || rawSub.includes("cultural")) {
    category = "aarohan-culturals";
  } else if (rawSub === "technical" || rawSub === "technicals" || rawSub.includes("technical")) {
    category = "aarohan-technicals";
  } else if (
    rawSub === "esports" || rawSub === "e-sports" || rawSub === "sports" ||
    rawSub.includes("esport") || rawSub.includes("e-sport")
  ) {
    category = "aarohan-esports";
  } else {
    return null;
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
    id: `aarohan-evt-${index}`,
    title,
    date: "",
    category,
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

const TOP_TABS: { label: string; value: TopTab; icon: React.ReactNode }[] = [
  { label: "Guest Sessions", value: "guest-sessions", icon: <Zap size={16} /> },
  { label: "Aarohan", value: "aarohan", icon: <Sparkles size={16} /> },
  { label: "Curiosity Hour", value: "curiosity-hour", icon: <Lightbulb size={16} /> },
];

const AAROHAN_SUB_TABS: { label: string; value: AarohanSubTab; icon: React.ReactNode; activeClasses: string; inactiveClasses: string }[] = [
  { label: "Culturals", value: "aarohan-culturals", icon: <Sparkles size={14} />, activeClasses: "bg-[#9b2c5a] text-white border-[#9b2c5a] shadow-[0_4px_16px_rgba(155,44,90,0.3)]", inactiveClasses: "hover:bg-[#9b2c5a]/10 hover:text-[#9b2c5a] hover:border-[#9b2c5a]/30" },
  { label: "Technicals", value: "aarohan-technicals", icon: <Wrench size={14} />, activeClasses: "bg-[#1d5fa0] text-white border-[#1d5fa0] shadow-[0_4px_16px_rgba(29,95,160,0.3)]", inactiveClasses: "hover:bg-[#1d5fa0]/10 hover:text-[#1d5fa0] hover:border-[#1d5fa0]/30" },
  { label: "E-Sports", value: "aarohan-esports", icon: <Trophy size={14} />, activeClasses: "bg-[#b8860b] text-white border-[#b8860b] shadow-[0_4px_16px_rgba(184,134,11,0.3)]", inactiveClasses: "hover:bg-[#b8860b]/10 hover:text-[#b8860b] hover:border-[#b8860b]/30" },
];

// ─── Status-based Card Rendering ─────────────────────────────────────

function LiveNowBadge() {
  return (
    <span className="evt-badge evt-badge--live">
      <span className="evt-live-dot" />
      🔴 Live Now
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "live-now") return <LiveNowBadge />;
  if (status === "upcoming")
    return <span className="evt-badge evt-badge--upcoming">Upcoming</span>;
  if (status === "past-recorded")
    return <span className="evt-badge evt-badge--recorded">Recorded</span>;
  return <span className="evt-badge evt-badge--past">Past</span>;
}

function EventCard({ event, index }: { event: EventItem; index: number }) {
  const isLive = event.status === "live-now";
  const isUpcoming = event.status === "upcoming";
  const isRecorded = event.status === "past-recorded";
  const isUnrecorded = event.status === "past-unrecorded";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className={`evt-card ${isLive ? "evt-card--live" : ""}`}
      data-testid={`card-event-${event.id}`}
    >
      {/* Event image */}
      {event.imageUrl && (
        <div className="evt-card-image">
          <img src={event.imageUrl} alt={event.title} loading="lazy" />
        </div>
      )}

      {/* Header */}
      <div className="evt-card-header">
        <StatusBadge status={event.status} />
        {event.date && (
          <div className="evt-card-date">
            <Calendar size={13} />
            {event.date}
          </div>
        )}
      </div>

      {/* Title */}
      {event.title && <h3 className="evt-card-title">{event.title}</h3>}

      {/* Speaker */}
      {event.speaker && (
        <div className="evt-card-speaker">
          <Mic2 size={13} />
          {event.speaker}
        </div>
      )}

      {/* Description */}
      {event.description && (
        <p className="evt-card-desc">{event.description}</p>
      )}

      {/* ── Competition Results ── */}
      {(event.winner || event.firstRunnerUp || event.secondRunnerUp) && (
        <div className="mt-3 space-y-2">
          {event.winner && (
            <div className="flex items-start gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
                <Trophy size={13} />
              </span>
              <span className="text-[#1e5631] font-semibold break-words">{event.winner}</span>
            </div>
          )}
          {event.firstRunnerUp && (
            <div className="flex items-start gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/30 text-slate-500 flex-shrink-0 mt-0.5">
                <Medal size={13} />
              </span>
              <span className="text-[#1e5631]/80 break-words">{event.firstRunnerUp}</span>
            </div>
          )}
          {event.secondRunnerUp && (
            <div className="flex items-start gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600/15 text-orange-700 flex-shrink-0 mt-0.5">
                <Award size={13} />
              </span>
              <span className="text-[#1e5631]/70 break-words">{event.secondRunnerUp}</span>
            </div>
          )}
        </div>
      )}

      {/* Honourable Mentions */}
      {event.honourableMentions && (
        <div className="mt-3 flex items-start gap-2 text-xs text-[#1e5631]/60">
          <Star size={12} className="mt-0.5 flex-shrink-0 text-[#1e5631]/40" />
          <span className="line-clamp-2">
            <span className="font-semibold text-[#1e5631]/70">Honourable: </span>
            {event.honourableMentions}
          </span>
        </div>
      )}

      {/* Meet Link for upcoming */}
      {(isLive || isUpcoming) && event.meetLink && (
        <div className="mt-2 text-xs text-[#1e5631] font-semibold flex items-center gap-1">
          <span className="opacity-60">Meet Link:</span>
          <a
            href={event.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-[#1e5631] truncate"
          >
            {event.meetLink}
          </a>
        </div>
      )}

      {/* Action button */}
      <div className="evt-card-actions">
        {(isLive || isUpcoming) && event.meetLink && (
          <a
            href={event.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`evt-btn ${isLive ? "evt-btn--live" : "evt-btn--join"}`}
          >
            {isLive ? <Radio size={15} /> : <Video size={15} />}
            {isLive ? "Join Live" : "Join Session"}
            <ExternalLink size={12} />
          </a>
        )}

        {event.youtubeLink ? (
          <a
            href={event.youtubeLink}
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

// ─── Navbar for Events Page ───────────────────────────────────────────
function EventsNavbar() {
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
          <Calendar size={18} />
          <span className="font-bold tracking-tight">EVENTS</span>
        </div>
      </div>
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function EventsPage() {
  const [activeTopTab, setActiveTopTab] = useState<TopTab>("guest-sessions");
  const [aarohanSubTab, setAarohanSubTab] = useState<AarohanSubTab>("aarohan-culturals");
  const [events, setEvents] = useState<EventItem[]>([]);
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

    Promise.all([fetchEvents(), fetchAarohan()])
      .then(([eventRows, aarohanRows]) => {
        if (!cancelled) {
          const mappedEvents = eventRows
            .map(mapRowToEvent)
            .filter((e): e is EventItem => e !== null && !!e.title && e.category !== "aarohan-culturals" && e.category !== "aarohan-technicals" && e.category !== "aarohan-esports");
          
          const mappedAarohan = aarohanRows
            .map(mapRowToEventFromAarohan)
            .filter((e): e is EventItem => e !== null);

          setEvents([...mappedEvents, ...mappedAarohan]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load events");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Determine which category to filter by
  const activeCategory: Category = activeTopTab === "aarohan" ? aarohanSubTab : activeTopTab as Category;
  let filtered = events;

  // Filter by search query (global search across all tabs)
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(q) || 
      (e.speaker && e.speaker.toLowerCase().includes(q)) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.winner && e.winner.toLowerCase().includes(q)) ||
      (e.firstRunnerUp && e.firstRunnerUp.toLowerCase().includes(q)) ||
      (e.secondRunnerUp && e.secondRunnerUp.toLowerCase().includes(q)) ||
      (e.honourableMentions && e.honourableMentions.toLowerCase().includes(q))
    );
  } else {
    // If no search query, filter by the active tab category
    filtered = filtered.filter((e) => e.category === activeCategory);
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
      <EventsNavbar />

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
            <h2 className="evt-section-title">Events Archive</h2>
          </motion.div>

          {/* Top-level Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="evt-tabs-wrapper"
          >
            {TOP_TABS.map((tab) => (
              <button
                key={tab.value}
                data-testid={`button-tab-${tab.value}`}
                onClick={() => setActiveTopTab(tab.value)}
                className={`evt-tab ${activeTopTab === tab.value ? "evt-tab--active" : ""}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Aarohan Sub-tabs */}
          <AnimatePresence>
            {activeTopTab === "aarohan" && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mb-8 mt-1"
              >
                <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#1a3a1a]/[0.07] border border-[#1a3a1a]/10">
                  {AAROHAN_SUB_TABS.map((sub) => (
                    <button
                      key={sub.value}
                      data-testid={`button-subtab-${sub.value}`}
                      onClick={() => setAarohanSubTab(sub.value)}
                      className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${aarohanSubTab === sub.value
                        ? sub.activeClasses
                        : `bg-transparent text-[#4a6741] border-transparent ${sub.inactiveClasses}`
                        }`}
                    >
                      {sub.icon}
                      {sub.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                placeholder="Search events by title, speaker, or description..."
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
                          setStatusFilter(opt.value as any);
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
              <span className="text-white/70">Loading events…</span>
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
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="evt-grid-inner"
                >
                  {sorted.length > 0 ? (
                    sorted.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))
                  ) : (
                    <div className="evt-empty text-white/70">
                      <span className="evt-empty-emoji">🦏</span>
                      <p>No events in this category right now.</p>
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
