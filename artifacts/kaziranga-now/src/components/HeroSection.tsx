import { motion } from "framer-motion";
import { useContent } from "@/hooks/useData";


export default function HeroSection() {
  const { data: content, isLoading, isError, error } = useContent();
  const hero = content?.hero;
  const site = content?.site;



  if (isError) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center bg-background scroll-mt-20">
        <div className="max-w-lg mx-auto p-10 bg-red-50 rounded-3xl text-center border-2 border-red-200 shadow-xl">
          <div className="text-5xl mb-4">🦏</div>
          <h2 className="text-2xl font-bold text-red-800 mb-3">Oops — content.json has a problem</h2>
          <p className="text-red-600 text-sm font-mono bg-red-100 rounded-lg p-3 mb-3">
            {(error as Error)?.message}
          </p>
          <p className="text-red-500 text-sm">
            Open <code className="bg-red-100 px-1 rounded">public/data/content.json</code>, fix the JSON syntax, and save.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden scroll-mt-20">
      {/* Background — jungle illustration */}
      <div className="absolute inset-0 z-0">
        <img
          src="/jungle-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />
      </div>

      {/* Floating particles / fireflies effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-200/40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero content — pushed toward top so bg rhino stays visible */}
      <div className="flex-1 flex items-start justify-center pt-24 md:pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">

            {/* Rhino logo badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center mb-5"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shadow-2xl border-3 border-white/30 bg-white/10 backdrop-blur-sm">
                <img
                  src="/logo.png"
                  alt="Kaziranga House Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight mb-2 leading-tight"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6), 0 0 20px rgba(30,86,49,0.95), 0 0 10px rgba(30,86,49,0.85)" }}
            >
              {isLoading ? "Kaziranga House" : (hero?.title || "Kaziranga House")}
            </motion.h1>

            {/* Animated Underline (Progress Bar style) */}
            <div className="flex justify-center mt-3 mb-6">
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "96px", opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                className="h-[3px] bg-white/20 rounded-full overflow-hidden relative shadow-[0_0_8px_rgba(30,86,49,0.5)]"
              >
                <motion.div
                  animate={{
                    left: ["-100%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#6fcf97] to-transparent z-10"
                />
                <div className="absolute inset-0 bg-[#1e5631] opacity-80 z-0" />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-base md:text-lg text-white/85 font-medium max-w-xl mx-auto mb-6"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)" }}
            >
              {isLoading ? "BEYOND LIMITS" : "BEYOND LIMITS"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                data-testid="button-explore"
                onClick={() => document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-[#1e5631] text-white hover:bg-[#174726] px-7 py-2.5 rounded-full font-semibold text-sm transition-all shadow-xl hover:shadow-[#1e5631]/40 hover:scale-105 active:scale-95 duration-200 border border-white/20"
              >
                {isLoading ? "Explore the Forest" : (hero?.ctaText || "Explore the Forest")}
              </button>
            </motion.div>
          </div>
        </div>
      </div>


    </section>
  );
}
