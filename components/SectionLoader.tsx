
import React from 'react';
import { Zap } from 'lucide-react';

interface SectionLoaderProps {
  message?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({ message = "Synchronizing Data..." }) => {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center gap-8 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 w-16 h-16 border-2 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 bg-indigo-50 rounded-xl animate-pulse"></div>
      </div>
      <div className="space-y-3 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">
          {message}
        </p>
        <div className="flex gap-1.5 justify-center">
          <div className="w-1 h-1 bg-indigo-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default SectionLoader;
