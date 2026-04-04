import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Clock, TrendingDown, Zap, Bell, BarChart3, ShieldCheck, ArrowRight,
  Activity, ChevronRight, Stethoscope, Users, Timer, MessageSquare, Wifi, Star
} from 'lucide-react';

// Animated Counter Hook
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, desc, color, delay }) {
  return (
    <div className="glass-card p-7 group hover:scale-[1.02] transition-all duration-400 cursor-default"
         style={{ animationDelay: `${delay}ms`, opacity: 0, animation: `fadeUp 0.6s ease-out ${delay}ms forwards` }}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}
           style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// Stat Display Component
function LiveStat({ label, value, suffix, icon: Icon, color, start }) {
  const count = useCountUp(value, 2200, start);
  return (
    <div className="neon-card p-6 text-center">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
           style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <p className="text-4xl font-black text-white mb-1">
        {count}{suffix}
      </p>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI Time Prediction',
      desc: 'ML regression model precisely forecasts consultation duration, reducing idle time and queue bottlenecks.',
      color: '#00D4FF',
    },
    {
      icon: TrendingDown,
      title: 'No-Show Intelligence',
      desc: 'Classification model assigns no-show probability and auto-triggers SMS reminders for high-risk patients.',
      color: '#8B5CF6',
    },
    {
      icon: Wifi,
      title: 'Real-Time Queue Sync',
      desc: 'Live queue updates broadcast across all devices — doctors, patients, and reception see the same truth.',
      color: '#10B981',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      desc: 'Context-aware SMS delivery. High-risk gets double reminders. Low-risk gets silence. Zero waste.',
      color: '#F59E0B',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      desc: 'Deep insights on avg consultation time, no-show trends, and risk distribution in real time.',
      color: '#EF4444',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Security',
      desc: 'JWT-secured access control ensures doctors, patients, and staff see only what they need.',
      color: '#06B6D4',
    },
  ];

  return (
    <div className="min-h-screen bg-darkBg text-white overflow-x-hidden">

      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full blur-[150px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', animationDelay: '3s' }} />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full blur-[120px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', animationDelay: '5s' }} />
        <div className="grid-bg absolute inset-0 opacity-30" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center anim-glow"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(99,102,241,0.2))', border: '1px solid rgba(0,212,255,0.3)' }}>
              <Activity className="w-5 h-5 text-neonGlow" />
            </div>
            <div>
              <span className="font-black tracking-tight text-white text-lg">Time<span className="text-neonGlow">Cure</span></span>
              <span className="ml-2 text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold">AI Health</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">
              <div className="live-dot" />
              <span>System Online</span>
            </div>
            <button onClick={() => navigate('/login')} className="btn-outline text-xs px-5 py-2.5">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="btn-primary text-xs px-5 py-2.5">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Pre-title badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 anim-fade-in"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}>
            <Brain className="w-3.5 h-3.5" />
            Powered by Machine Learning
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6 anim-fade-up"
              style={{ animationDelay: '100ms', opacity: 0 }}>
            <span className="text-white">Smart AI-Based</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #6366F1 50%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Appointment Scheduling
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed anim-fade-up"
             style={{ animationDelay: '200ms', opacity: 0 }}>
            Eliminate waiting room chaos with real-time ML predictions.
            Reduce wait times, predict no-shows, and intelligently optimize every consultation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 anim-fade-up"
               style={{ animationDelay: '300ms', opacity: 0 }}>
            <button onClick={() => navigate('/register')}
              className="btn-primary text-sm px-8 py-4 w-full sm:w-auto group">
              <Stethoscope className="w-4 h-4" />
              Book Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/login')}
              className="btn-outline text-sm px-8 py-4 w-full sm:w-auto">
              Login as Doctor
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── PROOF STATS ROW ── */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto anim-fade-up" style={{ animationDelay: '400ms', opacity: 0 }}>
          {[
            { n: '94', suf: '%', label: 'Prediction Accuracy' },
            { n: '60', suf: '%', label: 'Wait Time Reduction' },
            { n: '3', suf: 'x', label: 'Faster Queue Processing' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-white">{s.n}<span className="text-neonGlow">{s.suf}</span></p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE SYSTEM PREVIEW / STATS ── */}
      <section ref={statsRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">Live System Preview</p>
            <h2 className="text-3xl font-bold text-white mt-2">Real-Time Intelligence at Scale</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
              Monitor the pulse of your clinic in real time. Every number is dynamic, every decision is data-driven.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <LiveStat label="Patients in Queue" value={12} suffix="" icon={Users} color="#00D4FF" start={statsVisible} />
            <LiveStat label="Avg Wait Time (mins)" value={18} suffix="" icon={Timer} color="#8B5CF6" start={statsVisible} />
            <LiveStat label="No-Show Reduction" value={43} suffix="%" icon={TrendingDown} color="#10B981" start={statsVisible} />
          </div>

          {/* Mock Dashboard Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto glass-card p-1 anim-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(5,10,26,0.9)' }}>
              {/* Mock header bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-xs text-slate-600 font-mono">TimeCure Dashboard — Dr. Ahmad</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="live-dot" />
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Live</span>
                </div>
              </div>
              {/* Mock content rows */}
              <div className="p-5 grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Patients', val: '14', color: '#00D4FF', sub: 'Today' },
                  { label: 'Avg Consultation', val: '16 min', color: '#8B5CF6', sub: 'ML Predicted' },
                  { label: 'High Risk', val: '3', color: '#EF4444', sub: 'Patients' },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl px-4 py-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-xs text-slate-600 mb-1">{m.label}</p>
                    <p className="text-2xl font-black" style={{ color: m.color }}>{m.val}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>
              {/* Mock queue rows */}
              <div className="px-5 pb-5 space-y-2">
                {[
                  { name: 'Sarah Mitchell', wait: '0 min', risk: 'In Progress', riskColor: '#6366F1', status: 'in-progress' },
                  { name: 'James Li', wait: '16 min', risk: 'Low Risk', riskColor: '#10B981', status: 'waiting' },
                  { name: 'Aisha Khan', wait: '32 min', risk: 'High Risk', riskColor: '#EF4444', status: 'waiting' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl"
                       style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                           style={{ background: `${r.riskColor}20`, color: r.riskColor }}>{r.name[0]}</div>
                      <span className="text-sm font-medium text-slate-300">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500 font-mono">{r.wait}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{ background: `${r.riskColor}15`, color: r.riskColor, border: `1px solid ${r.riskColor}30` }}>
                        {r.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">Core Features</p>
            <h2 className="text-3xl font-bold text-white mt-2">Intelligence Built for Healthcare</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
              Every feature is designed around one goal: making appointment scheduling smarter, faster, and more humane.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">Workflow</p>
            <h2 className="text-3xl font-bold text-white mt-2">How TimeCure Works</h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-neonGlow via-neonPurple to-transparent hidden md:block" />
            
            <div className="space-y-6">
              {[
                { step: '01', title: 'Patient Books Appointment', desc: 'Fills in age, health conditions, and contact info. ML model instantly predicts consultation time & no-show risk.', icon: Users, color: '#00D4FF' },
                { step: '02', title: 'AI Risk Assessment', desc: 'No-show probability calculated. High-risk patients receive automatic SMS reminders. Queue wait times pre-calculated.', icon: Brain, color: '#8B5CF6' },
                { step: '03', title: 'Real-Time Queue Management', desc: 'Doctor starts/ends consultations. Queue shifts dynamically. Every patient sees their live wait time update.', icon: Activity, color: '#10B981' },
                { step: '04', title: 'Smart Notifications', desc: 'System sends contextual alerts. "You\'re next!" pings. Delay notifications. No-show follow-ups. All automated.', icon: MessageSquare, color: '#F59E0B' },
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start anim-slide-in glass-card p-6"
                     style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm relative z-10"
                       style={{ background: `${step.color}15`, border: `1px solid ${step.color}30`, color: step.color }}>
                    {step.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="w-4 h-4" style={{ color: step.color }} />
                      <h3 className="font-bold text-slate-200">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            {/* Glow behind */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full blur-[100px]"
                style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)' }} />
            </div>
            <Zap className="w-12 h-12 text-neonGlow mx-auto mb-6 anim-float" />
            <h2 className="text-4xl font-black text-white mb-4">Ready to Transform Your Clinic?</h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto">
              Join the AI-powered scheduling revolution. Reduce waiting, increase efficiency, and deliver better patient care.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/register')} className="btn-primary text-sm px-10 py-4">
                <Star className="w-4 h-4" />
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/login')} className="btn-outline text-sm px-10 py-4">
                Doctor Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-neonGlow" />
            <span className="font-black text-white">Time<span className="text-neonGlow">Cure</span></span>
            <span className="text-slate-600 text-sm">· Smart AI Healthcare Scheduling</span>
          </div>
          <p className="text-slate-600 text-xs">Built with ML + React + Node.js · CortexCrew 2026</p>
        </div>
      </footer>
    </div>
  );
}
