import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const notifications = [
  { id: 1, type: 'warning', title: 'Delay Alert', message: 'Dr. John is running 15 mins behind schedule.', time: 'Just now' },
  { id: 2, type: 'info', title: 'New Booking', message: 'Emergency case added to Queue #2.', time: '5m ago' },
  { id: 3, type: 'success', title: 'System Updated', message: 'AI prediction model synced successfully.', time: '1h ago' },
];

const NotificationPanel = () => {
  return (
    <div className="expert-panel p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-500" />
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        </div>
        <button className="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md border border-border font-medium">
           Clear all
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((note) => {
          let Icon = Info;
          let iconColor = 'text-blue-600 bg-blue-50 border-blue-200';

          if (note.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-600 bg-amber-50 border-amber-200';
          } else if (note.type === 'success') {
            Icon = CheckCircle;
            iconColor = 'text-primary bg-primary/10 border-primary/20';
          }

          return (
            <div 
              key={note.id}
              className="flex gap-4 p-3.5 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-default shadow-sm group"
            >
              <div className={`p-2 rounded-lg h-min border ${iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-800 truncate pr-2">{note.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-slate-500 whitespace-nowrap shrink-0 mt-0.5">{note.time}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-snug">{note.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default NotificationPanel;
