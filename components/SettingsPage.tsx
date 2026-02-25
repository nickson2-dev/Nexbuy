
import React, { useState } from 'react';
import { ChevronLeft, Globe, Flag, Bell, Shield, Moon, Sun, Info } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [language, setLanguage] = useState('English (US)');
  const [country, setCountry] = useState('United States');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase text-[10px] tracking-widest mb-12 transition-all group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to Catalog
      </button>

      <div className="mb-16">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">Core Settings</h1>
        <p className="text-slate-500 font-medium">Customize your Nexbuy interface and localization preferences.</p>
      </div>

      <div className="space-y-10">
        {/* Localization */}
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <Globe size={16} className="text-indigo-600" /> Localization Pulse
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Interface Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold appearance-none"
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Deutsch</option>
                <option>Français</option>
                <option>日本語</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Market Region</label>
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold appearance-none"
              >
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>France</option>
                <option>Japan</option>
                <option>United Arab Emirates</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interface Preferences */}
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <Sun size={16} className="text-orange-500" /> Visual Parameters
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Dark Mode Architecture</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Experimental HUD Theme</p>
                </div>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-8 rounded-full transition-all relative ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Neural Notifications</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Transaction & Reward Alerts</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full transition-all relative ${notifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Security & System */}
        <div className="bg-slate-900 p-8 md:p-10 rounded-[40px] text-white space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <Shield size={16} className="text-indigo-400" /> System Protocols
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <p className="text-sm font-bold mb-1">Nexbuy OS v2.8.4</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Build ID: 8820-X-LABS</p>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <p className="text-sm font-bold mb-1">Encrypted Relay</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active via Firebase Shield</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
            <Info className="text-indigo-400 shrink-0" size={20} />
            <p className="text-[10px] text-indigo-300 font-bold leading-relaxed uppercase tracking-wide">
              Settings are synchronized across your Nexbuy Neural Link. Some features may require an active merchant session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
