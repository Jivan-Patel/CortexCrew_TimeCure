import React from 'react';
import { BrainCircuit, Timer, Activity } from 'lucide-react';

const AIPredictionPanel = () => {
  return (
    <div className="expert-panel p-6 flex flex-col relative overflow-hidden bg-slate-50/50 h-full">
      {/* Background Brain graphic */}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
        <BrainCircuit size={160} className="text-blue-600" />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 border border-blue-200 bg-blue-50 rounded-lg text-blue-600">
          <BrainCircuit className="w-5 h-5 animate-pulse" />
        </div>
        <div>
           <h3 className="text-lg font-bold text-slate-900">AI Flow Tracker</h3>
           <p className="text-xs text-slate-500 font-medium">Monitoring hospital congestion patterns</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8 relative z-10">
        
        {/* Metric 1 */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Dynamic Load
            </span>
            <span className="text-xl font-bold font-mono text-slate-900">85%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-[85%] transition-all duration-1000 ease-out"></div>
          </div>
          <p className="text-[10px] text-slate-500 text-right font-medium">Heavy load expected at 14:00</p>
        </div>

        {/* Metric 2 */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              Est. Consult Time
            </span>
            <span className="text-xl font-bold font-mono text-slate-900">12<span className="text-sm text-slate-500 font-sans ml-0.5">m</span></span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[65%] transition-all duration-1000 ease-out"></div>
          </div>
          <p className="text-[10px] text-slate-500 text-right font-medium">Optimized by +15% today</p>
        </div>

      </div>
    </div>
  );
};

export default AIPredictionPanel;
