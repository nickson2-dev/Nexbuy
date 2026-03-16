
import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-sm italic text-white">NX</div>
            <span className="text-xl font-black tracking-tighter text-slate-900">NEXOTA</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Pioneering the next generation of consumer electronics with a focus on design, performance, and user experience.
          </p>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors">
                <div className="w-5 h-5 bg-current opacity-20 rounded-sm"></div>
              </div>
            ))}
          </div>
        </div>
        
        {[
          { title: 'Shop', links: ['Vision Pro', 'AeroBuds', 'Chronos Watch', 'Nexus Pad', 'Lumina'] },
          { title: 'Support', links: ['Help Center', 'Order Status', 'Returns & Exchanges', 'Shipping Info', 'Contact Us'] },
          { title: 'Company', links: ['Our Story', 'Careers', 'Sustainability', 'Investors', 'Privacy Policy'] }
        ].map(column => (
          <div key={column.title}>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-sm">{column.title}</h4>
            <ul className="space-y-4">
              {column.links.map(link => (
                <li key={link}>
                  <button 
                    onClick={() => onNavigate(link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}
                    className="text-slate-500 hover:text-indigo-600 text-sm transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 text-xs tracking-wide">
          © 2024 Nexota Global Inc. All rights reserved. Designed for the Future.
        </p>
        <div className="flex gap-8">
          <button onClick={() => onNavigate('terms-of-use')} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Terms of Use</button>
          <button onClick={() => onNavigate('privacy-policy')} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Privacy Policy</button>
          <button onClick={() => onNavigate('cookie-settings')} className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Cookie Settings</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
