import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10", showText = true, light = false }) => {
  const textColor = light ? "text-white" : "text-slate-900";
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Arching Arrow */}
        <svg 
          viewBox="0 0 100 40" 
          className="absolute -top-4 left-0 w-full h-8 overflow-visible"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M10 35C25 10 75 10 90 35" 
            stroke="#B8860B" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <path 
            d="M85 25L90 35L80 35" 
            fill="#B8860B"
          />
        </svg>
        
        <div className={`text-3xl font-black tracking-tighter ${textColor} italic`}>
          NB
        </div>
      </div>
      
      {showText && (
        <span className={`text-2xl font-black tracking-tighter ${textColor} uppercase italic`}>
          NEXBUY
        </span>
      )}
    </div>
  );
};

export default Logo;
