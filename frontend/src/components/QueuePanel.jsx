import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Activity, User } from 'lucide-react';

const queueData = [
  { id: 1, name: 'Emma Watson', time: '10:00 AM', status: 'In Consultation', doc: 'Dr. Sarah', progress: 65, waitTime: '0 mins' },
  { id: 2, name: 'James Smith', time: '10:30 AM', status: 'Waiting', doc: 'Dr. Sarah', progress: 100, waitTime: '12 mins' },
  { id: 3, name: 'Olivia Brown', time: '11:00 AM', status: 'Waiting', doc: 'Dr. John', progress: 100, waitTime: '45 mins' },
  { id: 4, name: 'William Jones', time: '09:30 AM', status: 'Completed', doc: 'Dr. Emily', progress: 100, waitTime: '0 mins' },
];

const QueuePanel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel p-6 flex flex-col h-full overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Real-time Queue</h3>
        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold">12 Waiting</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {queueData.map((patient, idx) => {
          
          let statusColor = '';
          let StatusIcon = Clock;
          let ringColor = '';
          
          if (patient.status === 'In Consultation') {
            statusColor = 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-900/50';
            ringColor = 'ring-1 ring-blue-500/50 dark:ring-blue-400/50';
            StatusIcon = Activity;
          } else if (patient.status === 'Waiting') {
            statusColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-500 dark:bg-amber-500/20 dark:border-amber-500/30';
            StatusIcon = Clock;
          } else {
            statusColor = 'text-primary bg-primary/10 border-primary/20';
            StatusIcon = CheckCircle2;
          }

          return (
            <motion.div 
              key={patient.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className={`p-4 rounded-xl border bg-white dark:bg-slate-800/40 relative overflow-hidden group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${patient.status === 'In Consultation' ? ringColor : 'border-slate-200 dark:border-slate-700'}`}
            >
              <div className="flex items-center justify-between mb-3 relative z-10 w-full">
                <div className="flex items-center gap-3 pr-2 overflow-hidden w-[60%]">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="text-slate-500 dark:text-slate-400 w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{patient.name}</h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 truncate">w/ {patient.doc} • {patient.time}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0 ${statusColor}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-xs font-semibold">{patient.status}</span>
                </div>
              </div>

              {/* Progress bar for Consultation */}
              {patient.status === 'In Consultation' && (
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden relative z-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${patient.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-blue-500 rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
              )}

              {/* Wait time indicator */}
              {patient.status === 'Waiting' && (
                <p className="text-xs text-amber-600 dark:text-amber-500/80 mt-2 text-right relative z-10 font-medium">
                  Est. Wait: {patient.waitTime}
                </p>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
};

export default QueuePanel;
