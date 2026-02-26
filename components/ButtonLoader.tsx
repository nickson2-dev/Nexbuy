
import React from 'react';

const ButtonLoader: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
    </div>
  );
};

export default ButtonLoader;
