import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const notifications = [
  { id: 1, type: 'warning', title: 'Delay Alert', message: 'Dr. John is running 15 mins behind schedule.', time: 'Just now' },
  { id: 2, type: 'info', title: 'New Booking', message: 'Emergency case added to Queue #2.', time: '5m ago' },
  { id: 3, type: 'success', title: 'System Updated', message: 'AI prediction model synced successfully.', time: '1h ago' },
];

const NotificationPanel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-panel p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
        </div>
        <button className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
           Clear all
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((note, idx) => {
          let Icon = Info;
          let iconColor = 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-900/50';

          if (note.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-500 dark:bg-amber-500/20 dark:border-amber-500/30';
          } else if (note.type === 'success') {
            Icon = CheckCircle;
            iconColor = 'text-primary bg-primary/10 border-primary/20';
          }

          return (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              whileHover={{ scale: 1.01 }}
              className="flex gap-4 p-3.5 rounded-xl bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all group cursor-default shadow-sm dark:shadow-none"
            >
              <div className={`p-2 rounded-lg h-min border ${iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{note.title}</h4>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0 mt-0.5">{note.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug pr-1">{note.message}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
};

export default NotificationPanel;
