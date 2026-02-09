import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all group"
    >
      <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-[var(--color-primary)]" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
