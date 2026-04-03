import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, CheckCircle2, Stethoscope, AlertTriangle, Clock, RefreshCw, ArrowRight } from 'lucide-react';

const SYMPTOMS = [
  { name: 'Fever / High Temperature', urgency: 'medium', mins: 15, specialty: 'General Physician' },
  { name: 'Chest Pain', urgency: 'high', mins: 5, specialty: 'Emergency / Cardiology' },
  { name: 'Shortness of Breath', urgency: 'high', mins: 5, specialty: 'Emergency / Pulmonology' },
  { name: 'Headache / Migraine', urgency: 'medium', mins: 20, specialty: 'Neurology' },
  { name: 'Nausea / Vomiting', urgency: 'low', mins: 12, specialty: 'General Physician' },
  { name: 'Fatigue / Weakness', urgency: 'low', mins: 18, specialty: 'General Physician' },
  { name: 'Joint / Muscle Pain', urgency: 'medium', mins: 22, specialty: 'Orthopedics' },
  { name: 'Skin Rash', urgency: 'low', mins: 15, specialty: 'Dermatology' },
  { name: 'Abdominal Pain', urgency: 'medium', mins: 20, specialty: 'Gastroenterology' },
  { name: 'Dizziness / Vertigo', urgency: 'medium', mins: 18, specialty: 'Neurology' },
  { name: 'Back Pain', urgency: 'low', mins: 20, specialty: 'Orthopedics' },
  { name: 'Sore Throat', urgency: 'low', mins: 10, specialty: 'ENT / General Physician' },
];

const URGENCY = {
  high:   { label: 'High', color: 'var(--red)', bg: 'var(--red-dim)', text: 'Seek immediate care' },
  medium: { label: 'Medium', color: '#f0a500', bg: 'rgba(240,165,0,0.12)', text: 'Schedule visit soon' },
  low:    { label: 'Low', color: 'var(--green)', bg: 'var(--green-dim)', text: 'Schedule at convenience' },
};

function getResult(selected) {
  if (!selected.length) return null;
  const items = selected.map(n => SYMPTOMS.find(s => s.name === n));
  const high = items.find(s => s.urgency === 'high');
  const med  = items.find(s => s.urgency === 'medium');
  const worst = high || med || items[0];
  const totalMins = Math.max(...items.map(s => s.mins)) + (items.length - 1) * 4;
  return { urgency: worst.urgency, specialty: worst.specialty, totalMins };
}

export default function SymptomsCheck() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  const toggle = (n) => {
    setSelected(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);
    setResult(null);
  };
  const check = () => setResult(getResult(selected));
  const reset = () => { setSelected([]); setResult(null); };

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="label-caps">AI-Assisted</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 4 }}>Symptom Checker</h1>
        <p style={{ color: 'var(--text-sec)', fontSize: 13, marginTop: 4 }}>Select your symptoms to get an estimated consultation time and specialist recommendation.</p>
      </div>

      {/* Symptom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.625rem', marginBottom: '1.5rem' }}>
        {SYMPTOMS.map(s => {
          const sel = selected.includes(s.name);
          const u = URGENCY[s.urgency];
          return (
            <motion.button key={s.name} whileTap={{ scale: 0.96 }} onClick={() => toggle(s.name)} style={{
              padding: '12px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid', fontFamily: 'inherit',
              background: sel ? u.bg : 'var(--surface)',
              borderColor: sel ? u.color + '60' : 'var(--border)',
              color: sel ? u.color : 'var(--text-sec)',
              boxShadow: sel ? `0 0 0 2px ${u.color}20` : 'none',
              transition: 'all 0.15s',
            }}>
              {sel ? <CheckCircle2 size={15} style={{ flexShrink: 0 }} /> : <Thermometer size={15} style={{ flexShrink: 0, opacity: 0.5 }} />}
              {s.name}
            </motion.button>
          );
        })}
      </div>

      {/* Action row */}
      {selected.length > 0 && !result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '0.875rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>
            <strong style={{ color: 'var(--green)' }}>{selected.length}</strong> symptom{selected.length > 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={reset}>Clear</button>
            <button className="btn btn-green" onClick={check}><Stethoscope size={14} /> Analyze</button>
          </div>
        </motion.div>
      )}

      {/* Result card */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="card" style={{ border: `1px solid ${URGENCY[result.urgency].color}40`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: `radial-gradient(ellipse at right, ${URGENCY[result.urgency].color}08 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <p className="label-caps">Your Report</p>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>Consultation Estimate</h2>
              </div>
              <button className="btn btn-outline" onClick={reset} style={{ flexShrink: 0 }}><RefreshCw size={13} /> Reset</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
              {/* Time */}
              <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '1.25rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                  <Clock size={14} style={{ color: 'var(--red)' }} />
                  <span className="label-caps">Time Needed</span>
                </div>
                <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--red)' }}>{result.totalMins}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 4 }}>minutes estimated</div>
              </div>
              {/* Urgency */}
              <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '1.25rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                  <AlertTriangle size={14} style={{ color: URGENCY[result.urgency].color }} />
                  <span className="label-caps">Urgency</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: URGENCY[result.urgency].color }}>{URGENCY[result.urgency].label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 4 }}>{URGENCY[result.urgency].text}</div>
              </div>
              {/* Specialty */}
              <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '1.25rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                  <Stethoscope size={14} style={{ color: 'var(--green)' }} />
                  <span className="label-caps">Recommended</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', lineHeight: 1.4 }}>{result.specialty}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 4 }}>specialist</div>
              </div>
            </div>

            {/* Selected symptoms */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <p className="label-caps" style={{ marginBottom: 8 }}>Reported Symptoms</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.map(s => <span key={s} className="badge badge-muted">{s}</span>)}
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--red-dim)', borderRadius: 8, border: '1px solid rgba(248,81,73,0.2)', fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.6 }}>
              ⚠️ <strong style={{ color: 'var(--text)' }}>Disclaimer:</strong> This is a simulated estimate. Always consult a qualified medical professional for actual diagnosis and treatment.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
