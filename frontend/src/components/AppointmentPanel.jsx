import React, { useState } from 'react';
import { BrainCircuit, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

<<<<<<< theme-refactor
const AppointmentPanel = () => {
  const { bookPatient, isPredicting } = useQueue();
  const [form, setForm] = useState({ name: '', age: '', gender: 0, hypertension: false, diabetes: false, alcoholism: false, scholarship: false });
=======
const AppointmentPanel = ({ onBook = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    Age: '',
    Gender: 0,
    Hipertension: 0,
    Diabetes: 0,
    Alcoholism: 0,
    Handcap: 0,
    Scholarship: 0,
    SMS_received: 0
  });
  const [isPredicting, setIsPredicting] = useState(false);
>>>>>>> main
  const [prediction, setPrediction] = useState(null);
  const [confirming, setConfirming] = useState(false);

<<<<<<< theme-refactor
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age) return;
    const result = await bookPatient({ ...form, _dryRun: true, age: parseInt(form.age) });
    setPrediction(result);
  };

  const handleConfirm = async () => {
    setConfirming(true);
    await bookPatient({ ...form, age: parseInt(form.age) });
    setConfirming(false);
    setPrediction(null);
    setForm({ name: '', age: '', gender: 0, hypertension: false, diabetes: false, alcoholism: false, scholarship: false });
  };

  const strategyConfig = {
    high_risk:   { label: 'High Risk', color: 'text-red-600 bg-red-50 border-red-200', sms: 'SMS sent 24h + 2h before' },
    medium_risk: { label: 'Medium Risk', color: 'text-amber-600 bg-amber-50 border-amber-200', sms: 'SMS sent 24h before' },
    low_risk:    { label: 'Low Risk', color: 'text-primary bg-primary/10 border-primary/20', sms: 'No SMS required' },
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.Age === '') return;
    
    setIsPredicting(true);
    try {
      const payload = {
        ...formData,
        Age: parseInt(formData.Age)
      };
      
      const response = await fetch('http://localhost:3000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPrediction({ prob: data.prediction, time: data.estimatedDuration || 15 });
      } else {
        console.error("Booking error:", data);
        alert(data.message || "Error generating prediction");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Backend service unreachable");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleConfirm = () => {
    if (prediction) {
      onBook({
        name: formData.name,
        mockNoShow: parseFloat(prediction.prob),
        mockTime: prediction.time
      });
      setFormData({
        name: '', Age: '', Gender: 0, Hipertension: 0, Diabetes: 0,
        Alcoholism: 0, Handcap: 0, Scholarship: 0, SMS_received: 0
      });
      setPrediction(null);
    }
>>>>>>> main
  };

  return (
    <div className="expert-panel p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg text-primary"><BrainCircuit className="w-5 h-5" /></div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Book Appointment</h3>
          <p className="text-xs text-slate-500">ML predicts no-show risk & duration</p>
        </div>
      </div>

      {!prediction ? (
        <form onSubmit={handlePredict} className="space-y-4 flex-1">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1 block">Patient Name</label>
            <input required className="glass-input" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
<<<<<<< theme-refactor

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1 block">Age</label>
              <input required type="number" min="1" max="120" className="glass-input" placeholder="e.g. 45" value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1 block">Gender</label>
              <select className="glass-input" value={form.gender} onChange={e => set('gender', parseInt(e.target.value))}>
                <option value={0}>Female</option>
                <option value={1}>Male</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Clinical Indicators</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'hypertension', label: 'Hypertension' },
                { key: 'diabetes', label: 'Diabetes' },
                { key: 'alcoholism', label: 'Alcoholism' },
                { key: 'scholarship', label: 'Gov. Welfare' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors text-sm text-slate-700">
                  <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary" />
                  {label}
                </label>
              ))}
=======
          
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Patient Age</label>
            <input type="number" className="glass-input" placeholder="e.g. 45" value={formData.Age} onChange={e => setFormData({...formData, Age: e.target.value})} required/>
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-700 mb-2 block">Clinical Indicators (Features)</label>
            <div className="space-y-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
              <label className="flex items-center justify-between text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <span>Gender (Female / Male)</span>
                <select className="bg-transparent border border-gray-300 rounded text-xs p-1" value={formData.Gender} onChange={e => setFormData({...formData, Gender: parseInt(e.target.value)})}>
                  <option value={0}>Female</option>
                  <option value={1}>Male</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.Hipertension === 1} onChange={e => setFormData({...formData, Hipertension: e.target.checked ? 1 : 0})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                Hypertension History
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.Diabetes === 1} onChange={e => setFormData({...formData, Diabetes: e.target.checked ? 1 : 0})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                Diabetes Diagnosed
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.Alcoholism === 1} onChange={e => setFormData({...formData, Alcoholism: e.target.checked ? 1 : 0})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                Alcoholism History
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.Handcap === 1} onChange={e => setFormData({...formData, Handcap: e.target.checked ? 1 : 0})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                Handicapped
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.Scholarship === 1} onChange={e => setFormData({...formData, Scholarship: e.target.checked ? 1 : 0})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                Bolsa Família (Scholarship)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 bg-subtle p-2 rounded-lg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={formData.SMS_received === 1} onChange={e => setFormData({...formData, SMS_received: e.target.checked ? 1 : 0})} className="rounded text-primary focus:ring-primary w-4 h-4"/>
                SMS Reminder Sent
              </label>
>>>>>>> main
            </div>
          </div>

          <button type="submit" disabled={isPredicting} className="btn-primary w-full h-11">
            {isPredicting ? <><Loader2 className="w-4 h-4 animate-spin" /> Running ML Model...</> : 'Predict & Review'}
          </button>
        </form>
      ) : (
        /* Prediction result card */
        <div className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            <div className="text-center py-3">
              <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
              <h4 className="font-bold text-slate-900">ML Prediction Ready</h4>
              <p className="text-xs text-slate-500">Source: {prediction.source === 'live' ? '🟢 Live Flask API' : '🟡 Offline Mock'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 font-medium mb-1">No-Show Risk</p>
                <p className={`text-2xl font-extrabold ${prediction.no_show_probability > 0.4 ? 'text-red-600' : 'text-primary'}`}>
                  {Math.round(prediction.no_show_probability * 100)}%
                </p>
              </div>
              <div className="bg-slate-50 border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 font-medium mb-1">Est. Duration</p>
                <p className="text-2xl font-extrabold text-slate-900">{prediction.estimated_time}<span className="text-base text-slate-500 font-normal"> min</span></p>
              </div>
            </div>

            {prediction.sms_strategy && (() => {
              const cfg = strategyConfig[prediction.sms_strategy];
              return (
                <div className={`p-3 rounded-xl border text-sm font-medium ${cfg.color}`}>
                  <p className="font-bold">📱 SMS Strategy: {cfg.label}</p>
                  <p className="text-xs mt-0.5 opacity-80">{cfg.sms}</p>
                </div>
              );
            })()}
          </div>

          <div className="flex gap-3 pt-4 mt-4 border-t border-border">
            <button onClick={() => setPrediction(null)} className="btn-outline flex-1">← Edit</button>
            <button onClick={handleConfirm} disabled={confirming} className="btn-primary flex-1">
              {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Add to Queue</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPanel;
