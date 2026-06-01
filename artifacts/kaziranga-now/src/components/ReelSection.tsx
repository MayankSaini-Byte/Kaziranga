import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SiInstagram } from "react-icons/si";
import { Play, Loader2, AlertTriangle, Calendar, User, Mic } from "lucide-react";
import { fetchEpisodes, toDirectImageUrl, type EpisodeRow } from "../api";

// ─── Mapped episode type ─────────────────────────────────────────────
interface Episode {
  id: string;
  number: string;
  title: string;
  date: string;
  author: string;
  imageUrl: string;
  instagramUrl: string;
}

function mapRowToEpisode(row: EpisodeRow, index: number): Episode {
  return {
    id: `ep-${index + 1}`,
    number: (row["Episode No."] || "").replace(/\D/g, "") || String(index + 1),
    title: row.Title || `Episode ${index + 1}`,
    date: row.Date || "",
    author: row.Host || "",
    imageUrl: toDirectImageUrl(row.Image_url || ""),
    instagramUrl: row.Instagram_url?.trim() || "#",
  };
}

// ─── Featured Episode (Media Player Style) ───────────────────────────
function FeaturedEpisodeCard({ episode }: { episode: Episode }) {
  return (
    <motion.a
      href={episode.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative block w-full rounded-3xl group mb-12 shadow-2xl bg-[#0d0d0d] border border-white/5 max-w-4xl mx-auto"
    >
      {/* Background blurred image */}
      <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
        {episode.imageUrl && (
          <img src={episode.imageUrl} className="w-full h-full object-cover blur-3xl opacity-30 transform scale-125 saturate-200" alt="" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 pt-8 md:pt-10">
        {/* Cover Art — no overflow-hidden on parent, clip only the image wrapper */}
        <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl flex-shrink-0 relative group-hover:-translate-y-2 transition-transform duration-500 ease-out border border-white/10 bg-black shadow-2xl"
          style={{ overflow: "hidden" }}
        >
           {episode.imageUrl ? (
             <img src={episode.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={episode.title} />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-white/5">
                <Mic size={32} className="text-white/20" />
             </div>
           )}
           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 scale-90 group-hover:scale-100 transition-transform">
               <Play size={24} fill="white" className="text-white ml-1.5" />
             </div>
           </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 flex-grow text-center md:text-left w-full">
           <div className="inline-flex items-center gap-2 justify-center md:justify-start">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6fcf97] opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6fcf97]"></span>
             </span>
             <span className="text-[#6fcf97] font-semibold tracking-widest text-[10px] md:text-xs uppercase">Latest Episode</span>
           </div>
           
           <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg line-clamp-2 my-1">
             {episode.title}
           </h3>
           
           <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-2 text-white/60 text-sm font-medium">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"><User size={14}/> {episode.author || "House Reps"}</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"><Calendar size={14}/> {episode.date || "Recent"}</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40">Ep {episode.number}</span>
           </div>

           {/* Action */}
           <div className="mt-6 flex justify-center md:justify-start">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-bold hover:scale-105 hover:bg-[#6fcf97] transition-all duration-300 shadow-lg">
                 <SiInstagram size={20} />
                 <span>Listen on Instagram</span>
              </div>
           </div>
        </div>
      </div>
    </motion.a>
  );
}


// ─── Track List Item (Playlist Style) ────────────────────────────────
function TrackListItem({ episode, index }: { episode: Episode; index: number }) {
  return (
    <motion.a
      href={episode.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 group cursor-pointer"
    >
       {/* Number / Play Icon */}
       <div className="w-6 md:w-8 flex-shrink-0 text-center relative flex items-center justify-center">
          <span className="text-white/40 font-mono text-xs md:text-sm group-hover:opacity-0 transition-opacity">{index + 1}</span>
          <Play size={16} fill="white" className="text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>

       {/* Thumbnail */}
       <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden bg-white/10 flex-shrink-0 border border-white/5">
          {episode.imageUrl ? (
            <img src={episode.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Mic size={20} className="text-white/20"/></div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>

       {/* Title & Info */}
       <div className="flex-grow min-w-0 flex flex-col justify-center gap-1 pl-2">
         <h4 className="text-white/90 font-medium text-sm md:text-base truncate group-hover:text-[#6fcf97] transition-colors">{episode.title}</h4>
         <div className="text-white/40 text-xs flex gap-2 truncate">
            <span>Ep {episode.number}</span>
            <span>•</span>
            <span className="truncate">{episode.author || "Kaziranga House"}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{episode.date}</span>
         </div>
       </div>

       {/* Right action */}
       <div className="text-white/20 group-hover:text-white pr-2 md:pr-4 transition-colors hidden sm:block">
         <SiInstagram size={20} />
       </div>
    </motion.a>
  );
}

// ─── Main Section ────────────────────────────────────────────────────
export default function ReelSection() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchEpisodes()
      .then((rows) => {
        if (!cancelled) {
          const mapped = rows.map(mapRowToEpisode);
          // Sort by episode number descending so the biggest number is first
          const sorted = mapped.sort((a, b) => {
            const numA = parseInt(a.number, 10) || 0;
            const numB = parseInt(b.number, 10) || 0;
            return numB - numA;
          });
          setEpisodes(sorted);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load episodes");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="tak" className="relative overflow-hidden bg-[#050505] pt-24 pb-16 md:pt-32 md:pb-24 font-sans">
      {/* Redesigned Premium Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[#1e5631]/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-[#1e5631]/10 blur-[100px] mix-blend-screen" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 relative"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 border border-white/10 mb-6 text-[#6fcf97] shadow-[0_0_30px_rgba(46,139,87,0.2)]">
            <Mic size={28} />
          </div>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
            Kaziranga Tak
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Two members, a recorder, and endless group chat chaos. Catch every
            episode of our official house podcast.
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="animate-spin text-[#6fcf97]" />
            <span className="text-white/60 font-medium tracking-widest uppercase text-sm">Loading Episodes</span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-red-950/20 border border-red-900/30 rounded-3xl max-w-2xl mx-auto">
            <AlertTriangle size={32} className="text-red-500" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* Redesigned Playlist Layout */}
        {!loading && !error && episodes.length > 0 && (
          <div className="max-w-5xl mx-auto">
            {/* Massive Featured Episode Card */}
            <FeaturedEpisodeCard episode={episodes[0]} />
            
            {/* List of Past Episodes (Spotify Style) */}
            {episodes.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-black/40 backdrop-blur-md rounded-[2rem] border border-white/5 p-4 md:p-8"
              >
                <div className="flex items-center gap-4 mb-6 px-4">
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">All Episodes</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-xs font-bold">{episodes.length - 1}</span>
                  <div className="h-[1px] bg-gradient-to-r from-white/10 to-transparent flex-grow"></div>
                </div>
                
                <div className="flex flex-col gap-1">
                  {episodes.slice(1).map((ep, i) => (
                    <TrackListItem key={ep.id} episode={ep} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
