import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';

const Signin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
  };

  return (
    <div className="min-h-screen bg-light-bg flex">
      
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 bg-white border-r border-border">
        <div className="max-w-xl slide-in-bottom">
          <Logo className="w-14 h-14 mb-8" />
          <h1 className="text-5xl font-extrabold mb-6 leading-tight text-slate-900 tracking-tight">
            Smart <span className="text-primary">Appointment</span> <br/> Scheduling System
          </h1>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed">
            Enterprise-grade ML prediction platform. Optimizing hospital workflows, predicting no-shows, and securely adapting queue structures in real-time.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <div className="expert-panel p-4 flex items-center gap-4 w-[75%] border-l-4 border-l-primary">
              <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Secure ML Predictions</p>
                <p className="text-xs font-medium text-slate-500">Models run locally. PHI protected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-subtle">
        
        <div className="lg:hidden flex flex-col items-center mb-8">
          <Logo className="w-12 h-12 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 text-center tracking-tight">Smart Scheduling</h1>
        </div>

        <div className="w-full max-w-md expert-panel p-8 sm:p-10 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-xl"></div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Sign In</h2>
            <p className="text-sm font-medium text-slate-500">Access your administrative dashboard.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-11 h-12" 
                  placeholder="admin@timecure.io"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs text-primary hover:underline font-bold">Recovery?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-11 h-12" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full mt-6 h-12"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-600 mt-8 pt-6 border-t border-slate-100">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
