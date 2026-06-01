import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Calendar,
  Video,
  ExternalLink,
  Radio,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Mic2,
  Trophy,
  Award,
  Medal,
  Star
} from "lucide-react";
import { fetchEvents, fetchAarohan, toDirectImageUrl, type EventRow, type AarohanRow } from "../api";

// ─── Types ───────────────────────────────────────────────────────────
type Category = "guest-sessions" | "aarohan-culturals" | "aarohan-technicals" | "aarohan-esports" | "curiosity-hour";
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
        <p className="evt-card-desc line-clamp-3">{event.description}</p>
      )}

      {/* ── Competition Results ── */}
      {(event.winner || event.firstRunnerUp || event.secondRunnerUp) && (
        <div className="mt-3 space-y-2">
          {event.winner && (
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex-shrink-0">
                <Trophy size={13} />
              </span>
              <span className="text-[#1e5631] font-semibold truncate">{event.winner}</span>
            </div>
          )}
          {event.firstRunnerUp && (
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/30 text-slate-500 flex-shrink-0">
                <Medal size={13} />
              </span>
              <span className="text-[#1e5631]/80 truncate">{event.firstRunnerUp}</span>
            </div>
          )}
          {event.secondRunnerUp && (
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600/15 text-orange-700 flex-shrink-0">
                <Award size={13} />
              </span>
              <span className="text-[#1e5631]/70 truncate">{event.secondRunnerUp}</span>
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

// ─── Main Section ────────────────────────────────────────────────────
export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchEvents(), fetchAarohan()])
      .then(([eventRows, arohanRows]) => {
        if (!cancelled) {
          const mappedEvents = eventRows
            .map(mapRowToEvent)
            .filter((e): e is EventItem => e !== null && !!e.title && e.category !== "aarohan-culturals" && e.category !== "aarohan-technicals" && e.category !== "aarohan-esports");
          
          const mappedArohan = arohanRows
            .map(mapRowToEventFromAarohan)
            .filter((e): e is EventItem => e !== null);

          setEvents([...mappedEvents, ...mappedArohan]);
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

  // ── Smart 3-event selection with Upcoming prioritisation ──────────────────
  // Priority 1: Pick all upcoming/live events first (up to 3).
  // Priority 2: Fill remaining slots with the latest past events.
  const recentEvents = (() => {
    const toTime = (d: string) => {
      const t = new Date(d).getTime();
      return isNaN(t) ? 0 : t;
    };

    const getGroup = (e: EventItem) => {
      if (e.category === "guest-sessions") return "guest";
      if (e.category === "curiosity-hour") return "curiosity";
      return "arohan";
    };

    // Separate and sort
    const upcoming = events.filter((e) => e.status === "upcoming" || e.status === "live-now");
    const sortedUpcoming = [...upcoming].sort((a, b) => {
      const timeA = toTime(a.date);
      const timeB = toTime(b.date);
      if (timeA === 0) return 1;
      if (timeB === 0) return -1;
      return timeA - timeB;
    });

    const past = events.filter((e) => e.status === "past-recorded" || e.status === "past-unrecorded");
    const sortedPast = [...past].sort((a, b) => toTime(b.date) - toTime(a.date));

    const selected: EventItem[] = [];
    const selectedGroups = new Set<string>();

    // 1. Add all upcoming events first (up to 3)
    for (const ev of sortedUpcoming) {
      if (selected.length >= 3) break;
      selected.push(ev);
      selectedGroups.add(getGroup(ev));
    }

    // 2. If we need more, try to pick the latest past event from unrepresented groups
    if (selected.length < 3) {
      const allGroups: ("guest" | "arohan" | "curiosity")[] = ["guest", "arohan", "curiosity"];
      const unrepresented = allGroups.filter(g => !selectedGroups.has(g));

      // Sort unrepresented groups by the date of their latest past event (latest first)
      const groupLatestPast = unrepresented.map(g => {
        const groupEvents = sortedPast.filter(e => getGroup(e) === g);
        return { group: g, latestEvent: groupEvents[0] || null };
      }).filter(item => item.latestEvent !== null) as { group: string; latestEvent: EventItem }[];

      groupLatestPast.sort((a, b) => toTime(b.latestEvent.date) - toTime(a.latestEvent.date));

      for (const item of groupLatestPast) {
        if (selected.length >= 3) break;
        selected.push(item.latestEvent);
        selectedGroups.add(item.group);
      }
    }

    // 3. If we still need more, fill with the absolute latest past events that aren't already selected
    if (selected.length < 3) {
      const selectedIds = new Set(selected.map(e => e.id));
      for (const ev of sortedPast) {
        if (selected.length >= 3) break;
        if (!selectedIds.has(ev.id)) {
          selected.push(ev);
        }
      }
    }

    const groupOrder: Record<string, number> = {
      guest: 0,
      arohan: 1,
      curiosity: 2,
    };

    return [...selected].sort(
      (a, b) => groupOrder[getGroup(a)] - groupOrder[getGroup(b)]
    );
  })();

  return (
    <section id="events" className="evt-section">
      {/* Background */}
      <div className="evt-bg" />
      <div className="evt-blob evt-blob--top" />
      <div className="evt-blob evt-blob--bottom" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="evt-header"
        >
          <div className="evt-section-badge">
            <Calendar size={16} />
            House Events
          </div>
          <h2 className="evt-section-title">Events & sessions</h2>
          <p className="evt-section-subtitle">
            Catch up on the latest guest sessions, Aarohan culturals, technicals, E-Sports & curiosity hour.
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="section-loading mt-12">
            <Loader2 size={32} className="spin-icon text-white" />
            <span className="text-white/70">Loading recent events…</span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="section-error mt-12">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && (
          <div className="evt-grid mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key="recent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="evt-grid-inner"
              >
                {recentEvents.length > 0 ? (
                  recentEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))
                ) : (
                  <div className="evt-empty text-white/70 col-span-full py-12">
                    <span className="evt-empty-emoji">🦏</span>
                    <p>No recent events found.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* View All Events Button */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 flex justify-center"
          >
            <Link href="/events">
              <a className="inline-flex items-center gap-2 px-8 py-4 bg-[#1e5631] text-white hover:bg-[#174726] border border-white/20 font-bold uppercase tracking-wider rounded-full shadow-xl hover:shadow-[#1e5631]/40 transition-all hover:scale-105 active:scale-95 group">
                View All Events
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

