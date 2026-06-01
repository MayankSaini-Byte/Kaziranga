import { motion } from "framer-motion";
import { Users, Calendar, Trophy, Sparkles } from "lucide-react";

export default function AboutUsSection() {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Vibrant Community",
      description: "Organizes meetups and networking events to foster strong connections among students.",
    },
    {
      icon: <Calendar size={24} />,
      title: "Social Gatherings",
      description: "Hosts fun activities and social gatherings to unwind and celebrate together.",
    },
    {
      icon: <Trophy size={24} />,
      title: "Competitions",
      description: "Conducts in-house competitions and challenges to bring out the best in everyone.",
    },
    {
      icon: <Sparkles size={24} />,
      title: "Personal Growth",
      description: "Encourages collaboration, leadership, and personal growth inspired by Kaziranga's spirit.",
    },
  ];

  return (
    <section id="about-us" className="py-24 bg-[#0a1e12] text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/jungle-bg.png')", backgroundSize: 'cover' }}></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">About Kaziranga House</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              We are a vibrant student community drawing inspiration from the resilience, diversity, and strength of the Kaziranga National Park. We believe in rooted resilience and rising together.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#1e5631] text-white flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
