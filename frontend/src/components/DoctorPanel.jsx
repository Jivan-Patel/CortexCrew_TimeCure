import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, CheckCircle2, Clock, XCircle } from 'lucide-react';

const doctorsData = [
  { id: 1, name: 'Dr. Sarah Connor', spec: 'Cardiologist', status: 'Available' },
  { id: 2, name: 'Dr. John Smith', spec: 'Neurologist', status: 'Busy' },
  { id: 3, name: 'Dr. Emily Davis', spec: 'Pediatrician', status: 'Offline' },
];

const DoctorPanel = () => {
  const [doctors, setDoctors] = useState(doctorsData);

  const toggleStatus = (id) => {
    setDoctors(docs => docs.map(doc => {
      if (doc.id === id) {
        const statuses = ['Available', 'Busy', 'Offline'];
        const nextIdx = (statuses.indexOf(doc.status) + 1) % statuses.length;
        return { ...doc, status: statuses[nextIdx] };
      }
      return doc;
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-panel p-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Medical Staff</h3>
        <button className="text-xs text-primary hover:underline font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {doctors.map((doctor, idx) => {
          let statusConfig = {
            color: 'text-primary bg-primary/20 ring-1 ring-primary/30',
            dot: 'bg-primary',
            icon: CheckCircle2
          };

          if (doctor.status === 'Busy') {
            statusConfig = { color: 'text-amber-500 bg-amber-500/20 ring-1 ring-amber-500/30', dot: 'bg-amber-500', icon: Clock };
          } else if (doctor.status === 'Offline') {
            statusConfig = { color: 'text-slate-400 bg-slate-700/50 ring-1 ring-slate-600', dot: 'bg-slate-500', icon: XCircle };
          }

          const Icon = statusConfig.icon;

          return (
            <motion.div 
              key={doctor.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + (idx * 0.1) }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 transition-colors group border border-transparent hover:border-glass-border cursor-pointer" 
              onClick={() => toggleStatus(doctor.id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <Stethoscope className="text-slate-400 w-5 h-5 group-hover:text-primary transition-colors" />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${statusConfig.dot} transition-colors duration-300`}></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{doctor.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{doctor.spec}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.color} scale-90 transition-colors duration-300`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{doctor.status}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
};

export default DoctorPanel;
