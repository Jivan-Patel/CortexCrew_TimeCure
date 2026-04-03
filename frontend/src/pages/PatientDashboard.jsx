import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Clock, Users, CheckCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

// The mocked "logged in patient" – in production this would come from auth
const MY_PATIENT_ID = 3; // Olivia Brown

const statusLabel = {
  waiting:     { label: 'Waiting', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  arrived:     { label: 'Arrived', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'in-progress': { label: 'In Consultation', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  done:        { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
  'no-show':   { label: 'Missed', color: 'bg-red-100 text-red-700 border-red-200' },
};

const PatientDashboard = () => {
  const { queue } = useQueue();
  const navigate = useNavigate();

  const myPatient = queue.find(p => p.id === MY_PATIENT_ID);
  const myPosition = queue.filter(p => p.status !== 'no-show' && p.status !== 'done').findIndex(p => p.id === MY_PATIENT_ID);

  // Sanitised public list (hide other patients' medical/risk data)
  const publicQueue = queue
    .filter(p => p.status !== 'done' && p.status !== 'no-show')
    .map((p, i) => ({
      position: i + 1,
      isMe: p.id === MY_PATIENT_ID,
      status: p.status,
      name: p.id === MY_PATIENT_ID ? p.name : `Patient #${i + 1}`,
      waitTime: p.waitTime,
    }));

  const st = myPatient ? statusLabel[myPatient.status] || statusLabel['waiting'] : statusLabel['waiting'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* TOP BAR */}
      <nav className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9" />
            <span className="font-bold text-slate-800 text-lg">TimeCure <span className="font-normal text-slate-400">/ Patient Portal</span></span>
          </div>
          <button onClick={() => navigate('/login')} className="btn-outline text-xs h-9 px-4 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* MY STATUS HERO */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-2xl" />

          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Your Queue Status</p>

          {!myPatient ? (
            <p className="text-slate-500 text-lg">Your appointment is not in the queue yet.</p>
          ) : myPatient.status === 'done' ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h2 className="text-3xl font-extrabold text-slate-900">Consultation Complete</h2>
              <p className="text-slate-500">Thank you for visiting! We hope you feel better soon.</p>
            </div>
          ) : myPatient.status === 'in-progress' ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-indigo-300 flex items-center justify-center">
                <span className="text-3xl">🩺</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">You're with the Doctor</h2>
              <p className="text-slate-500">Your consultation is currently in progress.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2 mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
                  <span className="text-4xl font-extrabold text-primary">
                    {myPosition === -1 ? '–' : myPosition + 1}
                  </span>
                </div>
                <p className="text-lg text-slate-500 font-medium">Your position in line</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                <div className="bg-slate-50 rounded-xl border border-border p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Est. Wait</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {myPatient.waitTime}<span className="text-base text-slate-500 font-normal ml-1">min</span>
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-border p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Duration</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {myPatient.predictedTime}<span className="text-base text-slate-500 font-normal ml-1">min</span>
                  </p>
                </div>
              </div>

              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${st.color}`}>
                {st.label}
              </span>

              {!myPatient.sms_received && myPatient.sms_strategy !== 'low_risk' && (
                <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
                  📱 An SMS reminder may be sent to you shortly to confirm your appointment.
                </div>
              )}
            </>
          )}
        </div>

        {/* PUBLIC QUEUE VIEW */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg"><Users className="w-5 h-5 text-primary" /></div>
            <div>
              <h3 className="font-bold text-slate-900">Waiting Room Queue</h3>
              <p className="text-xs text-slate-500">Live order • Patient details are private</p>
            </div>
          </div>

          <div className="space-y-2">
            {publicQueue.length === 0 && (
              <p className="text-center py-8 text-slate-400 text-sm">The queue is currently empty.</p>
            )}
            {publicQueue.map(p => (
              <div key={p.position}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                  ${p.isMe ? 'bg-primary/5 border-primary/30' : 'bg-slate-50 border-border'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0
                  ${p.isMe ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {p.position}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${p.isMe ? 'text-primary' : 'text-slate-700'}`}>
                    {p.name} {p.isMe && <span className="text-xs font-medium text-primary/70">(You)</span>}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.status === 'in-progress' ? 'Currently in consultation' : `Est. wait: ${p.waitTime}m`}
                  </p>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border
                  ${statusLabel[p.status]?.color || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {statusLabel[p.status]?.label || p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🧠', title: 'ML-Predicted Times', desc: 'Wait times are dynamically calculated using AI models trained on 110k+ appointments.' },
            { icon: '📱', title: 'SMS Reminders', desc: 'High-risk patients receive automated SMS reminders to reduce no-shows.' },
            { icon: '🔄', title: 'Real-Time Updates', desc: 'Queue positions update after every consultation ends automatically.' },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-xl border border-border p-5">
              <span className="text-2xl">{c.icon}</span>
              <h4 className="font-bold text-slate-800 mt-3 mb-1 text-sm">{c.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
