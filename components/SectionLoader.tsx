
import React from 'react';
import { Zap } from 'lucide-react';

interface SectionLoaderProps {
  message?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({ message = "Synchronizing Data..." }) => {
  return (
    <div className="py-32 flex flex-col items-center justify-center gap-8 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 -m-4 border-2 border-indigo-500/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl relative z-10">
          <Zap size={24} className="text-indigo-500 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">
          {message}
        </p>
        <div className="mt-4 flex gap-1 justify-center">
          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default SectionLoader;
