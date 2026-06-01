import { motion } from "framer-motion";
import { BookOpen, ExternalLink, ClipboardList, BarChart3, Users, FileText, FileCheck } from "lucide-react";
import { useContent } from "@/hooks/useData";

const QUICK_LINKS = [
  {
    label: "Official Study Portal",
    url: "https://study.iitm.ac.in/",
    icon: <BookOpen size={20} />,
    description: "Access course content, lectures, and assignments",
  },
  {
    label: "OPPE Exam Link",
    url: "https://study.iitm.ac.in/ds/exam.html",
    icon: <ClipboardList size={20} />,
    description: "Online Proctored Programming Exam portal",
  },
  {
    label: "Looker Studio",
    url: "https://datastudio.google.com/u/0/reporting/d02dac13-665b-49cc-8d51-0451268a6a3e/page/p_cj44rizltd?s=k3kRC9kDo54",
    icon: <BarChart3 size={20} />,
    description: "Google's data visualization and reporting tool",
  },
  {
    label: "Study Circle Joining Form",
    url: "https://forms.gle/kKBmVCAu8UwtpcpN8",
    icon: <Users size={20} />,
    description: "Join a study group with fellow Kaziranga members",
  },
  {
    label: "Student Handbook",
    url: "https://docs.google.com/document/d/e/2PACX-1vRxGnnDCVAO3KX2CGtMIcJQuDrAasVk2JHbDxkjsGrTP5ShhZK8N6ZSPX89lexKx86QPAUswSzGLsOA/pub",
    icon: <FileText size={20} />,
    description: "Official guide, policies, and handbook for students",
  },
  {
    label: "Grading Document",
    url: "https://docs.google.com/document/d/e/2PACX-1vSUvKzH7yIXNVwUgRYSIT8M0x1jhFSkslEtj9UPo3dtWI_sJ38Hh_PzbBygpF0vIOo8K7lTy-uYkqdu/pub",
    icon: <FileCheck size={20} />,
    description: "Details on course grading criteria and structure",
  },
];

export default function StudySection() {
  const { data: content } = useContent();
  const studyData = content?.study;

  return (
    <section id="study" className="py-20 md:py-28 relative overflow-hidden">
      {/* Cream gradient with green tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eae4ce] via-[#e8e2cc] to-[#f0ead4]" />
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-[#1e5631]/4 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {studyData?.sectionImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 rounded-2xl overflow-hidden shadow-lg max-w-3xl mx-auto border border-[#1e5631]/10"
          >
            <img src={studyData.sectionImage} alt={studyData.sectionTitle} className="w-full h-48 md:h-64 object-cover" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="w-14 h-14 bg-[#1e5631]/10 text-[#1e5631] rounded-2xl flex items-center justify-center mb-5 mx-auto">
            <BookOpen size={28} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3a1a] mb-4">
            Study Zone
          </h2>
          <p className="text-lg text-[#4a6741] max-w-xl mx-auto">
            {studyData?.sectionSubtitle || "Quick access to all essential study resources for the IITM BS program."}
          </p>
        </motion.div>

        {/* Quick Link Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {QUICK_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-white/60 hover:bg-white/90 border-[#1e5631]/10 hover:border-[#1e5631]/30 shadow-sm hover:shadow-[0_8px_24px_rgba(30,86,49,0.12)]"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1e5631]/10 flex items-center justify-center flex-shrink-0 text-[#1e5631] group-hover:bg-[#1e5631] group-hover:text-white transition-colors">
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[15px] text-[#1a3a1a] leading-snug">{link.label}</span>
                  <ExternalLink size={14} className="text-[#1e5631] opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
                <p className="text-xs text-[#4a6741] leading-relaxed">{link.description}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
