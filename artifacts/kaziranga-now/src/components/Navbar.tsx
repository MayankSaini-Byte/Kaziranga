import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useContent } from "@/hooks/useData";
import { Link } from "wouter";

export default function Navbar() {
  const { data: content } = useContent();
  const site = content?.site;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "About Us", id: "about-us", type: "scroll" },
    { label: "Council", id: "council", type: "scroll" },
    { label: "Events", id: "events", type: "scroll" },
    { label: "Gallery", path: "/gallery", type: "route" },
    { label: "Study Zone", id: "study", type: "scroll" },
    { label: "Kaziranga Tak", id: "tak", type: "scroll" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1e5631]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <button
          data-testid="button-nav-home"
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden shadow-md flex-shrink-0 border-2 border-white/20 group-hover:border-white/50 transition-colors">
            <img
              src="/logo.png"
              alt="Kaziranga House"
              className="w-full h-full object-cover"
            />
          </div>
          <span 
            className="font-serif font-bold text-xl text-white tracking-tight"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)" }}
          >
            {site?.name || "Kaziranga House"}
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            link.type === "route" ? (
              <Link key={link.label} href={link.path!}>
                <a 
                  className="relative text-sm font-bold text-white px-5 py-2 rounded-full bg-[#1e5631] hover:bg-[#174726] transition-all duration-200 ml-2 shadow-[0_0_15px_rgba(30,86,49,0.4)] border border-white/20"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {link.label}
                </a>
              </Link>
            ) : (
              <button
                key={link.id}
                data-testid={`button-nav-${link.id}`}
                onClick={() => scrollTo(link.id!)}
                className="relative text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)" }}
              >
                {link.label}
              </button>
            )
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          data-testid="button-mobile-menu"
          className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu — animated slide-down */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -12, scaleY: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top center" }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#1e5631]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-4 px-4 flex flex-col gap-1"
          >
            {navLinks.map((link, i) => (
              link.type === "route" ? (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={link.path!}>
                    <a 
                      className="block text-left py-3 px-4 text-base font-bold text-white bg-[#1e5631] hover:bg-[#174726] border border-white/20 rounded-xl transition-all mt-2 text-center shadow-lg"
                      style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)" }}
                    >
                      {link.label}
                    </a>
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  data-testid={`button-mobile-nav-${link.id}`}
                  onClick={() => scrollTo(link.id!)}
                  className="text-left py-3 px-4 text-base font-medium text-white/85 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {link.label}
                </motion.button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
