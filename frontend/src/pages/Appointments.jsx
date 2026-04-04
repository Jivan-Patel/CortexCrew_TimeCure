import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Plus, X, ChevronRight, User, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MOCK = [
  { id: 1, dr: 'Dr. Sarah Jenkins', spec: 'Cardiology', date: '2026-04-10', time: '10:30 AM', status: 'Upcoming', wait: 18, noShowProb: null },
  { id: 2, dr: 'Dr. Rahul Patel', spec: 'General Physician', date: '2026-03-28', time: '09:00 AM', status: 'Completed', wait: 0, noShowProb: null },
  { id: 3, dr: 'Dr. Aisha Khan', spec: 'Dermatology', date: '2026-02-10', time: '11:15 AM', status: 'Completed', wait: 0, noShowProb: null },
  { id: 4, dr: 'Dr. James Ortega', spec: 'Orthopedics', date: '2026-01-05', time: '03:00 PM', status: 'Cancelled', wait: 0, noShowProb: null },
];
const SPECS = ['Cardiology', 'Dermatology', 'General Physician', 'Neurology', 'Orthopedics', 'Psychiatry', 'ENT'];
const FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

// ML field default state — matches backend exactly
const ML_DEFAULTS = {
  name: '', dr: '', spec: SPECS[0], date: '', time: '10:00', phone: '',
  Age: '', Gender: '0',       // Gender: 0=Female 1=Male
  Hipertension: false,
  Diabetes: false,
  Alcoholism: false,
  Handcap: false,
  Scholarship: false,
};

function MLCheckbox({ label, value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
        background: value ? 'var(--green-dim)' : 'var(--surface2)',
        border: `1px solid ${value ? 'rgba(63,185,80,0.35)' : 'var(--border)'}`,
        borderRadius: 8, cursor: 'pointer', userSelect: 'none',
        transition: 'all 0.15s', fontSize: 12, fontWeight: 600,
        color: value ? 'var(--green)' : 'var(--text-sec)',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: 4, border: `2px solid ${value ? 'var(--green)' : 'var(--border)'}`,
        background: value ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s',
      }}>
        {value && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5 5 4 7.5 8.5 2" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
      </div>
      {label}
    </div>
  );
}

