import React, { useState } from 'react';
import { BrainCircuit, UserPlus, CheckCircle } from 'lucide-react';

const AppointmentPanel = ({ onBook }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    hypertension: false,
    diabetes: false,
    sms: false
  });
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age) return;
    
    setIsPredicting(true);
    // Simulate ML API Call delay
    setTimeout(() => {
      const mockNoShow = (Math.random() * 0.4 + (formData.sms ? -0.1 : 0.1)).toFixed(2);
      const mockTime = Math.floor(Math.random() * 15) + (parseInt(formData.age) > 60 ? 15 : 10);
      
      setPrediction({ prob: Math.max(0, mockNoShow), time: mockTime });
      setIsPredicting(false);
    }, 1200);
  };

  const handleConfirm = () => {
    if (prediction) {
      onBook({
        name: formData.name,
        mockNoShow: parseFloat(prediction.prob),
        mockTime: prediction.time
      });
      setFormData({ name: '', age: '', hypertension: false, diabetes: false, sms: false });
      setPrediction(null);
    }
  };

  return (
    <div className="expert-panel p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">ML Predictive Booking</h3>
          <p className="text-xs text-slate-500">Injects features into Python API</p>
        </div>
      </div>

      {!prediction ? (
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Patient Name</label>
            <input type="text" className="glass-input" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Patient Age</label>
            <input type="number" className="glass-input" placeholder="e.g. 45" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required/>
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-700 mb-2 block">Clinical Indicators (Features)</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.hypertension} onChange={e => setFormData({...formData, hypertension: e.target.checked})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                Hypertension History
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.diabetes} onChange={e => setFormData({...formData, diabetes: e.target.checked})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                Diabetes Diagnosed
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.sms} onChange={e => setFormData({...formData, sms: e.target.checked})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                SMS Reminder Sent
              </label>
            </div>
          </div>

          <button type="submit" disabled={isPredicting} className="btn-primary w-full mt-4">
            {isPredicting ? "Running Model..." : "Predict & Review"}
          </button>
        </form>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 slide-in-bottom">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1">Prediction Ready</h4>
            <p className="text-sm text-slate-500">ML model estimation based on inputs.</p>
          </div>
          
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-around">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">No-Show Risk</p>
              <p className={`text-xl font-bold ${prediction.prob > 0.4 ? 'text-red-600' : 'text-primary'}`}>{Math.round(prediction.prob * 100)}%</p>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Est. Duration</p>
              <p className="text-xl font-bold text-slate-900">{prediction.time} <span className="text-sm text-slate-500 font-medium">min</span></p>
            </div>
          </div>

          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setPrediction(null)} className="btn-outline flex-1">Cancel</button>
            <button onClick={handleConfirm} className="btn-primary flex-1"><UserPlus className="w-4 h-4"/> Add to Queue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPanel;
