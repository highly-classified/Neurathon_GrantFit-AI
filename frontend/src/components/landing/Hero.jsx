import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import TrueFocus from './TrueFocus';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
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
          
          <div className="mb-8 flex justify-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <TrueFocus 
                sentence="Find|your Fund"
                separator="|"
                manualMode={false}
                blurAmount={5}
                borderColor="#ffffff"
                animationDuration={0.5}
                pauseBetweenAnimations={1}
              />
            </h1>
          </div>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200 mb-10">
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
          </div>
        </motion.div>


      </div>
    </div>
  );
};

export default Hero;
