import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Stethoscope, UserRound } from 'lucide-react';
import Logo from '../components/Logo';

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< theme-refactor
  const [role, setRole] = useState('doctor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const MOCK_CREDS = {
    doctor:  { email: 'doctor@timecure.io',  password: 'doctor123'  },
    patient: { email: 'patient@timecure.io', password: 'patient123' },
  };
=======
  const [errorMsg, setErrorMsg] = useState('');
>>>>>>> main

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const valid = MOCK_CREDS[role];
    if (email !== valid.email || password !== valid.password) {
      setError('Invalid credentials. Check the hints below.');
      return;
    }
    setIsLoading(true);
<<<<<<< theme-refactor
    setTimeout(() => navigate(role === 'doctor' ? '/doctor' : '/patient'), 1200);
=======
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message);
    }
>>>>>>> main
  };

  return (
    <div className="min-h-screen bg-light-bg flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 bg-white border-r border-border">
        <Logo className="w-14 h-14 mb-8" />
        <h1 className="text-5xl font-extrabold mb-5 leading-tight text-slate-900 tracking-tight">
          Smart <span className="text-primary">Appointment</span><br />Scheduling System
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
          ML-powered, event-driven queue management for modern hospitals. Predict no-shows, adapt in real-time, reduce patient wait times.
        </p>

        <div className="space-y-3">
          {[
            { icon: '🧠', title: 'ML Predictions', desc: 'No-show & time models from 110k+ appointments' },
            { icon: '📊', title: 'Live Queue', desc: 'Event-driven real-time queue recalculation' },
            { icon: '📱', title: 'SMS Strategy', desc: 'Auto-classified reminders for high-risk patients' },
          ].map(f => (
            <div key={f.title} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-border">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-800">{f.title}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 bg-slate-50">
        <div className="lg:hidden flex flex-col items-center mb-8">
          <Logo className="w-12 h-12 mb-3" />
          <h1 className="text-2xl font-bold text-slate-900">TimeCure</h1>
        </div>

        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-border p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-xl" />

          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Sign In</h2>
          <p className="text-sm text-slate-500 mb-6">Select your role to access the system.</p>

          {/* Role Selector */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all
                ${role === 'doctor' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-border hover:border-primary/50'}`}
            >
              <Stethoscope className="w-4 h-4" /> Doctor / Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all
                ${role === 'patient' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-border hover:border-primary/50'}`}
            >
              <UserRound className="w-4 h-4" /> Patient
            </button>
          </div>

          {/* Hint */}
          <div className="mb-5 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700 font-medium">
            {role === 'doctor' ? 'doctor@timecure.io / doctor123' : 'patient@timecure.io / patient123'}
          </div>

<<<<<<< theme-refactor
          {error && <p className="mb-4 text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 block">Email</label>
=======
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Email Address</label>
>>>>>>> main
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder={MOCK_CREDS[role].email}
                  className="glass-input pl-10 h-12" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="glass-input pl-10 h-12" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full h-12 mt-2">
              {isLoading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : `Enter as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6 pt-5 border-t border-border">
            Need an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
