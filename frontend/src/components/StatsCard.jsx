import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 800; // faster, non-distracting
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="expert-panel p-6 flex flex-col justify-center min-h-[110px] relative overflow-hidden bg-white">
      {/* Subtle branding accent line */}
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary"></div>
      <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider ml-2">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 ml-2">{displayValue}</h3>
    </div>
  );
};

export default StatsCard;
