import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "wouter";
import { Image as ImageIcon, ArrowLeft, Loader2, AlertTriangle, RefreshCw, Heart } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaYoutube, FaLinkedin } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import { fetchGallery, fetchMeetups, type GalleryRow, type MeetupData } from "../api";
import { useLikes, useAllLikes } from "../hooks/useLikes";
import { generateImageId } from "../lib/firebase";


const CATEGORIES = ["All", "Meme", "Sticker", "Photograph", "Screenshot", "Creativity"];

// ─── Accent colours cycling on cards ─────────────────────────────────────────
const CARD_COLORS = [
  "bg-[#6fcf97]",
  "bg-[#ff90e8]",
  "bg-[#ffc900]",
  "bg-[#00e5ff]",
  "bg-white",
  "bg-[#ff5757]",
  "bg-[#9b51e0] text-white",
];

// ─── Folders Support ──────────────────────────────────────────────────
const FOLDER_COLORS = [
  "bg-[#6fcf97]", // mint green
  "bg-[#ff90e8]", // pink
  "bg-[#ffc900]", // yellow
  "bg-[#00e5ff]", // cyan
  "bg-[#ff5757]", // red
  "bg-[#9b51e0] text-white", // purple
];

function RegionFolder({ region, count, index }: { region: string; count: number; index: number }) {
  const color = FOLDER_COLORS[index % FOLDER_COLORS.length];
  const isDarkColor = color.includes("text-white");
  
  return (
    <Link href={`/gallery/meetups/${encodeURIComponent(region.toLowerCase())}`}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.35) }}
        className="relative w-full aspect-[4/3] group cursor-pointer select-none mt-4"
      >
        {/* Back Flap & Tab */}
        <div className="absolute inset-0 bg-[#e6dfcc] border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] group-hover:shadow-[14px_14px_0_0_#000] group-hover:-translate-y-2 transition-all duration-300">
          {/* Tab */}
          <div className="absolute -top-[16px] left-4 h-[18px] w-24 bg-[#e6dfcc] border-t-4 border-x-4 border-black rounded-t-lg" />
        </div>
        
        {/* Front Flap */}
        <div className={`absolute inset-x-0 bottom-0 top-[15%] ${color} border-4 border-black rounded-xl transition-all duration-300 origin-bottom group-hover:skew-x-1 group-hover:scale-y-95 group-hover:translate-y-1 p-5 flex flex-col justify-between z-10`}>
          <div className="flex justify-between items-start">
            <span className={`font-black text-2xl md:text-3xl tracking-tight uppercase line-clamp-2 ${isDarkColor ? 'text-white' : 'text-black'}`}>
              {region}
            </span>
            <span className="text-3xl leading-none">📁</span>
          </div>
          
          <div className={`flex justify-between items-end border-t-2 ${isDarkColor ? 'border-white/20' : 'border-black/20'} pt-3 mt-4`}>
            <span className={`font-bold text-xs uppercase ${isDarkColor ? 'text-white/60' : 'text-black/60'}`}>Meetups</span>
            <span className={`font-black text-lg bg-white text-black border-2 border-black px-3 py-0.5 shadow-[3px_3px_0_0_#000] group-hover:shadow-[1px_1px_0_0_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all`}>
              {count}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function BrutalistNavbar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const isMeetupsActive = activeTab === "Meetups";

  return (
    <nav className="w-full bg-[#f4f0e6] border-b-4 border-black sticky top-0 z-50">
      <div className="flex flex-col md:flex-row md:items-center h-full w-full py-2 md:py-3 gap-2 md:gap-4 px-2 md:px-4">
        
        {/* Left: Branding & Back Button */}
        <div className="flex items-center shrink-0 gap-3 px-2 md:px-0 justify-between md:justify-start w-full md:w-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="group flex items-center gap-2 h-10 px-3 md:px-4 border-4 border-black bg-[#ff5757] text-black font-black uppercase shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                <ArrowLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm md:text-base tracking-tighter">HOME</span>
              </button>
            </Link>
            
            <div className="w-1 h-8 bg-black/10 rounded-full hidden md:block" />

            <button
              onClick={() => {
                setActiveTab("Meetups");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center justify-center h-10 px-4 font-black uppercase text-xs md:text-sm border-4 border-black transition-all duration-150 ${
                isMeetupsActive
                  ? "bg-[#6fcf97] shadow-none translate-x-[4px] translate-y-[4px]"
                  : "bg-white text-black shadow-[4px_4px_0_0_#000] hover:bg-gray-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]"
              }`}
            >
              MEETUPS
            </button>
          </div>

          <div className="md:hidden font-black text-lg tracking-tighter uppercase px-2 py-1 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] rotate-2">
             ARCHIVE
          </div>
        </div>

        {/* Divider on Desktop */}
        <div className="hidden md:block w-1.5 h-8 bg-black/10 rounded-full mx-2" />

        {/* Right: Category Tabs */}
        <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 md:py-1 px-2 md:px-0">
          <div className="flex gap-3 w-max">
            {CATEGORIES.map((cat, i) => {
              const isActive = activeTab === cat;
              // Cycle through CARD_COLORS for active states (skip white at index 4 for better contrast)
              const colors = CARD_COLORS.filter(c => c !== "bg-white");
              const activeColor = colors[i % colors.length];
              
              return (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => {
                    setActiveTab(cat);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`relative flex items-center justify-center px-4 py-2 font-black uppercase text-xs md:text-sm border-4 border-black transition-all duration-150 shrink-0 ${
                    isActive
                      ? `${activeColor} shadow-none translate-x-[4px] translate-y-[4px]`
                      : "bg-white text-black shadow-[4px_4px_0_0_#000] hover:bg-gray-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]"
                  }`}
                >
                  {cat === "All" ? "EVERYTHING" : cat.toUpperCase()}
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function BrutalistFooter() {
  const socialLinks = [
    { icon: <FaInstagram size={28} />, url: "https://www.instagram.com/kaziranga_iitm/", color: "bg-[#ff90e8]" },
    { icon: <FaWhatsapp size={28} />, url: "https://forms.gle/Ac5Zxwn21cRMeEcy8", color: "bg-[#6fcf97]" },
    { icon: <FaYoutube size={28} />, url: "http://www.youtube.com/@KazirangaHouse", color: "bg-[#ff5757]" },
    { icon: <FaLinkedin size={28} />, url: "https://www.linkedin.com/company/kaziranga-iitm", color: "bg-[#00e5ff]" },
    { icon: <SiLinktree size={28} />, url: "https://linktr.ee/KazirangaHouseBS", color: "bg-[#43E55E]" },
  ];

  return (
    <footer className="w-full bg-white border-t-4 border-black py-16 text-black overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none opacity-5 select-none z-0">
        <h1 className="text-[20vw] font-black tracking-tighter text-black whitespace-nowrap">KAZIRANGA</h1>
      </div>
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <h2 className="font-black text-4xl md:text-6xl uppercase tracking-tighter mb-4">STAY WILD.</h2>
        <div className="w-24 h-2 bg-black mb-8"></div>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-16 h-16 border-4 border-black flex items-center justify-center text-black shadow-[6px_6px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#000] transition-all ${link.color}`}
            >
              {link.icon}
            </a>
          ))}
        </div>
        <div className="font-bold uppercase text-lg border-4 border-black bg-[#f4f0e6] px-6 py-2 shadow-[4px_4px_0_0_#000]">
          © {new Date().getFullYear()} KAZIRANGA HOUSE
        </div>
      </div>
    </footer>
  );
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────
function GalleryCard({ row, index, isTopPick }: { row: GalleryRow; index: number; isTopPick: boolean }) {
  const [imgError, setImgError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  
  const imageId = generateImageId(row.Student, row.Timestamp);
  const { likeCount, hasLiked, toggleLike } = useLikes(imageId);

  // Alternate tilt direction based on index for organic feel
  const tiltDir = index % 2 === 0 ? -8 : 8;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 60, rotate: tiltDir, scale: 0.88 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.5, rotate: tiltDir }}
      transition={{
        duration: 0.55,
        delay: Math.min((index % 6) * 0.07, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.025, rotate: index % 2 === 0 ? -0.8 : 0.8, y: -6,
        transition: { duration: 0.25, ease: "easeOut" } }}
      whileTap={{ scale: 0.97 }}
      className="break-inside-avoid border-4 border-black bg-white shadow-[8px_8px_0_0_#000] hover:shadow-[14px_14px_0_0_#000] transition-shadow duration-200 cursor-pointer flex flex-col relative group overflow-hidden"
    >
      {/* Window chrome */}
      <div className="w-full h-8 border-b-4 border-black bg-[#f4f0e6] flex items-center justify-between px-3 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-black bg-[#ff5757]"></div>
          <div className="w-3 h-3 rounded-full border-2 border-black bg-[#ffc900]"></div>
          <div className="w-3 h-3 rounded-full border-2 border-black bg-[#6fcf97]"></div>
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(); }}
          className="flex items-center gap-1.5 font-black text-xs bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all cursor-pointer hover:bg-gray-50"
        >
           <Heart size={12} className={hasLiked ? "fill-[#ff5757] text-[#ff5757]" : "text-black"} />
           <span>{likeCount}</span>
        </button>
      </div>

      {/* Top Pick Badge */}
      {isTopPick && (
        <div className="absolute top-10 right-2 z-20 bg-[#ffc900] border-2 border-black px-2 py-1 shadow-[2px_2px_0_0_#000] transform rotate-3 flex items-center gap-1 font-black text-[10px] uppercase">
          🔥 Top Pick
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-square bg-[#f4f0e6] overflow-hidden border-b-4 border-black md:border-b-0 group-hover:opacity-95 md:group-hover:opacity-100 transition-opacity">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-black/40">
            <ImageIcon size={40} strokeWidth={1.5} />
            <span className="text-xs font-bold uppercase">Image unavailable</span>
          </div>
        ) : (
          <img
            src={row.Image_url.trim()}
            alt={`${row.Student} — ${row.Category}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {/* Hover Overlay (Desktop Only) */}
        <div className="hidden md:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-end justify-between w-full">
            <div className="flex flex-col gap-2">
              <span className="inline-block px-2 py-0.5 border-2 border-black bg-white text-black text-[10px] font-black uppercase w-fit shadow-[2px_2px_0_0_#000]">
                {row.Category}
              </span>
              <h3 className="font-black text-xl text-white uppercase leading-tight drop-shadow-[2px_2px_0_#000]">
                {row.Student}
              </h3>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(); }}
              className={`w-12 h-12 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] ${hasLiked ? "bg-[#ff5757]" : "bg-white hover:bg-gray-100"}`}
            >
              <Heart size={20} className={hasLiked ? "fill-white text-white" : "text-black"} strokeWidth={hasLiked ? 0 : 2.5} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Details Section (Mobile Only) */}
      <div className="p-3 bg-white flex md:hidden items-center justify-between shrink-0">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="inline-block px-2 py-0.5 border-2 border-black bg-[#f4f0e6] text-black text-[10px] font-black uppercase w-fit shadow-[2px_2px_0_0_#000]">
            {row.Category}
          </span>
          <h3 className="font-black text-lg text-black uppercase leading-tight truncate pr-2">
            {row.Student}
          </h3>
        </div>
        
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(); }}
          className={`shrink-0 w-12 h-12 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] ${hasLiked ? "bg-[#ff5757]" : "bg-[#f4f0e6] hover:bg-white"}`}
        >
          <Heart size={20} className={hasLiked ? "fill-white text-white" : "text-black"} strokeWidth={hasLiked ? 0 : 2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border-4 border-black bg-white shadow-[8px_8px_0_0_#000] overflow-hidden"
        >
          <div className="w-full h-8 border-b-4 border-black bg-[#f4f0e6] flex items-center px-3 gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-black"></div>
            <div className="w-3 h-3 rounded-full border-2 border-black"></div>
            <div className="w-3 h-3 rounded-full border-2 border-black"></div>
          </div>
          <div className="w-full aspect-square bg-black/5 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Meetups"); // Default landing to Meetups!
  const [showIntro, setShowIntro] = useState(true);

  // Meetups States
  const [meetups, setMeetups] = useState<MeetupData[]>([]);
  const [meetupsLoading, setMeetupsLoading] = useState(true);
  const [meetupsError, setMeetupsError] = useState<string | null>(null);
  
  const allLikes = useAllLikes(); // Map of { imageId: likeCount }

  const load = () => {
    setLoading(true);
    setError(null);
    fetchGallery()
      .then((data) => {
        // Only keep approved images
        setRows(data.filter((r) => String(r.Approved).trim().toUpperCase() === "TRUE"));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message ?? "Unknown error");
        setLoading(false);
      });

    // Fetch Meetups
    setMeetupsLoading(true);
    setMeetupsError(null);
    fetchMeetups()
      .then((data) => {
        setMeetups(data);
        setMeetupsLoading(false);
      })
      .catch((err: Error) => {
        setMeetupsError(err.message || "Failed to load meetups data");
        setMeetupsLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, []);

  // Globally sort all rows by likes to identify top 3 for the badges
  const top3ImageIds = useMemo(() => {
    return [...rows]
      .sort((a, b) => {
        const idA = generateImageId(a.Student, a.Timestamp);
        const idB = generateImageId(b.Student, b.Timestamp);
        const likesA = allLikes[idA] || 0;
        const likesB = allLikes[idB] || 0;
        return likesB - likesA; // Descending
      })
      .slice(0, 3)
      .map(r => generateImageId(r.Student, r.Timestamp));
  }, [rows, allLikes]);

  const filteredRows = useMemo(() => {
    const filtered = activeTab === "All"
      ? rows
      : rows.filter((r) => r.Category?.trim().toLowerCase() === activeTab.toLowerCase());
      
    // Sort filtered rows by likes descending
    return [...filtered].sort((a, b) => {
      const idA = generateImageId(a.Student, a.Timestamp);
      const idB = generateImageId(b.Student, b.Timestamp);
      const likesA = allLikes[idA] || 0;
      const likesB = allLikes[idB] || 0;
      
      if (likesB !== likesA) return likesB - likesA;
      // Fallback to timestamp if likes are equal
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    });
  }, [rows, activeTab, allLikes]);

  // Group meetups by Region
  const groupedRegions = useMemo(() => {
    const groups: Record<string, number> = {};
    meetups.forEach((m) => {
      const reg = m.region;
      groups[reg] = (groups[reg] || 0) + 1;
    });

    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((reg) => ({
        name: reg,
        count: groups[reg],
      }));
  }, [meetups]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-white bg-[#f4f0e6]">
      <BrutalistNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.04,
        }}
      />

      <main className="flex-grow pt-16 pb-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">

          {/* Submissions Sections (All, Meme, Sticker, etc.) */}
          {activeTab !== "Meetups" && (
            <>
              {/* Hero banner — only on "All" tab */}
              <AnimatePresence>
                {activeTab === "All" && !loading && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 60, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", damping: 18, stiffness: 120, mass: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.015, rotate: 0.5, transition: { duration: 0.3 } }}
                className="mb-16 border-4 border-black bg-[#6fcf97] shadow-[12px_12px_0_0_#000] p-8 md:p-12 max-w-4xl mx-auto text-center cursor-default"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-black text-5xl md:text-8xl text-black uppercase tracking-tighter mb-4"
                >
                  THE GALLERY
                </motion.h1>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                  className="w-full h-1 bg-black mb-6"
                />
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.88, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-black font-bold text-lg md:text-2xl uppercase tracking-wide"
                >
                  MESSY. BEAUTIFUL. KAZIRANGA.
                </motion.p>
                {rows.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                    className="mt-4 font-bold text-black/60 uppercase text-sm tracking-widest"
                  >
                    {rows.length} SUBMISSIONS
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="border-4 border-black bg-[#ffc900] shadow-[8px_8px_0_0_#000] p-8 flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin text-black" strokeWidth={3} />
                <p className="font-black uppercase text-xl tracking-tighter text-black">LOADING GALLERY…</p>
              </div>
              <LoadingSkeleton />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="border-4 border-black bg-[#ff5757] shadow-[8px_8px_0_0_#000] p-8 md:p-12 max-w-lg w-full text-center flex flex-col items-center gap-4">
                <AlertTriangle size={52} strokeWidth={2.5} className="text-black" />
                <h2 className="font-black text-3xl uppercase tracking-tighter text-black">OOPS!</h2>
                <p className="font-bold text-black/80 text-sm">{error}</p>
                <button
                  onClick={load}
                  className="flex items-center gap-2 px-6 py-3 border-4 border-black bg-white font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <RefreshCw size={16} strokeWidth={3} />
                  TRY AGAIN
                </button>
              </div>
            </div>
          )}

          {/* Gallery grid */}
          {!loading && !error && (
            <>
              <AnimatePresence mode="popLayout">
                {filteredRows.length > 0 ? (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredRows.map((row, index) => {
                      const imageId = generateImageId(row.Student, row.Timestamp);
                      const isTopPick = top3ImageIds.includes(imageId) && (allLikes[imageId] || 0) > 0;
                      return (
                        <GalleryCard key={`${row.Student}-${row.Timestamp}-${index}`} row={row} index={index} isTopPick={isTopPick} />
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 border-4 border-black bg-white shadow-[8px_8px_0_0_#000] max-w-xl mx-auto mt-12"
                  >
                    <ImageIcon size={64} className="mx-auto mb-6 text-black" strokeWidth={1.5} />
                    <h2 className="text-3xl font-black uppercase text-black">NO ITEMS YET</h2>
                    <p className="font-bold mt-2 text-black/60">Time to post some memes.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </>
      )}

          {/* Meetups explorer View */}
          {activeTab === "Meetups" && (
            <>
              {meetupsLoading && (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                  <div className="border-4 border-black bg-[#ffc900] shadow-[8px_8px_0_0_#000] p-8 flex flex-col items-center gap-4">
                    <Loader2 size={48} className="animate-spin text-black" strokeWidth={3} />
                    <p className="font-black uppercase text-xl tracking-tighter text-black">
                      LOADING DIGITAL ARCHIVE…
                    </p>
                  </div>
                </div>
              )}

              {meetupsError && !meetupsLoading && (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                  <div className="border-4 border-black bg-[#ff5757] shadow-[8px_8px_0_0_#000] p-8 md:p-12 max-w-lg w-full text-center flex flex-col items-center gap-4">
                    <AlertTriangle size={52} strokeWidth={2.5} className="text-black" />
                    <h2 className="font-black text-3xl uppercase tracking-tighter text-black">OOPS!</h2>
                    <p className="font-bold text-black/80 text-sm">{meetupsError}</p>
                    <button
                      onClick={load}
                      className="flex items-center gap-2 px-6 py-3 border-4 border-black bg-white font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                    >
                      <RefreshCw size={16} strokeWidth={3} />
                      TRY AGAIN
                    </button>
                  </div>
                </div>
              )}

              {!meetupsLoading && !meetupsError && (
                <>
                  {/* Hero Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 18, stiffness: 120, mass: 0.8, delay: 0.1 }}
                    whileHover={{ scale: 1.01, rotate: 0.2, transition: { duration: 0.3 } }}
                    className="mb-12 border-4 border-black bg-[#6fcf97] shadow-[12px_12px_0_0_#000] p-8 md:p-12 max-w-4xl mx-auto text-center cursor-default"
                  >
                    <h1 className="font-black text-5xl md:text-8xl text-black uppercase tracking-tighter mb-4">
                      MEETUPS
                    </h1>
                    <div className="w-full h-1 bg-black mb-6" />
                    <p className="text-black font-bold text-lg md:text-2xl uppercase tracking-wide">
                      CONNECT • EXPLORE • BUILD
                    </p>
                  </motion.div>

                  {/* Stats Bar */}
                  <div className="flex justify-center gap-6 mb-16 flex-wrap">
                    <div className="border-4 border-black bg-white px-6 py-3 shadow-[6px_6px_0_0_#000] font-black uppercase text-base md:text-lg">
                      📂 {groupedRegions.length} Regions
                    </div>
                    <div className="border-4 border-black bg-[#ffc900] px-6 py-3 shadow-[6px_6px_0_0_#000] font-black uppercase text-base md:text-lg">
                      ⚡ {meetups.length} Archives
                    </div>
                  </div>

                  {/* Region folders grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto px-4 md:px-0">
                    {groupedRegions.map((folder, index) => (
                      <RegionFolder
                        key={folder.name}
                        region={folder.name}
                        count={folder.count}
                        index={index}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </main>

      <BrutalistFooter />
    </div>
  );
}
