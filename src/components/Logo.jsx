import React from 'react';
import { Clock } from 'lucide-react';

export const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center bg-red-600 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.5)] overflow-hidden shrink-0 ${className}`}>
      {/* White Base for the cross */}
      <div className="absolute w-[60%] h-[20%] bg-white rounded-sm"></div>
      <div className="absolute w-[20%] h-[60%] bg-white rounded-sm"></div>
      {/* Time Element overlay in the center */}
      <div className="absolute z-10 bg-white rounded-full p-[2px] shadow-sm">
        <Clock className="text-red-600 w-4 h-4" strokeWidth={3} />
      </div>
    </div>
  );
};

export default Logo;
