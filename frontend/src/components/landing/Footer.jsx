import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[var(--color-primary)]/10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logo-white.png"
                alt="GrantFit AI Logo"
                className="h-14 w-auto mr-2"
                style={{ filter: 'brightness(0)' }}
              />
              <span className="text-3xl text-[var(--color-primary)]" style={{ fontFamily: '"Gravitas One", serif' }}>
                GrantFit AI
              </span>
            </div>
            <p className="mt-4 text-[var(--color-primary)]/80 max-w-md">
              Empowering researchers and founders with AI-driven grant matching and pitch readiness tools. Turn your vision into funded reality.
            </p>
            <div className="flex space-x-6 mt-6">
              <SocialLink href="#" icon={<Twitter className="h-6 w-6" />} />
              <SocialLink href="#" icon={<Github className="h-6 w-6" />} />
              <SocialLink href="#" icon={<Linkedin className="h-6 w-6" />} />
              <SocialLink href="mailto:contact@grantfit.ai" icon={<Mail className="h-6 w-6" />} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--color-primary)] tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-4">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#how-it-works">How it Works</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#grants">Browse Grants</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--color-primary)] tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API Status</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--color-primary)]/10 pt-8 text-center text-[var(--color-primary)]/60">
          <p>&copy; {new Date().getFullYear()} GrantFit AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }) => (
  <a href={href} className="text-[var(--color-primary)]/80 hover:text-[var(--color-secondary)] transition-colors">
    {icon}
  </a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="text-[var(--color-primary)]/80 hover:text-[var(--color-secondary)] transition-colors font-medium">
      {children}
    </a>
  </li>
);

export default Footer;