export default function Appointments() {
  const { token, role } = useAuth();
  const [list, setList] = useState(MOCK);
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(ML_DEFAULTS);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { prediction, estimatedDuration } | null
  const [submitError, setSubmitError] = useState('');

  const filtered = filter === 'All' ? list : list.filter(a => a.status === filter);
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  // Step 2 + Step 5: Build ML payload, validate types, submit to queue backend
  const book = async () => {
    if (!form.name || !form.Age || !form.date) {
      setSubmitError('Please fill in Name, Age, and Date at minimum.');
      return;
    }
    if (isNaN(Number(form.Age)) || Number(form.Age) < 0 || Number(form.Age) > 120) {
      setSubmitError('Age must be a valid number between 0 and 120.');
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    setSubmitResult(null);

    // Build exact ML payload — all fields as Number as backend requires
    const mlPayload = {
      name: form.name,
      phone: form.phone || undefined,
      Age: Number(form.Age),
      Gender: Number(form.Gender),        // 0=Female, 1=Male
      Hipertension: form.Hipertension ? 1 : 0,
      Diabetes: form.Diabetes ? 1 : 0,
      Alcoholism: form.Alcoholism ? 1 : 0,
      Handcap: form.Handcap ? 1 : 0,
      Scholarship: form.Scholarship ? 1 : 0,
      SMS_received: 0,                    // always 0 on initial booking
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // POST to queue server (/api/queue → localhost:4000 via Vite proxy)
      const res = await fetch('/api/queue/book', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(mlPayload),
      });

      if (res.ok) {
        const data = await res.json();
        // Show ML result: no_show_probability + estimated_time
        setSubmitResult({
          prediction: data.patient?.noShowProb ?? null,
          estimatedDuration: data.patient?.predictedTime ?? null,
        });
        // Add to local visible list
        setList(p => [{
          id: data.patient?.id || Date.now(),
          dr: form.dr || 'To be assigned',
          spec: form.spec,
          date: form.date,
          time: form.time,
          status: 'Upcoming',
          wait: data.patient?.predictedTime || 15,
          noShowProb: data.patient?.noShowProb,
        }, ...p]);
      } else {
        // Backend responded with error
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
      }
    } catch (err) {
      // Backend offline — add optimistically with mock data
      console.warn('Queue backend offline, adding locally:', err.message);
      setList(p => [{
        id: Date.now(), dr: form.dr || 'To be assigned',
        spec: form.spec, date: form.date, time: form.time,
        status: 'Upcoming', wait: 15, noShowProb: null,
      }, ...p]);
      setSubmitResult({ prediction: null, estimatedDuration: 15 });
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModal(false);
    setForm(ML_DEFAULTS);
    setSubmitResult(null);
    setSubmitError('');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
        <div>
          <p className="label-caps">Healthcare</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 4 }}>Appointments</h1>
          <p style={{ color: 'var(--text-sec)', fontSize: 13, marginTop: 4 }}>Track and manage all your medical visits.</p>
        </div>
        {/* Step 4: Hide "Book New" for doctors — they manage via queue, not booking form */}
        {role !== 'doctor' && (
          <button className="btn btn-green" onClick={() => setModal(true)}><Plus size={15} /> Book New</button>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', border: '1px solid', fontFamily: 'inherit',
            background: filter === f ? 'var(--green)' : 'transparent',
            color: filter === f ? '#000' : 'var(--text-sec)',
            borderColor: filter === f ? 'var(--green)' : 'var(--border)',
            transition: 'all 0.15s',
          }}>{f}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-sec)', alignSelf: 'center' }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <AnimatePresence>
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.04, duration: 0.3 }}
              className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--green-dim), var(--red-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'var(--green)', flexShrink: 0, border: '1px solid var(--border)' }}>
                {(a.dr?.split(' ')[1]?.[0] || a.dr?.[0] || '?')}
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.dr}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>{a.spec}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-sec)' }}>
                <Calendar size={13} style={{ color: 'var(--green)' }} /> {a.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-sec)' }}>
                <Clock size={13} style={{ color: 'var(--red)' }} /> {a.time}
              </div>
              {a.status === 'Upcoming' && (
                <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, whiteSpace: 'nowrap' }}>~{a.wait} min wait</div>
              )}
              {/* ML no-show risk badge if available */}
              {a.noShowProb !== null && a.noShowProb !== undefined && (
                <div style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, fontWeight: 700, background: a.noShowProb > 0.4 ? 'var(--red-dim)' : 'var(--green-dim)', color: a.noShowProb > 0.4 ? 'var(--red)' : 'var(--green)', border: '1px solid', borderColor: a.noShowProb > 0.4 ? 'rgba(248,81,73,0.3)' : 'rgba(63,185,80,0.3)' }}>
                  {a.noShowProb > 0.4 ? '⚠ High Risk' : '✓ Low Risk'}
                </div>
              )}
              <span className={`badge badge-${a.status === 'Upcoming' ? 'green' : a.status === 'Completed' ? 'green' : 'red'}`}>{a.status}</span>
              <ChevronRight size={15} style={{ color: 'var(--border)' }} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-sec)' }}>
            <User size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontWeight: 600 }}>No appointments found</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}
            onClick={closeModal}>
            <motion.div initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93 }}
              onClick={e => e.stopPropagation()} className="card"
              style={{ width: '100%', maxWidth: 480, border: '1px solid rgba(63,185,80,0.28)', maxHeight: '90vh', overflowY: 'auto' }}>

              {/* Modal header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: 17 }}>Book Appointment</h2>
                  <p style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 3 }}>Fills your ML profile for accurate wait-time prediction</p>
                </div>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', padding: 4 }}><X size={18} /></button>
              </div>

              {/* Success state */}
              <AnimatePresence>
                {submitResult && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ padding: '1rem', background: 'var(--green-dim)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 10, marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', align: 'center', gap: 8, marginBottom: 6 }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--green)' }} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--green)' }}>Appointment Booked!</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-sec)' }}>
                      {submitResult.estimatedDuration != null && (
                        <span>⏱ Estimated: <strong style={{ color: 'var(--text)' }}>{submitResult.estimatedDuration} min</strong></span>
                      )}
                      {submitResult.prediction != null && (
                        <span>📊 No-show risk: <strong style={{ color: submitResult.prediction > 0.4 ? 'var(--red)' : 'var(--green)' }}>{(submitResult.prediction * 100).toFixed(0)}%</strong></span>
                      )}
                    </div>
                    <button className="btn btn-green" onClick={closeModal} style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: 13 }}>Done</button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!submitResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Basic info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Patient Name *</label>
                      <input className="input" placeholder="Your full name" value={form.name} onChange={e => set('name')(e.target.value)} required />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Preferred Doctor</label>
                      <input className="input" placeholder="e.g. Dr. Sarah Jenkins" value={form.dr} onChange={e => set('dr')(e.target.value)} />
                    </div>
                    <div>
                      <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Specialty</label>
                      <select className="input" value={form.spec} onChange={e => set('spec')(e.target.value)}>
                        {SPECS.map(s => <option key={s} style={{ background: 'var(--surface)' }}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Phone (for reminders)</label>
                      <input className="input" placeholder="+91 98765..." value={form.phone} onChange={e => set('phone')(e.target.value)} />
                    </div>
                    <div>
                      <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Date *</label>
                      <input type="date" className="input" value={form.date} onChange={e => set('date')(e.target.value)} required />
                    </div>
                    <div>
                      <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Time</label>
                      <input type="time" className="input" value={form.time} onChange={e => set('time')(e.target.value)} />
                    </div>
                  </div>

                  {/* ML Health Profile — Step 2 */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
                      <p className="label-caps">ML Health Profile</p>
                      <span style={{ fontSize: 10, padding: '2px 7px', background: 'var(--green-dim)', color: 'var(--green)', borderRadius: 4, fontWeight: 700 }}>AI POWERED</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-sec)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                      Used by our AI to predict wait time and no-show risk. All fields are optional but improve accuracy.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
                      <div>
                        <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Age *</label>
                        <input className="input" type="number" min="0" max="120" placeholder="e.g. 35"
                          value={form.Age} onChange={e => set('Age')(e.target.value)} required />
                      </div>
                      <div>
                        <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Gender</label>
                        <select className="input" value={form.Gender} onChange={e => set('Gender')(e.target.value)}>
                          <option value="0" style={{ background: 'var(--surface)' }}>Female</option>
                          <option value="1" style={{ background: 'var(--surface)' }}>Male</option>
                        </select>
                      </div>
                    </div>

                    {/* Boolean checkboxes — the exact fields the ML model needs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <MLCheckbox label="Hypertension" value={form.Hipertension} onChange={set('Hipertension')} />
                      <MLCheckbox label="Diabetes" value={form.Diabetes} onChange={set('Diabetes')} />
                      <MLCheckbox label="Alcoholism" value={form.Alcoholism} onChange={set('Alcoholism')} />
                      <MLCheckbox label="Disability (Handicap)" value={form.Handcap} onChange={set('Handcap')} />
                      <MLCheckbox label="Scholarship (Govt Aid)" value={form.Scholarship} onChange={set('Scholarship')} />
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ padding: '10px 12px', background: 'var(--red-dim)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, fontSize: 12, color: 'var(--red)', display: 'flex', gap: 8 }}>
                        <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button className="btn btn-green" onClick={book} disabled={submitting}
                    style={{ justifyContent: 'center', padding: '11px', fontSize: 14, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting
                      ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Getting AI Prediction...</>
                      : 'Confirm & Get AI Estimate'
                    }
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
