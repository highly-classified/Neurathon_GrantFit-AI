import React from 'react';
import { motion } from 'framer-motion';
import { Mic, CheckCircle, Smartphone, Activity } from 'lucide-react';

const PitchPractice = () => {
  return (
    <section id="pitch-ai" className="py-24 relative bg-[var(--color-surface)] overflow-hidden">
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
              Master Your Pitch <br/>
              <span className="text-[var(--color-secondary)]">Before You Submit</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Don't lose a grant because of a weak presentation. Our AI analyzes your 3-minute pitch for clarity, confidence, and structure, offering actionable feedback to hit that 100% readiness score.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Instant Confidence Scoring",
                "Tone & Pacing Analysis",
                "Keyword Optimization Insights",
                "Iterative Feedback Loops"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-[var(--color-accent)] mr-3" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="bg-[var(--color-surface)] border border-gray-600 hover:border-white text-white px-8 py-3 rounded-full font-medium transition-all flex items-center group">
              Try Demo Pitch
              <Mic className="ml-2 h-5 w-5 group-hover:text-[var(--color-accent)] transition-colors" />
            </button>
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
              
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                    <h4 className="text-white font-semibold">Pitch Analysis Results</h4>
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Score: 85/100</span>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Clarity</span>
                            <span>92%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-secondary)] w-[92%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Pacing</span>
                            <span>78%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-primary)] w-[78%]"></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Confidence</span>
                            <span>88%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-accent)] w-[88%]"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-gray-800/50 p-4 rounded-lg">
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
