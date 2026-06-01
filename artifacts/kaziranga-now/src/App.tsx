import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useEffect, useRef, useState } from "react";
import GalleryPage from "@/pages/GalleryPage";
import EventsPage from "@/pages/EventsPage";
import CouncilPage from "@/pages/CouncilPage";
import AarohanPage from "@/pages/ArohanPage";
import RegionPage from "@/pages/RegionPage";
import BackgroundAudio from "@/components/BackgroundAudio";

const queryClient = new QueryClient();

// ─── Page fade (opacity only — transforms break position:fixed navbar) ─────────
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.2,  ease: [0.4, 0, 1, 1] } },
};

// ─── Neo-Brutalist Route Transitions ─────────────────────────────────────────
// This is a FIXED overlay with pointer-events:none — it has NO fixed children
// so transforms on it are completely safe and will never break the navbar.

type WipeType = "to-gallery" | "from-gallery" | "to-council" | "from-council";

const WIPE_PANELS_TO_GALLERY = [
  { bg: "#6fcf97" },
  { bg: "#ffc900" },
  { bg: "#000000", label: "THE GALLERY" },
];

const WIPE_PANELS_FROM_GALLERY = [
  { bg: "#6fcf97" },
  { bg: "#000000" },
];

const WIPE_PANELS_TO_COUNCIL = [
  { bg: "#1e5631" },
  { bg: "#ffc900" },
  { bg: "#0a1e12", label: "STUDENT COUNCIL" },
];

const WIPE_PANELS_FROM_COUNCIL = [
  { bg: "#1e5631" },
  { bg: "#0a1e12" },
];

function PageWipeOverlay({ type }: { type: WipeType }) {
  let panels = WIPE_PANELS_TO_GALLERY;
  if (type === "to-gallery") panels = WIPE_PANELS_TO_GALLERY;
  else if (type === "from-gallery") panels = WIPE_PANELS_FROM_GALLERY;
  else if (type === "to-council") panels = WIPE_PANELS_TO_COUNCIL;
  else if (type === "from-council") panels = WIPE_PANELS_FROM_COUNCIL;

  const isEnter = type === "to-gallery" || type === "to-council";
  const dir = isEnter ? "100%" : "-100%"; // enter from bottom or top

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9000 }}
      aria-hidden="true"
    >
      {panels.map((panel, i) => {
        const stagger = i * 0.07;
        const dur = 0.7 + i * 0.04; // slightly slower each panel
        return (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: panel.bg }}
            initial={{ y: dir }}
            animate={{
              y: [dir, "0%", isEnter ? "-100%" : "100%"],
            }}
            transition={{
              duration: dur,
              delay: stagger,
              times: [0, 0.42, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {panel.label && (
              <motion.span
                className="select-none font-black uppercase tracking-tighter text-white mix-blend-difference text-center px-4"
                style={{
                  fontSize: "clamp(2rem, 10vw, 7rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
                initial={{ opacity: 0, scaleX: 0.6, skewX: "-8deg" }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scaleX: [0.6, 1, 1, 1.05],
                  skewX: ["-8deg", "0deg", "0deg", "2deg"],
                }}
                transition={{
                  duration: dur,
                  delay: stagger,
                  times: [0, 0.28, 0.65, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {panel.label}
              </motion.span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Scroll to top on route change ────────────────────────────────────────────
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

// ─── Router ───────────────────────────────────────────────────────────────────
function Router() {
  const [location] = useLocation();

  // Track location changes to know when to show the gallery wipe
  const prevRef = useRef(location);
  const [wipe, setWipe] = useState<{ type: WipeType; key: number } | null>(null);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === location) return;

    if (location === "/gallery") {
      setWipe((w) => ({ type: "to-gallery", key: (w?.key ?? 0) + 1 }));
    } else if (prev === "/gallery") {
      setWipe((w) => ({ type: "from-gallery", key: (w?.key ?? 0) + 1 }));
    } else if (location === "/council") {
      setWipe((w) => ({ type: "to-council", key: (w?.key ?? 0) + 1 }));
    } else if (prev === "/council") {
      setWipe((w) => ({ type: "from-council", key: (w?.key ?? 0) + 1 }));
    } else {
      setWipe(null);
    }

    prevRef.current = location;
  }, [location]);

  return (
    <>
      <ScrollToTop />

      {/* Page content — opacity only (safe for fixed navbar) */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location}
          variants={pageVariants as any}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen"
          style={{ willChange: "opacity" }}
        >
          <Switch location={location}>
            <Route path="/"        component={Home} />
            <Route path="/gallery" component={GalleryPage} />
            <Route path="/events"  component={EventsPage} />
            <Route path="/council" component={CouncilPage} />
            <Route path="/aarohan"  component={AarohanPage} />
            <Route path="/meetups" component={GalleryPage} />
            <Route path="/gallery/meetups/:region" component={RegionPage} />
            <Route                 component={NotFound} />
          </Switch>
        </motion.div>
      </AnimatePresence>

      {/* Gen-Z wipe overlay — separate fixed element, transforms are safe here */}
      <AnimatePresence>
        {wipe && <PageWipeOverlay key={wipe.key} type={wipe.type} />}
      </AnimatePresence>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <BackgroundAudio />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

