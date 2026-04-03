import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Logo from '../components/Logo';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg flex flex-col justify-center items-center p-6">
        
      <div className="flex flex-col items-center mb-8">
        <Logo className="w-14 h-14 mb-4 shadow-sm" />
        <h1 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight">Smart Scheduling</h1>
      </div>

      <div className="w-full max-w-[420px] expert-panel p-8 sm:p-10 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-xl"></div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-sm font-medium text-slate-500">Join the TimeCure HealthTech platform</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input pl-11 h-12" 
                placeholder="Dr. Sarah Connor"
                required
              />
            </div>
          </div>

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
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Password</label>
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
              "Register Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-600 mt-8 pt-6 border-t border-slate-100">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
