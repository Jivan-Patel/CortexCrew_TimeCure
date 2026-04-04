import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Clock, LogOut, CheckCircle, BrainCircuit, ScanLine, Play, FastForward,
  UserMinus, Users, Timer, AlertTriangle, TrendingDown, Bell, Zap, BarChart3,
  Wifi, ChevronRight, ArrowRight, RefreshCw, MessageSquare, Check, X, PhoneCall,
  Eye, Calendar, Filter, Info, Stethoscope, Heart, Shield
} from 'lucide-react';
import { queueService } from '../services/api';

// ─── RISK HELPERS ─────────────────────────────────────────────────────────────
function getRisk(prob) {
  if (prob > 0.4) return { label: 'High', color: '#EF4444', bgClass: 'badge-high', icon: '🔴' };
  if (prob > 0.2) return { label: 'Medium', color: '#F59E0B', bgClass: 'badge-med', icon: '🟡' };
  return { label: 'Low', color: '#10B981', bgClass: 'badge-low', icon: '🟢' };
}

function getStatusStyle(status) {
  const map = {
    'waiting': 'status-waiting',
    'arrived': 'status-arrived',
    'in-progress': 'status-in-progress',
    'done': 'status-done',
    'no-show': 'status-no-show',
  };
  return map[status] || 'status-waiting';
}

function getInsight(prob) {
  if (prob > 0.4) return { text: 'High risk — send reminder now', color: '#EF4444', icon: Bell };
  if (prob > 0.2) return { text: 'Medium risk — 1 reminder recommended', color: '#F59E0B', icon: MessageSquare };
  return { text: 'Low risk — no SMS needed', color: '#10B981', icon: Check };
}

// ─── ANIMATED NUMBER ──────────────────────────────────────────────────────────
function AnimatedNum({ value, suffix = '' }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const diff = value - display;
    if (diff === 0) return;
    const steps = 20;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDisplay(Math.round(display + (diff * current) / steps));
      if (current >= steps) { setDisplay(value); clearInterval(interval); }
    }, 30);
    return () => clearInterval(interval);
  }, [value]);
  return <>{display}{suffix}</>;
}

// ─── TOP STAT CARD ─────────────────────────────────────────────────────────────
function StatCard({ label, value, suffix, icon: Icon, color, sub, gradient }) {
  return (
    <div className="stat-card" style={{ background: gradient }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none"
           style={{ background: `${color}20`, transform: 'translate(30%, -30%)' }} />
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
             style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-right mt-1">Today</div>
      </div>
      <div className="text-4xl font-black text-white mb-1 font-mono">
        <AnimatedNum value={value} suffix={suffix} />
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

// ─── STATUS FILTER CHIP ────────────────────────────────────────────────────────
function FilterChip({ label, count, color, active, onClick }) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-105"
      style={{
        background: active ? `${color}15` : 'rgba(255,255,255,0.02)',
        borderColor: active ? `${color}40` : 'rgba(255,255,255,0.06)',
        boxShadow: active ? `0 0 20px ${color}10` : 'none',
      }}>
      <span className="text-xl font-black" style={{ color: active ? color : '#64748b' }}>{count}</span>
      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: active ? color : '#475569' }}>{label}</span>
    </button>
  );
}

