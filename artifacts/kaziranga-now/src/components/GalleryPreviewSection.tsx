import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useAnimate } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Image as ImageIcon, Camera } from "lucide-react";
import { fetchGallery } from "../api";
import { useAllLikes } from "../hooks/useLikes";
import { generateImageId } from "../lib/firebase";

// Fallback images if Firebase/Google Sheets fails or takes too long to load
const FALLBACK_TRAIL_IMAGES = [
  "https://images.unsplash.com/photo-1542868727-4666d6a2f60d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531256456869-ce942c665e5e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596526131083-e8c638c9c6c3?q=80&w=400&auto=format&fit=crop",
];

const MouseImageTrail = ({
  children,
  images,
  renderImageBuffer,
  rotationRange,
}: {
  children: React.ReactNode;
  images: string[];
  renderImageBuffer: number;
  rotationRange: number;
}) => {
  const [scope, animate] = useAnimate();

  const lastRenderPosition = useRef({ x: 0, y: 0 });
  const imageRenderCount = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const distance = calculateDistance(
      x,
      y,
      lastRenderPosition.current.x,
      lastRenderPosition.current.y
    );

    if (distance >= renderImageBuffer) {
      lastRenderPosition.current.x = x;
      lastRenderPosition.current.y = y;

      renderNextImage();
    }
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  const renderNextImage = () => {
    const imageIndex = imageRenderCount.current % images.length;
    const selector = `[data-mouse-move-index="${imageIndex}"]`;

    const el = document.querySelector(selector) as HTMLElement;
    if (!el) return;

    el.style.top = `${lastRenderPosition.current.y}px`;
    el.style.left = `${lastRenderPosition.current.x}px`;
    el.style.zIndex = imageRenderCount.current.toString();

    const rotation = Math.random() * rotationRange;

    animate(
      selector,
      {
        opacity: [0, 1],
        transform: [
          `translate(-50%, -25%) scale(0.5) ${
            imageIndex % 2 ? `rotate(${rotation}deg)` : `rotate(-${rotation}deg)`
          }`,
          `translate(-50%, -50%) scale(1) ${
            imageIndex % 2 ? `rotate(-${rotation}deg)` : `rotate(${rotation}deg)`
          }`,
        ],
      },
      { type: "spring", damping: 15, stiffness: 200 }
    );

    animate(
      selector,
      {
        opacity: [1, 0],
      },
      { ease: "linear", duration: 0.5, delay: 2 }
    );

    imageRenderCount.current = imageRenderCount.current + 1;
  };

  return (
    <div
      ref={scope}
      className="relative overflow-hidden w-full bg-[#f4f0e6]"
      onMouseMove={handleMouseMove}
    >
      {/* Neo-brutalist dotted background pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.05 }} />

      <div className="relative z-[10]">
        {children}
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none">
        {images.map((img, index) => (
          <img
            className="pointer-events-none absolute left-0 top-0 h-40 md:h-56 w-auto border-4 border-black bg-white object-cover opacity-0 shadow-[8px_8px_0_0_#000]"
            src={img}
            alt={`Mouse trail image ${index}`}
            key={index}
            data-mouse-move-index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default function GalleryPreviewSection() {
  const [, setLocation] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [galleryRows, setGalleryRows] = useState<{ Image_url: string; Student: string; Timestamp: string }[]>([]);
  const allLikes = useAllLikes(); // Fetches live like counts

  useEffect(() => {
    fetchGallery().then((data) => {
      // Keep only approved rows
      setGalleryRows(data.filter((r) => String(r.Approved).trim().toUpperCase() === "TRUE"));
    }).catch(console.error);
  }, []);

  const trailImages = useMemo(() => {
    if (galleryRows.length === 0) return FALLBACK_TRAIL_IMAGES;

    // Sort by likes descending to get the top picks
    const sorted = [...galleryRows].sort((a, b) => {
      const idA = generateImageId(a.Student, a.Timestamp);
      const idB = generateImageId(b.Student, b.Timestamp);
      const likesA = allLikes[idA] || 0;
      const likesB = allLikes[idB] || 0;
      return likesB - likesA;
    });

    // Take the top 15 most liked images for the trail effect
    const topPicks = sorted.slice(0, 15).map(r => r.Image_url.trim());
    return topPicks.length > 0 ? topPicks : FALLBACK_TRAIL_IMAGES;
  }, [galleryRows, allLikes]);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      setLocation("/gallery");
      setTimeout(() => setIsNavigating(false), 800);
    }, 600);
  };

  return (
    <section className="relative border-t-4 border-b-4 border-black select-none font-sans overflow-hidden">
      <MouseImageTrail
        renderImageBuffer={60}
        rotationRange={25}
        images={trailImages}
      >
        <motion.div 
          animate={isNavigating ? { backgroundPosition: "100% 100%" } : { backgroundPosition: "0% 0%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="py-32 md:py-48 flex flex-col items-center justify-center text-center relative min-h-[600px] cursor-crosshair"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={isNavigating ? { scale: 1.15, filter: "blur(10px)", y: -50, opacity: 0 } : { scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl px-4 pointer-events-none relative z-20"
          >
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] text-black font-black uppercase text-sm mb-8 transform -rotate-2">
              <Camera size={20} strokeWidth={3} />
              <span>Hover Around</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter mb-6 leading-none drop-shadow-[4px_4px_0_rgba(111,207,151,1)]">
              THE KAZIRANGA <br /> GALLERY
            </h2>
            
            <div className="w-32 h-2 bg-black mx-auto mb-8"></div>
            
            <p className="text-black font-bold text-lg md:text-2xl uppercase tracking-wide max-w-2xl mx-auto mb-12 bg-white/80 p-2">
              Beautiful moments, legendary stickers, and the finest memes of IITM BS.
            </p>
          </motion.div>

          {/* Cinematic Chromatic Split on Transition */}
          {isNavigating && (
            <>
              <motion.h2
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 1, 0], scale: 1.3, x: -30, filter: "blur(4px)" }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-8xl font-black text-[#ff5757] uppercase tracking-tighter mix-blend-multiply z-10 pointer-events-none"
              >
                THE KAZIRANGA <br /> GALLERY
              </motion.h2>
              <motion.h2
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 1, 0], scale: 1.25, x: 30, filter: "blur(4px)" }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-8xl font-black text-[#00e5ff] uppercase tracking-tighter mix-blend-multiply z-10 pointer-events-none"
              >
                THE KAZIRANGA <br /> GALLERY
              </motion.h2>
            </>
          )}

          <motion.div
            animate={isNavigating ? { scale: 0.8, opacity: 0, y: 50 } : { scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto relative z-[9999]"
          >
            <button onClick={handleExploreClick} className="inline-flex items-center gap-3 px-8 py-4 bg-[#6fcf97] text-black border-4 border-black font-black uppercase text-xl shadow-[8px_8px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none cursor-pointer group">
              <ImageIcon size={28} strokeWidth={2.5} />
              <span>EXPLORE FULL GALLERY</span>
              <ArrowRight size={28} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </MouseImageTrail>
    </section>
  );
}
