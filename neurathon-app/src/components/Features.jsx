import React from 'react';
import { Target, Mic, Brain, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Target className="w-10 h-10 text-[#64ffda]" />,
    title: "Precision Matching",
    description: "Our dual-layer matching system filters hard eligibility criteria and uses AI to analyze your idea against historical grant data."
  },
  {
    icon: <Mic className="w-10 h-10 text-[#64ffda]" />,
    title: "AI Pitch Coach",
    description: "Practice your 3-5 minute pitch and get instant scoring on clarity, structure, and topic alignment with actionable feedback."
  },
  {
    icon: <Brain className="w-10 h-10 text-[#64ffda]" />,
    title: "Historical Insights",
    description: "Algorithm trained on previously funded and rejected profiles to predict your success probability."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-[#64ffda]" />,
    title: "Smart Filtering",
    description: "Instantly categorize grants into 'Eligible', 'May be Eligible', and 'Ineligible' to save your time."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-[#0a192f] mb-4">Why Choose GrantMatch AI?</h2>
          <p className="text-gray-600 text-lg">
            Stop wasting time on grants you can't win. Focus on opportunities where you have the highest probability of success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8 bg-gray-50 rounded-xl hover:shadow-xl transition-shadow border border-gray-100 group hover:-translate-y-2 hover:bg-white"
            >
              <div className="bg-[#0a192f] w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0a192f] mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
