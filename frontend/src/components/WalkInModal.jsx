import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const WalkInModal = ({ onClose }) => {
  const { addWalkIn } = useQueue();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    await addWalkIn(name, parseInt(age) || 30);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Walk-In Patient</h3>
        <p className="text-sm text-slate-500 mb-6">Patient will be inserted near the start of queue. ML will estimate their no-show risk.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 block">Full Name</label>
            <input autoFocus required type="text" value={name} onChange={e => setName(e.target.value)}
              className="glass-input" placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 block">Age</label>
            <input type="number" min="1" max="120" value={age} onChange={e => setAge(e.target.value)}
              className="glass-input" placeholder="e.g. 35" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full h-11">
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Running ML + Adding...</>
              : <><UserPlus className="w-4 h-4" /> Add to Queue</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalkInModal;
