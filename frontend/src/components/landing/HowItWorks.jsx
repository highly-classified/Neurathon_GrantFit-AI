import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Filter, Mic, Award } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Creates Profile",
    description: "Submit your idea and structured profile details (domain, role, funding needs)."
  },
  {
    icon: Filter,
    title: "AI Matching",
    description: "Two-layer system filters eligibility and aligns your profile with grant preferences."
  },
  {
    icon: Mic,
    title: "Pitch Practice",
    description: "Record a 3-5m pitch. Receive AI readiness scores and improvement suggestions."
  },
  {
    icon: Award,
    title: "Win Funding",
    description: "Apply to high-match grants with a polished pitch and expert-level confidence."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            From Idea to Funded
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto text-lg">
            A simple, data-driven path to secure your research or startup grant.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)]/40 via-[var(--color-secondary)]/80 to-[var(--color-primary)]/40 -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-gray-700 border-4 border-[var(--color-background)] z-10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="bg-gray-800/30 p-6 rounded-2xl w-full h-full backdrop-blur-sm hover:bg-gray-800/50 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
