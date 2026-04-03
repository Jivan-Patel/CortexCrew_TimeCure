import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const isNumeric = typeof value === 'number';

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }
    
    let start = 0;
    const end = value;
    const duration = 1000;
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
  }, [value, isNumeric]);

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass-panel p-6 flex flex-col justify-between group overflow-hidden relative cursor-pointer h-[140px]"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${colorClass} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}></div>
      
      <div className="flex justify-between items-start mb-2 relative z-10 w-full">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-slate-400 text-sm font-medium mb-1 truncate">{title}</p>
          <h3 className="text-3xl font-bold text-white shrink-0">{isNumeric ? displayValue : value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${colorClass.replace('bg-', 'bg-')}/20 shadow-inner flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 relative z-10 text-sm mt-auto">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${trend === 'up' ? 'bg-primary/20 text-primary' : (trend === 'down' ? 'bg-neon-red/20 text-neon-red' : 'bg-slate-700 text-slate-300')}`}>
          {trend === 'up' ? '↑' : (trend === 'down' ? '↓' : '-')} {trendValue}
        </span>
        <span className="text-slate-500 text-xs">vs last month</span>
      </div>
    </motion.div>
  );
};

export default StatsCard;
