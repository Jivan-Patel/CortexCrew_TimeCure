import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Timer, Activity } from 'lucide-react';

const AIPredictionPanel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel p-6 flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 h-full"
    >
      {/* Background Brain glow */}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
        <BrainCircuit size={160} className="text-neon-blue" />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-neon-blue/20 rounded-lg text-neon-blue backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <BrainCircuit className="w-5 h-5 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-white">AI Flow Tracker</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8 relative z-10">
        
        {/* Metric 1 */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-neon-blue" />
              Dynamic Load
            </span>
            <span className="text-xl font-bold font-mono text-white">85%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-neon-blue to-cyan-400 rounded-full relative"
            >
               <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
          <p className="text-[10px] text-slate-500 text-right">Heavy load expected at 14:00</p>
        </div>

        {/* Metric 2 */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              Est. Consult Time
            </span>
            <span className="text-xl font-bold font-mono text-white">12<span className="text-sm text-slate-500 font-sans ml-0.5">m</span></span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="h-full bg-gradient-to-r from-primary to-green-300 rounded-full relative"
            >
               <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
          <p className="text-[10px] text-slate-500 text-right">Optimized by +15% today</p>
        </div>

      </div>
    </motion.div>
  );
};

export default AIPredictionPanel;
