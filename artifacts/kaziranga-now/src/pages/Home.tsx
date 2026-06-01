import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutUsSection from "@/components/AboutUsSection";
import ReelSection from "@/components/ReelSection";
import EventsSection from "@/components/EventsSection";
import CouncilSection from "@/components/CouncilSection";
import GalleryPreviewSection from "@/components/GalleryPreviewSection";
import StudySection from "@/components/StudySection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#1e5631]/30 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero: no reveal — visible immediately */}
        <HeroSection />

        <ScrollReveal delay={0}>
          <AboutUsSection />
        </ScrollReveal>

        <ScrollReveal delay={0}>
          <CouncilSection />
        </ScrollReveal>

        <ScrollReveal delay={0}>
          <EventsSection />
        </ScrollReveal>

        <ScrollReveal delay={0}>
          <GalleryPreviewSection />
        </ScrollReveal>

        <ScrollReveal delay={0}>
          <StudySection />
        </ScrollReveal>

        <ScrollReveal delay={0}>
          <ReelSection />
        </ScrollReveal>
      </main>

      <ScrollReveal delay={0} distance={24}>
        <Footer />
      </ScrollReveal>
    </div>
  );
}
