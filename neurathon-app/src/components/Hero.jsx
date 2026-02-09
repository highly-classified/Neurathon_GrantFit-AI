import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-[#0a192f] text-white overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#112240] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#233554] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#64ffda] font-mono mb-4 block text-lg">AI-Powered Grant Matching</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Secure Funding for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] to-blue-400">Vision</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Discover relevant grants, refine your pitch with AI, and track your applications—all in one intelligent platform designed for researchers and founders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/login" className="bg-[#64ffda] text-[#0a192f] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#4cccb0] transition-colors flex items-center justify-center gap-2">
              Start Matching <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border-2 border-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
              Watch Demo
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#64ffda]" />
              <span>Smart Eligibility Check</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#64ffda]" />
              <span>AI Pitch Coach</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:block"
        >
           {/* Abstract Representation of Matching/AI */}
           <div className="relative w-full h-[500px] bg-[#112240] rounded-2xl border border-[#233554] p-6 shadow-2xl skew-y-[-2deg] hover:skew-y-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-6 border-b border-[#233554] pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-auto text-xs text-gray-500 font-mono">search_grants.py</div>
              </div>
              
              <div className="space-y-4">
                <div className="h-4 bg-[#233554] rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-[#233554] rounded w-1/2 animate-pulse"></div>
                
                <div className="mt-8 p-4 bg-[#0a192f] rounded-lg border border-[#64ffda]/20">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[#64ffda] font-mono text-sm">Match Found</span>
                        <span className="bg-[#64ffda]/10 text-[#64ffda] text-xs px-2 py-1 rounded">98% Match</span>
                    </div>
                    <h3 className="text-white font-bold text-lg">National Innovation Fund</h3>
                    <p className="text-gray-400 text-sm mt-1">Perfect alignment with your AI healthcare project.</p>
                </div>

                <div className="mt-4 p-4 bg-[#0a192f] rounded-lg border border-white/10 opacity-60">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 font-mono text-sm">Potential Match</span>
                        <span className="bg-white/10 text-gray-400 text-xs px-2 py-1 rounded">75% Match</span>
                    </div>
                    <h3 className="text-white font-bold text-lg">Tech Startup Grant</h3>
                </div>
              </div>

               {/* Floating elements */}
               <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -right-8 top-20 bg-white text-[#0a192f] p-4 rounded-lg shadow-xl font-bold"
               >
                  🎯 95% Success Rate
               </motion.div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
