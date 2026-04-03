import React, { useState } from 'react';
import { BrainCircuit, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const AppointmentPanel = () => {
  const { bookPatient, isPredicting } = useQueue();
  const [form, setForm] = useState({ name: '', age: '', gender: 0, hypertension: false, diabetes: false, alcoholism: false, scholarship: false });
  const [prediction, setPrediction] = useState(null);
  const [confirming, setConfirming] = useState(false);

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
