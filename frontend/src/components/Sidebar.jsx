import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, BarChart3, Stethoscope, Settings, ChevronLeft, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

const doctorMenu = [
  { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'appointments',  label: 'Appointments',   icon: Calendar },
  { id: 'queue',         label: 'Live Queue',     icon: Users },
  { id: 'analytics',     label: 'Analytics',      icon: BarChart3 },
  { id: 'doctors',       label: 'Doctors',        icon: Stethoscope },
  { id: 'settings',      label: 'Settings',       icon: Settings },
];

const Sidebar = ({ role = 'doctor' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsExpanded(window.innerWidth >= 1280);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = doctorMenu;

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-white border-r border-border">
      {/* Toggle btn – desktop only */}
      {!mobile && (
        <button
          onClick={() => setIsExpanded(e => !e)}
          className="hidden lg:flex absolute -right-3 top-8 bg-white border border-border p-1 rounded-full text-slate-500 hover:text-primary transition-colors z-30 shadow-sm"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      )}

      {/* Logo */}
      <div className={`p-5 flex items-center ${isExpanded || mobile ? 'gap-3' : 'justify-center'} border-b border-border`}>
        <Logo className={isExpanded || mobile ? 'w-8 h-8' : 'w-9 h-9'} />
        {(isExpanded || mobile) && (
          <div className="overflow-hidden">
            <h2 className="font-extrabold text-base leading-tight text-slate-900 whitespace-nowrap">TimeCure</h2>
            <p className="text-[10px] text-primary uppercase tracking-wider font-bold whitespace-nowrap">HealthTech OS</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); if (mobile) setIsMobileOpen(false); }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium w-full
                ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                ${!isExpanded && !mobile ? 'justify-center' : ''}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {(isExpanded || mobile) && <span className="whitespace-nowrap">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => navigate('/login')}
          className={`flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all w-full font-medium text-sm
            ${!isExpanded && !mobile ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(isExpanded || mobile) && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-slate-700 border border-border"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <div
        className="hidden lg:flex h-screen flex-col relative z-30 shrink-0 transition-all duration-300 overflow-hidden"
        style={{ width: isExpanded ? 220 : 72 }}
      >
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="lg:hidden fixed inset-y-0 left-0 w-64 z-50 shadow-2xl">
            <button onClick={() => setIsMobileOpen(false)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 z-10">
              <X size={20} />
            </button>
            <SidebarContent mobile />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
