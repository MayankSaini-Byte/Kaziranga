import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, Loader2, AlertTriangle, RefreshCw, FolderOpen } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaYoutube, FaLinkedin } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import { fetchMeetups, type MeetupData } from "../api";

const CARD_COLORS = [
  "bg-[#6fcf97]", // mint green
  "bg-[#ff90e8]", // pink
  "bg-[#ffc900]", // yellow
  "bg-[#00e5ff]", // cyan
  "bg-[#ff5757]", // red
  "bg-[#9b51e0] text-white", // purple
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function RegionNavbar({ regionName }: { regionName: string }) {
  return (
    <nav className="w-full bg-[#f4f0e6] border-b-4 border-black sticky top-0 z-50">
      <div className="flex items-center justify-between py-3 px-4 max-w-6xl mx-auto">
        <Link href="/gallery">
          <button className="group flex items-center gap-2 h-10 px-4 border-4 border-black bg-[#ff5757] text-black font-black uppercase shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <ArrowLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-tighter">REGIONS</span>
          </button>
        </Link>
        <div className="font-black text-lg tracking-tighter uppercase px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] rotate-2 max-w-[200px] sm:max-w-xs truncate">
          {regionName}
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

// ─── Meetup Card Component ───────────────────────────────────────────────────
function MeetupCard({ meetup, index }: { meetup: MeetupData; index: number }) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const isDarkColor = color.includes("text-white");
  const isInstagramLink = !!meetup.instagramPost;
  
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.35) }}
      whileHover={isInstagramLink ? { scale: 1.025, y: -6 } : undefined}
      className={`border-4 border-black bg-white flex flex-col overflow-hidden h-full group ${
        isInstagramLink
          ? "shadow-[8px_8px_0_0_#000] hover:shadow-[14px_14px_0_0_#000] transition-all duration-200 cursor-pointer"
          : "shadow-[4px_4px_0_0_#000] cursor-default"
      }`}
    >
      {/* Window Chrome */}
      <div className="w-full h-8 border-b-4 border-black bg-[#f4f0e6] flex items-center justify-between px-3 shrink-0 select-none">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-black bg-[#ff5757]"></div>
          <div className="w-3 h-3 rounded-full border-2 border-black bg-[#ffc900]"></div>
          <div className="w-3 h-3 rounded-full border-2 border-black bg-[#6fcf97]"></div>
        </div>
        <span className="font-black text-[9px] uppercase text-black/40">
          {isInstagramLink ? "ARCHIVE_REC" : "UPCOMING_REC"}
        </span>
      </div>

      {/* Thumbnail */}
      <div className={`relative w-full aspect-[4/5] bg-[#f4f0e6] overflow-hidden border-b-4 border-black ${!isInstagramLink && "filter grayscale-[40%] contrast-[90%]"}`}>
        <img
          src={meetup.coverImage}
          alt={meetup.venue}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {!isInstagramLink && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none" />
        )}
      </div>

      {/* Details Panel */}
      <div className={`p-4 flex-grow flex flex-col justify-between ${color} ${!isInstagramLink && "opacity-90"}`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-black text-[9px] uppercase border-2 ${isDarkColor ? 'border-white text-white' : 'border-black text-black'} px-2 py-0.5 bg-white/20 shrink-0`}>
              {meetup.region}
            </span>
            <p className={`font-bold text-xs uppercase ${isDarkColor ? 'text-white/60' : 'text-black/60'}`}>
              📅 {meetup.date}
            </p>
          </div>
          <h3 className={`font-black text-xl uppercase tracking-tight mb-4 line-clamp-2 ${isDarkColor ? 'text-white' : 'text-black'}`}>
            {meetup.venue}
          </h3>
        </div>
        
        <div className="pt-3 border-t border-black/10">
          {isInstagramLink ? (
            <div className="w-full flex items-center justify-center gap-2 py-2 border-2 border-black bg-[#ff90e8] text-black font-black uppercase text-xs shadow-[3px_3px_0_0_#000] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <FaInstagram size={16} />
              <span>VIEW ON INSTAGRAM</span>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 py-2 border-2 border-black bg-[#ff90e8]/40 text-black/40 font-black uppercase text-xs shadow-[1.5px_1.5px_0_0_rgba(0,0,0,0.2)] cursor-not-allowed select-none">
              <FaInstagram size={16} />
              <span>YET TO UPLOAD</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isInstagramLink) {
    return (
      <a href={meetup.instagramPost} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

// ─── Main Region Page ─────────────────────────────────────────────────────────
export default function RegionPage(props: { params?: { region?: string } }) {
  const routeParams = useParams();
  const rawRegion = props.params?.region || routeParams.region || "";
  const regionParam = decodeURIComponent(rawRegion).toLowerCase().trim();

  const [meetups, setMeetups] = useState<MeetupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchMeetups()
      .then((data) => {
        setMeetups(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || "Failed to fetch meetups data");
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [regionParam]);

  // Filter meetups in the current region
  const filteredMeetups = useMemo(() => {
    return meetups.filter((m) => m.region.toLowerCase().trim() === regionParam);
  }, [meetups, regionParam]);

  // Find exact cased region name
  const displayRegion = useMemo(() => {
    if (filteredMeetups.length > 0) {
      return filteredMeetups[0].region;
    }
    return regionParam.toUpperCase();
  }, [filteredMeetups, regionParam]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-white bg-[#f4f0e6]">
      <RegionNavbar regionName={displayRegion} />

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

      <main className="flex-grow pt-12 pb-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back link above header */}
          <div className="max-w-6xl mx-auto mb-6">
            <Link href="/gallery">
              <a className="inline-flex items-center gap-1.5 font-bold uppercase text-sm border-2 border-black bg-white px-3 py-1.5 shadow-[3px_3px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all">
                <ArrowLeft size={16} strokeWidth={2.5} />
                BACK TO REGIONS
              </a>
            </Link>
          </div>

          {/* Hero Banner for Region */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 120 }}
              className="mb-12 border-4 border-black bg-[#ffc900] shadow-[12px_12px_0_0_#000] p-8 max-w-6xl mx-auto text-center cursor-default"
            >
              <h1 className="font-black text-4xl md:text-7xl text-black uppercase tracking-tighter mb-2">
                {displayRegion} MEETUPS
              </h1>
              <p className="text-black/75 font-bold text-sm md:text-lg uppercase tracking-widest mt-2">
                📂 {filteredMeetups.length} {filteredMeetups.length === 1 ? "Meetup" : "Meetup"} Archives
              </p>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="border-4 border-black bg-[#ffc900] shadow-[8px_8px_0_0_#000] p-8 flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin text-black" strokeWidth={3} />
                <p className="font-black uppercase text-xl tracking-tighter text-black">
                  LOADING MEETUPS…
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="border-4 border-black bg-[#ff5757] shadow-[8px_8px_0_0_#000] p-8 md:p-12 max-w-lg w-full text-center flex flex-col items-center gap-4">
                <AlertTriangle size={52} strokeWidth={2.5} className="text-black" />
                <h2 className="font-black text-3xl uppercase tracking-tighter text-black">OOPS!</h2>
                <p className="font-bold text-black/80 text-sm">{error}</p>
                <button
                  onClick={loadData}
                  className="flex items-center gap-2 px-6 py-3 border-4 border-black bg-white font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <RefreshCw size={16} strokeWidth={3} />
                  TRY AGAIN
                </button>
              </div>
            </div>
          )}

          {/* Meetup Grid */}
          {!loading && !error && (
            <>
              {filteredMeetups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {filteredMeetups.map((meetup, index) => (
                    <MeetupCard
                      key={meetup.id}
                      meetup={meetup}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-4 border-black bg-white shadow-[8px_8px_0_0_#000] max-w-xl mx-auto mt-12">
                  <FolderOpen size={64} className="mx-auto mb-6 text-black" strokeWidth={1.5} />
                  <h2 className="text-3xl font-black uppercase text-black">EMPTY ARCHIVE</h2>
                  <p className="font-bold mt-2 text-black/60">No meetups recorded for {displayRegion} yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <BrutalistFooter />
    </div>
  );
}
