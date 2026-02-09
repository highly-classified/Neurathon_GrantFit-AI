import React from 'react';
import FeatureCard from './FeatureCard';
import { Target, Search, Mic, Brain, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: "Smart Grant Matching",
    description: "Our two-layer matching system analyzes your profile against thousands of grants to find your perfect fit with binary precision."
  },
  {
    icon: Search,
    title: "AI Discovery Engine",
    description: "Automated preference matching learns from historical data to predict funding success rates for your specific domain."
  },
  {
    icon: Mic,
    title: "Pitch Practice AI",
    description: "Get real-time feedback on your 3-5 minute pitch. Our AI scores clarity, structure, and alignment to help you reach 100% readiness."
  },
  {
    icon: Brain,
    title: "Readiness Scoring",
    description: "Understand exactly where you stand. Our scoring algorithm evaluates every aspect of your application before you submit."
  },
  {
    icon: ShieldCheck,
    title: "Verified Opportunities",
    description: "Access a curated database of verified funding sources, eliminating scams and dead-ends from your search."
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Don't wait weeks for rejection. Get instant, actionable feedback on your application materials to improve iteratively."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative bg-[var(--color-surface)]">
       {/* Decorative gradient */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
            Built for Founders & Researchers
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to secure funding, from discovery to application mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
