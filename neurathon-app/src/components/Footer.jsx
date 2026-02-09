import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020c1b] text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-[#64ffda] mb-4 block">GrantMatch AI</span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering researchers and founders to find the right funding with the power of Artificial Intelligence.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#64ffda] transition-colors">Find Grants</a></li>
              <li><a href="#" className="hover:text-[#64ffda] transition-colors">Pitch Practice</a></li>
              <li><a href="#" className="hover:text-[#64ffda] transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-[#64ffda] transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#64ffda] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#64ffda] transition-colors">Grant Writing Tips</a></li>
              <li><a href="#" className="hover:text-[#64ffda] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#64ffda] transition-colors">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-[#64ffda] transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#64ffda] transition-colors"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#64ffda] transition-colors"><Linkedin size={20} /></a>
            </div>
            <a href="mailto:hello@grantmatch.ai" className="flex items-center gap-2 text-gray-400 hover:text-[#64ffda] text-sm">
              <Mail size={16} /> hello@grantmatch.ai
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} GrantMatch AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