// ─── ACTIVE CONSULTATION CARD ──────────────────────────────────────────────────
function ActiveConsultationCard({ patient, onEnd }) {
  const risk = getRisk(patient.noShowProb || 0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!patient.startTime) return;
    const start = new Date(patient.startTime).getTime();
    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 60000)), 10000);
    setElapsed(Math.floor((Date.now() - start) / 60000));
    return () => clearInterval(tick);
  }, [patient.startTime]);

  return (
    <div className="active-consultation-card p-6 mb-6 anim-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" style={{ boxShadow: '0 0 10px rgba(99,102,241,0.8)' }} />
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Active Consultation</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Timer className="w-3.5 h-3.5" />
          {elapsed} min elapsed
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Patient */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                 style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
              {(patient.name || 'P')[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{patient.name || `Patient #${patient.id?.slice(-4)}`}</h3>
              <p className="text-sm text-slate-500">{patient.phone || 'No contact'}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Predicted</p>
              <p className="text-lg font-black text-white">{Math.round(patient.predictedTime || 0)}<span className="text-xs text-slate-500 ml-1">min</span></p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">No-Show %</p>
              <p className="text-lg font-black" style={{ color: risk.color }}>{((patient.noShowProb || 0) * 100).toFixed(0)}%</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Risk Level</p>
              <p className="text-lg font-black" style={{ color: risk.color }}>{risk.label}</p>
            </div>
          </div>
        </div>

        {/* End Consultation Button */}
        <div className="flex-shrink-0">
          <button onClick={() => onEnd(patient.id)}
            className="flex flex-col items-center gap-2 px-6 py-5 rounded-2xl border transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }}>
            <FastForward className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">End</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PATIENT QUEUE CARD ────────────────────────────────────────────────────────
function PatientCard({ patient, queueIndex, onAction, isDoc }) {
  const risk = getRisk(patient.noShowProb || 0);
  const insight = getInsight(patient.noShowProb || 0);
  const InsightIcon = insight.icon;

  return (
    <div className="glass-card p-5 transition-all duration-300 hover:scale-[1.01] group anim-fade-up"
         style={{ animationDelay: `${queueIndex * 60}ms`, opacity: 0 }}>
      <div className="flex items-start gap-4">
        {/* Avatar + Queue Number */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black"
               style={{ background: `${risk.color}20`, border: `1px solid ${risk.color}35`, color: risk.color }}>
            {(patient.name || 'P')[0].toUpperCase()}
          </div>
          <span className="text-[10px] font-black text-slate-700">#{queueIndex + 1}</span>
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-black text-slate-100 text-sm">{patient.name || `Patient #${(patient.id || patient._id || '').slice(-4)}`}</h4>
              <p className="text-xs text-slate-600">{patient.phone || 'No phone'}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`status-pill ${getStatusStyle(patient.status)}`}>{patient.status}</span>
              <span className={risk.bgClass}>{risk.label}</span>
            </div>
          </div>

          {/* Time Info Row */}
          <div className="grid grid-cols-3 gap-3 mt-3 mb-3">
            <div className="text-center rounded-xl py-2 px-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <p className="text-[9px] text-slate-600 uppercase tracking-widest">Consult Time</p>
              <p className="text-sm font-black text-neonGlow mt-0.5">{Math.round(patient.predictedTime || 0)}<span className="text-[9px] ml-1 text-slate-500">min</span></p>
            </div>
            <div className="text-center rounded-xl py-2 px-2" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
              <p className="text-[9px] text-slate-600 uppercase tracking-widest">Wait Time</p>
              <p className="text-sm font-black text-indigo-400 mt-0.5">{Math.round(patient.waitTime || 0)}<span className="text-[9px] ml-1 text-slate-500">min</span></p>
            </div>
            <div className="text-center rounded-xl py-2 px-2" style={{ background: `${risk.color}08`, border: `1px solid ${risk.color}20` }}>
              <p className="text-[9px] text-slate-600 uppercase tracking-widest">No-Show</p>
              <p className="text-sm font-black mt-0.5" style={{ color: risk.color }}>{((patient.noShowProb || 0) * 100).toFixed(0)}%</p>
            </div>
          </div>

          {/* Smart Insight */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
               style={{ background: `${insight.color}08`, border: `1px solid ${insight.color}20` }}>
            <InsightIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: insight.color }} />
            <p className="text-[11px] font-medium" style={{ color: insight.color }}>{insight.text}</p>
          </div>

          {/* Action Buttons (Doctor only) */}
          {isDoc && (
            <div className="flex gap-2 flex-wrap">
              {(patient.status === 'waiting' || patient.status === 'arrived') && (
                <>
                  <button onClick={() => onAction(patient.id, 'start')} className="btn-neon flex-1">
                    <Play className="w-3.5 h-3.5" />
                    Start
                  </button>
                  <button onClick={() => onAction(patient.id, 'noshow')} className="btn-danger flex-1">
                    <UserMinus className="w-3.5 h-3.5" />
                    No-Show
                  </button>
                  <button onClick={() => onAction(patient.id, 'late')} className="btn-warning flex-1">
                    <Clock className="w-3.5 h-3.5" />
                    Late
                  </button>
                </>
              )}
              {patient.status === 'in-progress' && (
                <button onClick={() => onAction(patient.id, 'end')} className="btn-danger w-full">
                  <FastForward className="w-3.5 h-3.5" />
                  End Consultation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPLETED PATIENT ROW ─────────────────────────────────────────────────────
function CompletedRow({ patient }) {
  const risk = getRisk(patient.noShowProb || 0);
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-white/[0.02]"
         style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
           style={{ background: patient.status === 'done' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: patient.status === 'done' ? '#34d399' : '#f87171' }}>
        {(patient.name || 'P')[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-300 truncate">{patient.name || `Patient #${(patient.id || '').slice(-4)}`}</p>
      </div>
      <span className={`status-pill ${getStatusStyle(patient.status)}`}>{patient.status}</span>
      <span className="text-xs text-slate-500 font-mono w-14 text-right">
        {patient.actualTime ? `${Math.round(patient.actualTime)} min` : (patient.predictedTime ? `~${Math.round(patient.predictedTime)} min` : '—')}
      </span>
      <span className="text-xs font-bold w-12 text-right" style={{ color: risk.color }}>
        {((patient.noShowProb || 0) * 100).toFixed(0)}%
      </span>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [queue, setQueue] = useState([]);
  const [completedPatients, setCompletedPatients] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lastSync, setLastSync] = useState(new Date());
  const [syncing, setSyncing] = useState(false);

  // Patient form state
  const [formData, setFormData] = useState({
    name: '', phone: '', Age: 30, Gender: 1,
    Hipertension: false, Diabetes: false, Alcoholism: false, Handcap: false, Scholarship: false
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return navigate('/login');
    setUser(JSON.parse(rawUser));
    fetchQueue();
    const timer = setInterval(fetchQueue, 15000);
    return () => clearInterval(timer);
  }, []);

  const fetchQueue = useCallback(async () => {
    setSyncing(true);
    try {
      const data = await queueService.getQueue();
      const active = Array.isArray(data) ? data.filter(p => !['done', 'no-show'].includes(p.status)) : [];
      const completed = Array.isArray(data) ? data.filter(p => ['done', 'no-show'].includes(p.status)) : [];
      setQueue(active);
      setCompletedPatients(completed);
      setLastSync(new Date());
    } finally {
      setSyncing(false);
    }
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await queueService.book(formData);
      setSuccessData(data.patient);
      await fetchQueue();
    } catch {
      alert('Booking failed. Is Node Port 4000 running?');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (id, type) => {
    try {
      if (type === 'start') await queueService.start(id);
      else if (type === 'end') await queueService.end(id);
      else if (type === 'noshow') await queueService.noShow(id);
      // late = mark as arrived / requeue (depends on backend)
      await fetchQueue();
    } catch { alert('Backend action failed.'); }
  };

  if (!user) return null;
  const isDoc = user.role === 'doctor';

  // ── Derived Queue Data ──────────────────────────────────────────────────────
  const activePatient = queue.find(p => p.status === 'in-progress');
  const waitingQueue = queue.filter(p => p.status !== 'in-progress');

  const queueStats = {
    waiting: queue.filter(p => p.status === 'waiting').length,
    arrived: queue.filter(p => p.status === 'arrived').length,
    inProgress: queue.filter(p => p.status === 'in-progress').length,
    done: completedPatients.filter(p => p.status === 'done').length,
    noshow: completedPatients.filter(p => p.status === 'no-show').length,
  };

  const totalToday = queue.length + completedPatients.length;
  const avgConsult = queue.length > 0
    ? Math.round(queue.reduce((s, p) => s + (p.predictedTime || 0), 0) / queue.length)
    : 0;
  const highRisk = queue.filter(p => (p.noShowProb || 0) > 0.4).length;

  const patientInQueue = successData
    ? queue.find(p => String(p.id || p._id) === String(successData.id || successData._id) || p.phone === successData.phone)
    : null;
  const liveWaitTarget = patientInQueue ? (patientInQueue.waitTime || 0) : (successData?.predictedTime || 0);

  const filteredQueue = activeFilter === 'all' ? waitingQueue : waitingQueue.filter(p => p.status === activeFilter);

  // Patient's queue position
  const patientPosition = patientInQueue ? (waitingQueue.findIndex(p => p.id === patientInQueue.id) + 1) : null;

  return (
    <div className="min-h-screen bg-darkBg text-white">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(99,102,241,0.15))', border: '1px solid rgba(0,212,255,0.3)' }}>
              <Activity className="w-5 h-5 text-neonGlow" />
            </div>
            <div>
              <span className="font-black tracking-tight text-white">Time<span className="text-neonGlow">Cure</span></span>
              <span className="hidden sm:inline ml-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                {isDoc ? 'Doctor Console' : 'Patient Portal'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Sync indicator */}
            <button onClick={fetchQueue}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-neonGlow' : 'text-slate-600'}`} />
              <span className="text-slate-500 hidden md:inline">Synced {lastSync.toLocaleTimeString()}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="live-dot" />
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest hidden md:block">Live</span>
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-200">{user.username}</p>
              <p className="text-[10px] text-neonGlow uppercase tracking-widest font-black leading-none">{user.role}</p>
            </div>

            <button onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              title="Logout">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-screen-2xl mx-auto px-6 py-8 relative z-10">

        {/* ════════════════════════════════════════════════════════
            DOCTOR DASHBOARD
        ════════════════════════════════════════════════════════ */}
        {isDoc ? (
          <div className="space-y-8">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label">Doctor Console</p>
                <h1 className="text-2xl font-black text-white">
                  Welcome, <span className="text-neonGlow">Dr. {user.username}</span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 px-4 py-2 rounded-xl"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Calendar className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* ── TOP ANALYTICS CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard
                label="Total Patients Today"
                value={totalToday}
                suffix=""
                icon={Users}
                color="#00D4FF"
                sub={`${queueStats.done} completed · ${queue.length} active`}
                gradient="linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(13,21,38,0.9) 100%)"
              />
              <StatCard
                label="Avg Consultation Time"
                value={avgConsult}
                suffix=" min"
                icon={Timer}
                color="#8B5CF6"
                sub="ML-predicted average"
                gradient="linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(13,21,38,0.9) 100%)"
              />
              <StatCard
                label="High-Risk Patients"
                value={highRisk}
                suffix=""
                icon={AlertTriangle}
                color="#EF4444"
                sub={highRisk > 0 ? 'SMS reminders recommended' : 'All patients low risk'}
                gradient="linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(13,21,38,0.9) 100%)"
              />
            </div>

            {/* ── QUEUE STATUS FILTERS ── */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Queue Status Filters</span>
                </div>
                <button onClick={() => setActiveFilter('all')}
                  className="text-[10px] text-slate-600 hover:text-neonGlow transition-colors uppercase tracking-widest font-bold">
                  Show All
                </button>
              </div>
              <div className="flex gap-3 flex-wrap">
                <FilterChip label="Waiting" count={queueStats.waiting} color="#94a3b8" active={activeFilter === 'waiting'} onClick={() => setActiveFilter(f => f === 'waiting' ? 'all' : 'waiting')} />
                <FilterChip label="Arrived" count={queueStats.arrived} color="#00D4FF" active={activeFilter === 'arrived'} onClick={() => setActiveFilter(f => f === 'arrived' ? 'all' : 'arrived')} />
                <FilterChip label="In Progress" count={queueStats.inProgress} color="#8B5CF6" active={activeFilter === 'in-progress'} onClick={() => setActiveFilter(f => f === 'in-progress' ? 'all' : 'in-progress')} />
                <FilterChip label="Completed" count={queueStats.done} color="#10B981" active={false} onClick={() => {}} />
                <FilterChip label="No-Show" count={queueStats.noshow} color="#EF4444" active={false} onClick={() => {}} />
              </div>
            </div>

            {/* ── MAIN CONTENT GRID ── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

              {/* ── LEFT: Active + Queue Cards ── */}
              <div className="xl:col-span-8 space-y-6">

                {/* Active Consultation */}
                {activePatient ? (
                  <div>
                    <p className="section-label mb-3">Current Consultation</p>
                    <ActiveConsultationCard patient={activePatient} onEnd={(id) => executeAction(id, 'end')} />
                  </div>
                ) : (
                  <div className="glass-card p-6 flex items-center justify-center gap-3 text-slate-600">
                    <Stethoscope className="w-5 h-5" />
                    <span className="text-sm font-semibold">No active consultation — start one from the queue below</span>
                  </div>
                )}

                {/* Patient Queue Cards */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="section-label">Patient Queue ({filteredQueue.length})</p>
                    <div className="text-xs text-slate-600">Sorted by arrival time</div>
                  </div>

                  {filteredQueue.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                      <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-600 text-sm uppercase tracking-widest font-bold">Queue is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredQueue.map((patient, i) => (
                        <PatientCard
                          key={patient.id || patient._id}
                          patient={patient}
                          queueIndex={i}
                          onAction={executeAction}
                          isDoc={isDoc}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Patients Section */}
                {completedPatients.length > 0 && (
                  <div>
                    <p className="section-label mb-4">Completed Patients ({completedPatients.length})</p>
                    <div className="glass-card overflow-hidden">
                      <div className="px-4 py-2 flex items-center gap-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest flex-1">Patient</span>
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest">Status</span>
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest w-14 text-right">Duration</span>
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest w-12 text-right">Risk</span>
                      </div>
                      {completedPatients.map(p => <CompletedRow key={p.id || p._id} patient={p} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Sidebar ── */}
              <div className="xl:col-span-4 space-y-6">

                {/* Risk Legend */}
                <div className="glass-card p-5">
                  <p className="section-label mb-4">Risk Legend</p>
                  <div className="space-y-3">
                    {[
                      { label: 'High Risk', range: '> 40%', color: '#EF4444', desc: 'Immediate SMS. Two reminders.' },
                      { label: 'Medium Risk', range: '20–40%', color: '#F59E0B', desc: '1 reminder recommended.' },
                      { label: 'Low Risk', range: '< 20%', color: '#10B981', desc: 'No SMS needed.' },
                    ].map(r => (
                      <div key={r.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${r.color}06`, border: `1px solid ${r.color}20` }}>
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ background: r.color, boxShadow: `0 0 8px ${r.color}60` }} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black" style={{ color: r.color }}>{r.label}</span>
                            <span className="text-[10px] text-slate-600 font-mono">{r.range}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{r.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smart Insights Panel */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-neonGlow" />
                    <p className="section-label mb-0">Smart Insights</p>
                  </div>
                  {queue.length === 0 ? (
                    <p className="text-xs text-slate-600">No active patients to analyze.</p>
                  ) : (
                    <div className="space-y-2">
                      {queue.slice(0, 5).map(p => {
                        const insight = getInsight(p.noShowProb || 0);
                        const InsightIcon = insight.icon;
                        return (
                          <div key={p.id} className="flex items-start gap-2.5 p-3 rounded-xl"
                               style={{ background: `${insight.color}06`, border: `1px solid ${insight.color}18` }}>
                            <InsightIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: insight.color }} />
                            <div>
                              <p className="text-xs font-bold text-slate-300">{p.name || `#${(p.id || '').slice(-4)}`}</p>
                              <p className="text-[11px] mt-0.5" style={{ color: insight.color }}>{insight.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Wait Time Intelligence */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Timer className="w-4 h-4 text-neonGlow" />
                    <p className="section-label mb-0">Time Intelligence</p>
                  </div>
                  <div className="space-y-3">
                    {waitingQueue.slice(0, 4).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-700 w-4">#{i+1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400 truncate">{p.name || `Patient ${i+1}`}</span>
                            <span className="text-neonGlow font-mono font-bold">{Math.round(p.waitTime || 0)}m wait</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(100, ((p.waitTime || 0) / 60) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {waitingQueue.length === 0 && <p className="text-xs text-slate-600">No patients waiting.</p>}
                  </div>
                </div>

                {/* Quick Notification Panel */}
                {highRisk > 0 && (
                  <div className="rounded-2xl p-5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Bell className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-red-400">Alert</span>
                    </div>
                    <p className="text-sm text-slate-300 font-semibold mb-1">{highRisk} high-risk patient{highRisk > 1 ? 's' : ''} in queue</p>
                    <p className="text-xs text-slate-500">SMS reminders should be sent immediately to reduce no-show probability.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        ) : (
          /* ════════════════════════════════════════════════════════
              PATIENT DASHBOARD
          ════════════════════════════════════════════════════════ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT: Booking Form */}
            <div className="lg:col-span-4 space-y-6">

              {/* Patient Header */}
              <div>
                <p className="section-label">Patient Portal</p>
                <h1 className="text-2xl font-black text-white">
                  Hello, <span className="text-neonGlow">{user.username}</span>
                </h1>
              </div>

              {successData ? (
                /* Success Card */
                <div className="glass-card p-8 text-center anim-fade-in">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 anim-glow"
                       style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">Slot Confirmed!</h3>
                  <p className="text-slate-500 text-sm mb-8">AI analysis complete. Your position is secured.</p>

                  {/* Summary metrics */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                         style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                      <span className="text-xs text-slate-400">Your Wait Time</span>
                      <span className="text-xl font-black text-neonGlow">{Math.round(liveWaitTarget)}<span className="text-xs text-slate-500 ml-1">min</span></span>
                    </div>
                    {patientPosition && (
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                           style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <span className="text-xs text-slate-400">Queue Position</span>
                        <span className="text-xl font-black text-indigo-400">#{patientPosition}</span>
                      </div>
                    )}
                  </div>

                  <button onClick={() => setSuccessData(null)} className="btn-outline w-full text-sm">
                    Book Another
                  </button>
                </div>
              ) : (
                /* Booking Form */
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                      <BrainCircuit className="w-5 h-5 text-neonGlow" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-white">Book Appointment</h2>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">AI-powered scheduling</p>
                    </div>
                  </div>

                  <form onSubmit={handleBook} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                      <input type="text" required placeholder="Your name" className="glass-input"
                        value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone (+CountryCode...)</label>
                      <input type="text" required placeholder="+92 300 1234567" className="glass-input"
                        value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Age</label>
                        <input type="number" min={1} max={120} className="glass-input"
                          value={formData.Age} onChange={e => setFormData(p => ({ ...p, Age: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Gender</label>
                        <select className="glass-input" value={formData.Gender}
                          onChange={e => setFormData(p => ({ ...p, Gender: e.target.value }))}>
                          <option value={1}>Male</option>
                          <option value={0}>Female</option>
                        </select>
                      </div>
                    </div>

                    {/* Health Conditions */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Health Conditions</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'Hipertension', label: 'Hypertension', icon: Heart },
                          { id: 'Diabetes', label: 'Diabetes', icon: Activity },
                          { id: 'Alcoholism', label: 'Alcoholism', icon: Shield },
                          { id: 'Handcap', label: 'Disability', icon: Users },
                        ].map(f => (
                          <button key={f.id} type="button"
                            onClick={() => setFormData(p => ({ ...p, [f.id]: !p[f.id] }))}
                            className="py-2.5 px-3 text-[10px] font-black tracking-widest uppercase rounded-xl border transition-all flex items-center gap-2"
                            style={{
                              background: formData[f.id] ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.02)',
                              borderColor: formData[f.id] ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.07)',
                              color: formData[f.id] ? '#00D4FF' : '#475569',
                            }}>
                            <f.icon className="w-3 h-3" />
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                      {loading ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</>
                      ) : (
                        <><BrainCircuit className="w-4 h-4" /> Analyze & Book</>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* RIGHT: Patient Queue View */}
            <div className="lg:col-span-8 space-y-6">

              {/* My Status Card (if booked) */}
              {patientInQueue && (
                <div className="active-consultation-card p-6 anim-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="live-dot" />
                      <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Your Status</span>
                    </div>
                    <span className={`status-pill ${getStatusStyle(patientInQueue.status)}`}>{patientInQueue.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Wait Time</p>
                      <p className="text-3xl font-black text-neonGlow">{Math.round(patientInQueue.waitTime || 0)}<span className="text-sm text-slate-500 ml-1">min</span></p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Queue #</p>
                      <p className="text-3xl font-black text-indigo-400">#{patientPosition || '—'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-lg font-black text-slate-300">{patientInQueue.status === 'in-progress' ? '🔵 Now' : '⏳ Wait'}</p>
                    </div>
                  </div>
                  {patientInQueue.status === 'in-progress' && (
                    <div className="mt-4 py-3 px-4 rounded-xl text-sm font-bold text-center text-green-300"
                         style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                      🎉 You are being seen now!
                    </div>
                  )}
                  {patientPosition === 1 && patientInQueue.status !== 'in-progress' && (
                    <div className="mt-4 py-3 px-4 rounded-xl text-sm font-bold text-center text-neonGlow"
                         style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
                      🏃 You're next! Please be ready.
                    </div>
                  )}
                </div>
              )}

              {/* Live Queue */}
              <div className="glass-card overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <h2 className="font-black text-slate-100">Live Queue</h2>
                    <p className="text-xs text-slate-500">{queue.length} patient{queue.length !== 1 ? 's' : ''} in system</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="live-dot" />
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Live Sync</span>
                  </div>
                </div>

                <div className="p-5">
                  {queue.length === 0 ? (
                    <div className="py-16 text-center">
                      <Clock className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-600 text-sm uppercase tracking-widest font-bold">Queue is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {queue.map((p, i) => (
                        <div key={p.id || p._id}
                             className={`flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all ${patientInQueue?.id === p.id ? 'border-neonGlow/40' : ''}`}
                             style={{
                               background: p.status === 'in-progress' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.025)',
                               borderColor: p.status === 'in-progress' ? 'rgba(99,102,241,0.35)' : (patientInQueue?.id === p.id ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.05)'),
                             }}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                               style={{ background: p.status === 'in-progress' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)', color: p.status === 'in-progress' ? '#a5b4fc' : '#64748b' }}>
                            {i === 0 && p.status === 'in-progress' ? '▶' : `#${i + 1}`}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-200 text-sm">{p.name || `Patient ${i + 1}`}</p>
                            <p className="text-xs text-slate-600">{p.phone || 'No contact'}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-black text-neonGlow font-mono">{Math.round(p.waitTime || 0)} min</p>
                            <p className="text-[10px] text-slate-600">wait time</p>
                          </div>
                          <span className={`status-pill ${getStatusStyle(p.status)} flex-shrink-0`}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
