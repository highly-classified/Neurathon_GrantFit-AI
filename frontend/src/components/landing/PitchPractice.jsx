import React from 'react';
import { motion } from 'framer-motion';
import { Mic, CheckCircle, Smartphone, Activity } from 'lucide-react';

const PitchPractice = () => {
  return (
    <section id="pitch-ai" className="py-24 relative bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 mb-6">
              <Activity className="h-4 w-4 text-[var(--color-primary)] mr-2" />
              <span className="text-[var(--color-primary)] text-sm font-semibold">Real-Time Analysis</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Master Your Pitch <br />
              <span className="text-white">Before You Submit</span>
            </h2>
            <p className="text-gray-200 text-lg mb-8">
              Don't lose a grant because of a weak presentation. Our AI analyzes your 3-minute pitch for clarity, confidence, and structure, offering actionable feedback to hit that 100% readiness score.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Instant Confidence Scoring",
                "Tone & Pacing Analysis",
                "Keyword Optimization Insights",
                "Iterative Feedback Loops"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-gray-200">
                  <CheckCircle className="h-5 w-5 text-[#1e3a8a] mr-3" />
                  {item}
                </li>
              ))}
            </ul>


          </motion.div>

          {/* Visual Representation of Dashboard/Mobile App */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 lg:mt-0 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl blur-2xl opacity-20 transform rotate-6"></div>

            <div className="relative bg-gradient-to-br from-gray-600 to-blue-900/60 border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-4">
                <h4 className="text-white font-semibold">Pitch Analysis Results</h4>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Score: 85/100</span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-white font-semibold mb-1">
                    <span>Clarity</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 bg-[#1e3a8a] rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 w-[92%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-white font-semibold mb-1">
                    <span>Pacing</span>
                    <span>78%</span>
                  </div>
                  <div className="h-2 bg-[#1e3a8a] rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 w-[78%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-white font-semibold mb-1">
                    <span>Confidence</span>
                    <span>88%</span>
                  </div>
                  <div className="h-2 bg-[#1e3a8a] rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 w-[88%]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-900/30 p-4 rounded-lg border border-blue-700/40">
                <p className="text-sm text-gray-300 italic">
                  "Great energy! Try to slow down slightly during the value proposition section to ensure key points land effectively."
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Activity className="h-3 w-3 mr-1" />
                  AI Feedback
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PitchPractice;
