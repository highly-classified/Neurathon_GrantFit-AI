import React from 'react';
import FeatureCard from './FeatureCard';
import { Target, Search, Mic, Brain, ShieldCheck, Zap } from 'lucide-react';
import Masonry from './Masonry';

const Features = () => {
  // Define features with specific ordering for Masonry
  const features = [
    // Left Top
    {
      id: "readiness",
      icon: Brain,
      title: "Readiness Scoring",
      description: "Understand exactly where you stand. Our scoring algorithm evaluates every aspect of your application before you submit.",
      height: 300
    },
    // Center Top (Tall)
    {
      id: "smart-matching",
      icon: Target,
      title: "Smart Grant Matching",
      description: "Our two-layer matching system analyzes your profile against thousands of grants to find your perfect fit with binary precision. Includes advanced analytics and compatibility insights.",
      height: 600, // Taller
      textAlign: 'left',
      verticalAlign: 'center'
    },
    // Right Top
    {
      id: "instant-feedback",
      icon: Zap,
      title: "Instant Feedback",
      description: "Don't wait weeks for rejection. Get instant, actionable feedback on your application materials to improve iteratively.",
      height: 300
    },
    // Left Bottom
    {
      id: "pitch-practice",
      icon: Mic,
      title: "Pitch Practice AI",
      description: "Get real-time feedback on your 3-5 minute pitch. Our AI scores clarity, structure, and alignment to help you reach 100% readiness.",
      height: 300
    },
    // Right Bottom
    {
      id: "verified-opportunities",
      icon: ShieldCheck,
      title: "Verified Opportunities",
      description: "Access a curated database of verified funding sources, eliminating scams and dead-ends from your search.",
      height: 300
    }
    // Note: "AI Discovery Engine" removed to fit 5-card layout
  ];

  // Transform features into Masonry compatible items
  const masonryItems = features.map(f => ({
    id: f.id,
    height: f.height,
    content: (
      <div style={{ height: '100%' }}> {/* Ensure FeatureCard container fills height */}
        <FeatureCard
          {...f}
          // Pass className or style to ensure FeatureCard takes full height if it doesn't already
          className="h-full"
        />
      </div>
    )
  }));


  return (
    <section id="features" className="py-24 relative bg-transparent min-h-screen">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-200 mb-4">
            Built for Founders & Researchers
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto text-lg">
            Everything you need to secure funding, from discovery to application mastery.
          </p>
        </div>

        <div className="min-h-[800px]"> {/* Container for Masonry */}
          <Masonry
            items={masonryItems}
            stagger={0.1}
            duration={0.8}
            animateFrom="bottom"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
