import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, Loader2, AlertTriangle, RefreshCw, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaYoutube, FaLinkedin } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import { fetchMeetups, type MeetupData } from "../api";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function DetailNavbar({ regionName, venueName }: { regionName: string; venueName: string }) {
  return (
    <nav className="w-full bg-[#f4f0e6] border-b-4 border-black sticky top-0 z-50">
      <div className="flex items-center justify-between py-3 px-4 max-w-6xl mx-auto">
        <Link href={`/gallery/meetups/${encodeURIComponent(regionName.toLowerCase())}`}>
          <button className="group flex items-center gap-2 h-10 px-4 border-4 border-black bg-[#ff5757] text-black font-black uppercase shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <ArrowLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-tighter">BACK</span>
          </button>
        </Link>
        <div className="font-black text-lg tracking-tighter uppercase px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] rotate-2 max-w-[150px] sm:max-w-xs truncate">
          {venueName}
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

// ─── Main Detail Page ─────────────────────────────────────────────────────────
export default function MeetupDetailPage(props: { params?: { region?: string; meetupId?: string } }) {
  const routeParams = useParams();
  const rawRegion = props.params?.region || routeParams.region || "";
  const rawMeetupId = props.params?.meetupId || routeParams.meetupId || "";
  
  const regionParam = decodeURIComponent(rawRegion).toLowerCase().trim();
  const meetupIdParam = decodeURIComponent(rawMeetupId).trim();

  const [meetups, setMeetups] = useState<MeetupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
  }, [regionParam, meetupIdParam]);

  // Find the current meetup
  const meetup = useMemo(() => {
    return meetups.find(
      (m) => m.id === meetupIdParam && m.region.toLowerCase().trim() === regionParam
    );
  }, [meetups, meetupIdParam, regionParam]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null || !meetup) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => 
          prev !== null ? (prev - 1 + meetup.gallery.length) % meetup.gallery.length : null
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => 
          prev !== null ? (prev + 1) % meetup.gallery.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, meetup]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (meetup && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + meetup.gallery.length) % meetup.gallery.length);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (meetup && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % meetup.gallery.length);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-white bg-[#f4f0e6]">
      <DetailNavbar 
        regionName={meetup ? meetup.region : "MEETUPS"} 
        venueName={meetup ? meetup.venue : "MEETUP DETAIL"} 
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

      <main className="flex-grow pt-12 pb-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back links above */}
          {meetup && (
            <div className="max-w-6xl mx-auto mb-6 flex flex-wrap gap-3">
              <Link href="/gallery">
                <a className="inline-flex items-center gap-1.5 font-bold uppercase text-xs border-2 border-black bg-white px-3 py-1.5 shadow-[3px_3px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#000] transition-all">
                  📁 ALL REGIONS
                </a>
              </Link>
              <Link href={`/gallery/meetups/${encodeURIComponent(meetup.region.toLowerCase())}`}>
                <a className="inline-flex items-center gap-1.5 font-bold uppercase text-xs border-2 border-black bg-white px-3 py-1.5 shadow-[3px_3px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#000] transition-all">
                  📂 {meetup.region} MEETUPS
                </a>
              </Link>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="border-4 border-black bg-[#ffc900] shadow-[8px_8px_0_0_#000] p-8 flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin text-black" strokeWidth={3} />
                <p className="font-black uppercase text-xl tracking-tighter text-black">
                  LOADING MEETUP ARCHIVE…
                </p>
              </div>
            </div>
          )}

          {/* Error State / Not Found */}
          {!loading && (error || !meetup) && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="border-4 border-black bg-[#ff5757] shadow-[8px_8px_0_0_#000] p-8 md:p-12 max-w-lg w-full text-center flex flex-col items-center gap-4">
                <AlertTriangle size={52} strokeWidth={2.5} className="text-black" />
                <h2 className="font-black text-3xl uppercase tracking-tighter text-black">
                  {error ? "ERROR" : "NOT FOUND"}
                </h2>
                <p className="font-bold text-black/80 text-sm">
                  {error || "The requested meetup archive file could not be found."}
                </p>
                <Link href="/meetups">
                  <button className="flex items-center gap-2 px-6 py-3 border-4 border-black bg-white font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    BACK TO MEETUPS
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Meetup Content */}
          {!loading && meetup && (
            <div className="max-w-6xl mx-auto">
              {/* Top layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                {/* Left: Cover Image Window */}
                <div className="lg:col-span-7 border-4 border-black bg-white shadow-[10px_10px_0_0_#000] overflow-hidden flex flex-col">
                  <div className="w-full h-8 border-b-4 border-black bg-[#f4f0e6] flex items-center justify-between px-3 shrink-0 select-none">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-black bg-[#ff5757]"></div>
                      <div className="w-3 h-3 rounded-full border-2 border-black bg-[#ffc900]"></div>
                      <div className="w-3 h-3 rounded-full border-2 border-black bg-[#6fcf97]"></div>
                    </div>
                    <span className="font-black text-[9px] uppercase text-black/40">ARCHIVE_COVER_VIEWER</span>
                  </div>
                  <div className="relative flex-grow aspect-video lg:aspect-auto lg:h-[400px] overflow-hidden bg-[#f4f0e6]">
                    <img 
                      src={meetup.coverImage} 
                      alt={meetup.venue} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                {/* Right: Info Card */}
                <div className="lg:col-span-5 border-4 border-black bg-[#6fcf97] shadow-[10px_10px_0_0_#000] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full translate-x-12 -translate-y-12 pointer-events-none select-none z-0" />
                  
                  <div className="relative z-10">
                    <div className="inline-block px-3 py-1 border-2 border-black bg-white text-black font-black uppercase text-[10px] shadow-[2px_2px_0_0_#000] mb-6">
                      📂 {meetup.region}
                    </div>
                    <h1 className="font-black text-3xl md:text-4xl text-black uppercase tracking-tight leading-none mb-6">
                      {meetup.venue}
                    </h1>
                    
                    <div className="space-y-5 border-t-2 border-black/10 pt-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📅</span>
                        <div>
                          <p className="text-[10px] font-black text-black/40 uppercase tracking-wider">Meetup Date</p>
                          <p className="font-black text-base text-black uppercase">{meetup.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">👤</span>
                        <div>
                          <p className="text-[10px] font-black text-black/40 uppercase tracking-wider">Organizer Host</p>
                          <p className="font-bold text-sm text-black break-all">{meetup.hostId || "Anonymous Host"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {meetup.instagramPost ? (
                    <div className="mt-8 pt-6 border-t-2 border-black/15 relative z-10">
                      <a 
                        href={meetup.instagramPost} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full group flex items-center justify-center gap-3 py-3.5 border-4 border-black bg-[#ff90e8] text-black font-black uppercase shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        <FaInstagram size={22} className="group-hover:scale-110 transition-transform" />
                        <span>VIEW INSTAGRAM POST</span>
                      </a>
                    </div>
                  ) : (
                    <div className="mt-8 pt-6 border-t-2 border-black/15 relative z-10">
                      <div 
                        className="w-full flex items-center justify-center gap-3 py-3.5 border-4 border-black bg-[#ff90e8]/50 text-black/50 font-black uppercase shadow-[4px_4px_0_0_#000] cursor-not-allowed select-none"
                      >
                        <FaInstagram size={22} />
                        <span>YET TO UPLOAD</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Archive Section */}
              <div className="border-t-4 border-black pt-12 mt-12">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl">📷</span>
                  <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tighter text-black">
                    PHOTO ARCHIVE
                  </h2>
                </div>

                {meetup.gallery && meetup.gallery.length > 0 ? (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:balance] w-full">
                    {meetup.gallery.map((imgUrl, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.07, duration: 0.4 }}
                        whileHover={{ scale: 1.015, y: -4 }}
                        onClick={() => setLightboxIndex(idx)}
                        className="break-inside-avoid border-4 border-black bg-white shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] transition-all duration-200 cursor-pointer overflow-hidden group relative"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Archive photo ${idx + 1}`} 
                          className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white border-2 border-black font-black uppercase text-xs px-3 py-1.5 shadow-[3px_3px_0_0_#000]">
                            EXPAND 🔍
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border-4 border-dashed border-black/20 bg-white/50 max-w-xl mx-auto rounded-xl">
                    <ImageIcon size={48} className="mx-auto mb-4 text-black/30" />
                    <p className="font-bold text-black/55 uppercase text-sm">No photos found in this archive yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && meetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 select-none cursor-zoom-out"
          >
            {/* Top Bar / Chrome */}
            <div className="absolute top-4 inset-x-4 flex justify-between items-center text-white pointer-events-none z-10">
              <span className="font-black text-xs md:text-sm uppercase bg-black/50 border border-white/20 px-3 py-1.5 rounded shadow">
                📂 {meetup.venue} ({lightboxIndex + 1} / {meetup.gallery.length})
              </span>
              <button 
                onClick={() => setLightboxIndex(null)}
                className="pointer-events-auto h-10 w-10 border-2 border-white bg-black hover:bg-[#ff5757] text-white flex items-center justify-center shadow transition-colors cursor-pointer"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Left Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 border-2 border-white bg-black text-white hover:bg-[#ffc900] hover:text-black flex items-center justify-center shadow transition-all cursor-pointer z-10"
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>

            {/* Content Pane */}
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[80vh] border-4 border-black bg-white shadow-[12px_12px_0_0_#000] flex flex-col cursor-default"
            >
              {/* Window Chrome */}
              <div className="w-full h-8 border-b-4 border-black bg-[#f4f0e6] flex items-center justify-between px-3 shrink-0 select-none">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-black bg-[#ff5757]"></div>
                  <div className="w-3 h-3 rounded-full border-2 border-black bg-[#ffc900]"></div>
                  <div className="w-3 h-3 rounded-full border-2 border-black bg-[#6fcf97]"></div>
                </div>
                <span className="font-black text-[9px] uppercase text-black/40 truncate pr-6 max-w-[200px] sm:max-w-none">
                  c:\archives\photos\photo_{lightboxIndex + 1}.jpg
                </span>
              </div>

              {/* Expanded Image */}
              <div className="overflow-hidden flex items-center justify-center bg-black max-h-[75vh]">
                <img
                  src={meetup.gallery[lightboxIndex]}
                  alt={`Expanded archive photo ${lightboxIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            </motion.div>

            {/* Right Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 border-2 border-white bg-black text-white hover:bg-[#ffc900] hover:text-black flex items-center justify-center shadow transition-all cursor-pointer z-10"
            >
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BrutalistFooter />
    </div>
  );
}
