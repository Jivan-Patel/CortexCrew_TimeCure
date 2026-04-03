import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

const WalkInModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name) onAdd({ name });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative transform transition-all">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5"/></button>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Register Walk-In Patient</h3>
        <p className="text-sm text-slate-500 mb-6">Patient will bypass extensive ML predictions and insert near start of queue according to standard hospital rules.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Patient Full Name</label>
              <input 
                autoFocus 
                type="text" 
                className="glass-input" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="e.g. Jane Doe"
              />
           </div>
           <button type="submit" className="btn-primary w-full mt-4 h-11"><UserPlus className="w-4 h-4"/> Add Directly to Queue</button>
        </form>
      </div>
    </div>
  );
};
export default WalkInModal;
