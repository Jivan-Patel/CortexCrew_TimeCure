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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel p-6 flex flex-col h-full overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Real-time Queue</h3>
        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">12 Waiting</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {queueData.map((patient, idx) => {
          
          let statusColor = '';
          let StatusIcon = Clock;
          
          if (patient.status === 'In Consultation') {
            statusColor = 'text-neon-blue bg-neon-blue/20';
            StatusIcon = Activity;
          } else if (patient.status === 'Waiting') {
            statusColor = 'text-amber-500 bg-amber-500/20';
            StatusIcon = Clock;
          } else {
            statusColor = 'text-primary bg-primary/20';
            StatusIcon = CheckCircle2;
          }

          return (
            <motion.div 
              key={patient.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
              className={`p-4 rounded-xl border border-glass-border bg-slate-800/40 relative overflow-hidden group ${patient.status === 'In Consultation' ? 'ring-1 ring-neon-blue/50' : ''}`}
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="text-slate-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{patient.name}</h4>
                    <p className="text-xs text-slate-400">with {patient.doc} • {patient.time}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusColor}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{patient.status}</span>
                </div>
              </div>

              {/* Progress bar for Consultation */}
              {patient.status === 'In Consultation' && (
                <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden relative z-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${patient.progress}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-neon-blue to-primary rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
              )}

              {/* Wait time indicator */}
              {patient.status === 'Waiting' && (
                <p className="text-xs text-amber-500/80 mt-2 text-right relative z-10">
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
