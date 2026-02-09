import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const FeatureCard = ({ icon: Icon, title, description, delay, className, textAlign = 'left', verticalAlign = 'top' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={twMerge(
        "p-6 rounded-2xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all group flex flex-col h-full",
        textAlign === 'center' ? 'items-center text-center' : 'items-start text-left',
        verticalAlign === 'center' ? 'justify-center' : 'justify-start',
        className
      )}
    >
      <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform flex-shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 flex-shrink-0">{title}</h3>
      <p className="text-gray-200 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
