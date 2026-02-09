import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Create Profile",
    description: "Input your domain, funding needs, and personal details to set your baseline."
  },
  {
    number: "02",
    title: "Submit Idea",
    description: "Describe your research or startup concept for AI analysis."
  },
  {
    number: "03",
    title: "Get Matches",
    description: "Receive a curated list of eligible grants sorted by deadline."
  },
  {
    number: "04",
    title: "Perfect Pitch",
    description: "Use the AI coach to refine your voice or text pitch to 100% readiness."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#0a192f] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-300">From idea to application in four simple steps.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[20%] left-0 w-full h-1 bg-[#233554] z-0"></div>

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#112240] border-4 border-[#64ffda] text-[#64ffda] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 relative">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
