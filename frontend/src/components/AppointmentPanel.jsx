import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel p-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Schedule Appointment</h3>
          <p className="text-sm text-slate-400">Dr. Sarah Connor's Calendar</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 glass-panel rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 glass-panel rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
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
                  ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105' 
                  : 'border-glass-border bg-slate-800/30 text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span className="text-xs uppercase font-medium mb-1">{day.name}</span>
              <span className={`text-xl font-bold ${isActive ? 'text-white' : ''}`}>{day.date}</span>
              {isActive && <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>}
            </button>
          )
        })}
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-y-auto pr-2 mb-6 pointer-events-auto">
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlot === slot;
            
            return (
              <motion.button
                key={slot}
                whileHover={!isBooked ? { scale: 1.05 } : {}}
                whileTap={!isBooked ? { scale: 0.95 } : {}}
                onClick={() => !isBooked && setSelectedSlot(slot)}
                disabled={isBooked}
                className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors border ${
                  isBooked 
                    ? 'opacity-50 cursor-not-allowed bg-slate-800/30 border-glass-border text-slate-500' 
                    : isSelected
                      ? 'bg-gradient-to-r from-neon-blue to-primary border-transparent text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                      : 'bg-slate-800/50 border-glass-border text-slate-300 hover:border-primary/50 hover:bg-slate-800'
                }`}
              >
                <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : (isBooked ? 'text-slate-600' : 'text-primary')}`} />
                <span className="text-sm font-medium">{slot}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg mt-auto"
      >
        <Calendar className="w-5 h-5" />
        Book Appointment
      </motion.button>
    </motion.div>
  );
};

export default AppointmentPanel;
