
import React from 'react';
import { Zap } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      {/* Central Animation */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          {/* Rotating Rings */}
          <div className="absolute inset-0 -m-4 border-2 border-indigo-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-0 -m-8 border border-slate-800 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
          
          {/* Core Icon */}
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)] animate-float relative z-10">
            <Zap size={40} className="text-white fill-white/20" />
          </div>
        </div>

        {/* Textual Feedback */}
        <div className="text-center space-y-2">
          <h2 className="text-white font-black text-xl uppercase tracking-[0.3em] italic animate-pulse">
            Nexbuy <span className="text-indigo-400">OS</span>
          </h2>
          <div className="flex items-center gap-2 justify-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-4">
            Initializing Ecosystem...
          </p>
        </div>
      </div>

      {/* Scanning Line */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent scan-line pointer-events-none"></div>
      
      {/* Corner Accents */}
      <div className="absolute top-10 left-10 border-t-2 border-l-2 border-indigo-500/30 w-10 h-10"></div>
      <div className="absolute top-10 right-10 border-t-2 border-r-2 border-indigo-500/30 w-10 h-10"></div>
      <div className="absolute bottom-10 left-10 border-b-2 border-l-2 border-indigo-500/30 w-10 h-10"></div>
      <div className="absolute bottom-10 right-10 border-b-2 border-r-2 border-indigo-500/30 w-10 h-10"></div>
    </div>
  );
};

export default LoadingScreen;
