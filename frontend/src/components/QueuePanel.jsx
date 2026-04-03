import React from 'react';
import { Play, Check, X, Clock } from 'lucide-react';

const QueuePanel = ({ queue, onUpdateStatus }) => {
  
  // Filter out 'done' and 'no-show' from primary view or keep them? Keep them to show historical.
  
  return (
    <div className="expert-panel p-6 flex flex-col h-full min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-lg font-bold text-slate-900">Live Active Queue</h3>
           <p className="text-xs text-slate-500 font-medium">Real-time status synced with backend endpoints</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {queue.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No patients in queue.</p>}
        {queue.map((patient) => {
          
          let rowClass = "border-slate-200 bg-white";
          if (patient.status === 'in-progress') rowClass = "border-blue-300 bg-blue-50/50 shadow-sm";
          if (patient.status === 'no-show' || patient.status === 'done') rowClass = "border-slate-100 bg-slate-50 opacity-60";

          return (
            <div key={patient.id} className={`p-4 rounded-xl border flex flex-col gap-3 transition-all duration-300 ${rowClass}`}>
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                      ${patient.type === 'walk-in' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{patient.name}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {patient.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        Wait: <span className="text-slate-700">{patient.waitTime}m</span>
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        Dur: <span className="text-slate-700">{patient.predictedTime}m</span>
                      </span>
                      {patient.noShowProb > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${patient.noShowProb > 0.4 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                          No-Show Risk: {Math.round(patient.noShowProb * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border
                    ${patient.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      patient.status === 'arrived' ? 'bg-green-100 text-green-700 border-green-200' :
                      patient.status === 'no-show' || patient.status === 'done' ? 'bg-slate-200 text-slate-600 border-slate-300' :
                      'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                    {patient.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons purely for mockup flow matching Readme */}
              {(patient.status === 'waiting' || patient.status === 'arrived') && (
                <div className="flex gap-2 pt-2 border-t border-slate-100 mt-1">
                  <button onClick={() => onUpdateStatus(patient.id, 'in-progress')} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors">
                    <Play className="w-3 h-3" /> Start
                  </button>
                  <button onClick={() => onUpdateStatus(patient.id, 'late')} className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-md text-xs font-semibold transition-colors border border-slate-200">
                    <Clock className="w-3 h-3" /> Late
                  </button>
                  <button onClick={() => onUpdateStatus(patient.id, 'no-show')} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors ml-auto">
                    <X className="w-3 h-3" /> Mark No-Show
                  </button>
                </div>
              )}

              {patient.status === 'in-progress' && (
                <div className="flex gap-2 pt-2 border-t border-blue-100 mt-1">
                  <button onClick={() => onUpdateStatus(patient.id, 'done')} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white hover:bg-green-600 rounded-md text-xs font-semibold transition-colors">
                    <Check className="w-3 h-3" /> Conclude Consultation
                  </button>
                </div>
              )}

            </div>
          )
        })}
      </div>
    </div>
  );
};

export default QueuePanel;
