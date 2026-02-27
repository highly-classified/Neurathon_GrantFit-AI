import React from 'react';
import { motion } from 'framer-motion';
import { Mic, CheckCircle, Smartphone, Activity } from 'lucide-react';

const PitchPractice = () => {
  return (
    <section id="pitch-ai" className="py-24 relative bg-transparent overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 mb-6">
            <Activity className="h-4 w-4 text-white mr-2" />
            <span className="text-white text-sm font-semibold">Real-Time Analysis</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Master Your Pitch <br />
            <span className="text-white">Before You Submit</span>
          </h2>
          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            Don't lose a grant because of a weak presentation. Our AI analyzes your 3-minute pitch for clarity, confidence, and structure, offering actionable feedback to hit that 100% readiness score.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              "Instant Confidence Scoring",
              "Tone & Pacing Analysis",
              "Keyword Optimization Insights",
              "Iterative Feedback Loops"
            ].map((item, i) => (
              <div key={i} className="flex items-center text-gray-200 bg-gray-800/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-700/30">
                <CheckCircle className="h-5 w-5 text-white mr-2" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PitchPractice;
