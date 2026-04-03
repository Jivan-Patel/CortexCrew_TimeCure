import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MLStatusBadge from './MLStatusBadge';
import { useQueue } from '../context/QueueContext';

const Navbar = ({ role = 'doctor' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { mlOnline, queue } = useQueue();
  const navigate = useNavigate();

  const highRiskCount = queue.filter(p => p.sms_strategy === 'high_risk' && !p.sms_received && p.status !== 'done' && p.status !== 'no-show').length;

  const displayName = role === 'doctor' ? 'Dr. Admin' : 'Olivia Brown';
  const displayRole = role === 'doctor' ? 'Senior Doctor' : 'Patient';
  const initials    = role === 'doctor' ? 'DA' : 'OB';

  return (
    <header className="h-16 bg-white border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">

      {/* Search */}
      <div className="w-48 sm:w-72 relative group hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full bg-slate-50 border border-border text-slate-700 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      <div className="flex-1 sm:flex-none" />

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        <MLStatusBadge online={mlOnline} />

        {/* Notifications bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          {highRiskCount > 0 && (
            <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {highRiskCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:bg-slate-100 pl-1 pr-2 py-1 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-xs ring-2 ring-white">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-none">{displayName}</p>
              <p className="text-xs text-slate-500 mt-0.5">{displayRole}</p>
            </div>
            <ChevronDown className="hidden md:block w-4 h-4 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white py-1.5 rounded-xl border border-border shadow-lg overflow-hidden z-50">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-sm font-bold text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-500">{displayRole}</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
