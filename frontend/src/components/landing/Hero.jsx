import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-surface)]">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[glow_2s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[glow_2s_ease-in-out_infinite_alternate]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-md mb-8">
            <Sparkles className="h-4 w-4 text-[var(--color-secondary)] mr-2" />
            <span className="text-gray-300 text-sm font-medium">AI-Powered Grant Matching</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block text-white">Fund Your Vision</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)]">
              With Precision AI
            </span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
            Stop searching, start applying. Our two-layer matching system connects you with the right funding opportunities and perfects your pitch with AI-driven feedback.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/login'}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-full text-gray-600 hover:text-gray-900 transition-all"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Floating UI Elements Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 relative mx-auto max-w-4xl"
        >
          <div className="relative rounded-2xl bg-gray-900/50 border border-gray-700/50 backdrop-blur-xl p-4 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
             <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-gray-800/50 rounded-lg h-32 animate-pulse"></div>
                <div className="col-span-2 space-y-3">
                    <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                    <div className="flex gap-2 mt-4">
                        <div className="h-8 w-20 bg-[var(--color-primary)]/20 rounded"></div>
                        <div className="h-8 w-20 bg-[var(--color-secondary)]/20 rounded"></div>
                    </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
