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

  // Handle Light/Dark variant text color assignments
  let textClass = '';
  if (colorClass.includes('primary')) textClass = 'text-primary';
  else if (colorClass.includes('red')) textClass = 'text-red-600 dark:text-red-500';
  else textClass = 'text-slate-800 dark:text-slate-200';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel p-6 flex flex-col justify-between group overflow-hidden relative cursor-pointer h-[140px]"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${colorClass} opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
      
      <div className="flex justify-between items-start mb-2 relative z-10 w-full">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 truncate">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white shrink-0">{isNumeric ? displayValue : value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${colorClass.replace('bg-', 'bg-')}/10 shadow-sm flex-shrink-0 border border-slate-100 dark:border-slate-800`}>
          <Icon className={`w-6 h-6 ${textClass}`} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 relative z-10 text-sm mt-auto">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${trend === 'up' ? 'bg-primary/10 text-primary border border-primary/20' : (trend === 'down' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300')}`}>
          {trend === 'up' ? '↑' : (trend === 'down' ? '↓' : '-')} {trendValue}
        </span>
        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium uppercase tracking-wider">vs last month</span>
      </div>
    </motion.div>
  );
};

export default StatsCard;
