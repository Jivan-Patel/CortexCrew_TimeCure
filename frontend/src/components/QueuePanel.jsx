import React, { useState } from 'react';
import { Play, Check, X, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const STATUS_CONFIG = {
  waiting:     { label: 'Waiting',        pill: 'bg-amber-100 text-amber-700 border-amber-200' },
  arrived:     { label: 'Arrived',        pill: 'bg-blue-100  text-blue-700  border-blue-200'  },
  'in-progress':{ label: 'In Progress',   pill: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  done:        { label: 'Done',           pill: 'bg-green-100 text-green-700 border-green-200' },
  'no-show':   { label: 'No-Show',        pill: 'bg-red-100   text-red-700   border-red-200'  },
};

const SMS_CONFIG = {
  high_risk:   { label: '🔴 High Risk',   cls: 'text-red-600 bg-red-50 border-red-200' },
  medium_risk: { label: '🟡 Medium Risk', cls: 'text-amber-600 bg-amber-50 border-amber-200' },
  low_risk:    { label: '🟢 Low Risk',    cls: 'text-primary bg-primary/10 border-primary/20' },
};

const PatientRow = ({ patient, role }) => {
  const { updateStatus, sendSMS } = useQueue();
  const [smsLoading, setSmsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const sc = STATUS_CONFIG[patient.status] || STATUS_CONFIG.waiting;
  const smsCfg = SMS_CONFIG[patient.sms_strategy] || SMS_CONFIG.low_risk;
  const isActive = patient.status === 'waiting' || patient.status === 'arrived';
  const isInProgress = patient.status === 'in-progress';
  const isDone = patient.status === 'done' || patient.status === 'no-show';

  const handleSMS = async () => {
    setSmsLoading(true);
    await sendSMS(patient.id);
    setSmsLoading(false);
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden
      ${isInProgress ? 'border-indigo-300 bg-indigo-50/40 shadow-sm' : isDone ? 'border-slate-100 bg-slate-50/50 opacity-60' : 'border-border bg-white hover:border-slate-300'}`}>

      {/* Main Row */}
      <div className="flex items-center gap-3 p-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0
          ${patient.type === 'walk-in' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
          {patient.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
            <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
              {patient.type}
            </span>
            {!patient.sms_received && patient.sms_strategy !== 'low_risk' && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${smsCfg.cls}`}>
                {smsCfg.label}
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-0.5 text-xs text-slate-500 font-medium flex-wrap">
            <span>Wait: <strong className="text-slate-700">{patient.waitTime}m</strong></span>
            <span>Duration: <strong className="text-slate-700">{patient.predictedTime}m</strong></span>
            <span>No-show: <strong className={patient.noShowProb > 0.4 ? 'text-red-600' : 'text-slate-700'}>{Math.round(patient.noShowProb * 100)}%</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${sc.pill}`}>
            {sc.label}
          </span>
          {role === 'doctor' && !isDone && (
            <button onClick={() => setExpanded(e => !e)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Doctor Actions (expandable) */}
      {role === 'doctor' && expanded && !isDone && (
        <div className="px-4 pb-4 pt-0 flex flex-wrap gap-2 border-t border-border bg-slate-50">
          {isActive && (
            <>
              <button onClick={() => updateStatus(patient.id, 'in-progress')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                <Play className="w-3 h-3" /> Start Consultation
              </button>
              <button onClick={() => updateStatus(patient.id, 'late')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                <Clock className="w-3 h-3" /> Mark Late
              </button>
              <button onClick={() => updateStatus(patient.id, 'no-show')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors shadow-sm ml-auto">
                <X className="w-3 h-3" /> No-Show
              </button>
            </>
          )}
          {isInProgress && (
            <button onClick={() => updateStatus(patient.id, 'done')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white hover:bg-green-600 rounded-lg text-xs font-semibold transition-colors shadow-sm">
              <Check className="w-3 h-3" /> End Consultation
            </button>
          )}
          {!patient.sms_received && (patient.sms_strategy === 'high_risk' || patient.sms_strategy === 'medium_risk') && (
            <button onClick={handleSMS} disabled={smsLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-semibold transition-colors shadow-sm">
              <MessageSquare className="w-3 h-3" /> {smsLoading ? 'Sending...' : 'Send SMS Reminder'}
            </button>
          )}
          {patient.sms_received && (
            <span className="flex items-center gap-1 text-xs text-primary font-medium px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
              ✅ SMS Sent
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const QueuePanel = ({ role = 'doctor' }) => {
  const { queue } = useQueue();
  const active = queue.filter(p => p.status !== 'done' && p.status !== 'no-show');
  const history = queue.filter(p => p.status === 'done' || p.status === 'no-show');

  return (
    <div className="expert-panel p-6 flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Live Queue</h3>
          <p className="text-xs text-slate-500">Event-driven • Recalculates after every consultation</p>
        </div>
        <span className="text-xs bg-slate-100 border border-border rounded-full px-3 py-1 font-bold text-slate-600">
          {active.length} active
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {active.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">Queue is empty.</p>}
        {active.map(p => <PatientRow key={p.id} patient={p} role={role} />)}

        {history.length > 0 && (
          <>
            <div className="flex items-center gap-3 py-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">History</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            {history.map(p => <PatientRow key={p.id} patient={p} role={role} />)}
          </>
        )}
      </div>
    </div>
  );
};

export default QueuePanel;
