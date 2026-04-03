import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const days = [
  { name: 'Mon', date: '12' },
  { name: 'Tue', date: '13' },
  { name: 'Wed', date: '14' },
  { name: 'Thu', date: '15' },
  { name: 'Fri', date: '16' },
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const bookedSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

const AppointmentPanel = () => {
  const [activeDate, setActiveDate] = useState('14');
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel p-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Schedule Appointment</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Dr. Sarah Connor's Calendar</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-slate-200 dark:border-glass-border-dark rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 border border-slate-200 dark:border-glass-border-dark rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days row */}
      <div className="flex justify-between gap-2 mb-6">
        {days.map((day) => {
          const isActive = day.date === activeDate;
          return (
            <button
              key={day.date}
              onClick={() => setActiveDate(day.date)}
              className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-300 border ${
                isActive 
                  ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(13,148,136,0.1)] scale-105' 
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xs uppercase font-medium mb-1">{day.name}</span>
              <span className={`text-xl font-bold ${isActive ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{day.date}</span>
              {isActive && <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>}
            </button>
          )
        })}
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6 pointer-events-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlot === slot;
            
            return (
              <motion.button
                key={slot}
                whileHover={!isBooked ? { scale: 1.03 } : {}}
                whileTap={!isBooked ? { scale: 0.98 } : {}}
                onClick={() => !isBooked && setSelectedSlot(slot)}
                disabled={isBooked}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border shadow-sm ${
                  isBooked 
                    ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500' 
                    : isSelected
                      ? 'bg-primary border-primary text-white shadow-md'
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : (isBooked ? 'text-slate-400 dark:text-slate-600' : 'text-primary')}`} />
                <span className="text-sm font-medium">{slot}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-[15px] mt-auto"
      >
        <Calendar className="w-5 h-5" />
        Book Appointment
      </motion.button>
    </motion.div>
  );
};

export default AppointmentPanel;
