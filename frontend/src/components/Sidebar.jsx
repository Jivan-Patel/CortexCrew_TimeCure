import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Stethoscope, Settings, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/symptoms', icon: Stethoscope, label: 'Symptoms Check' },
];

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ width: collapsed ? 64 : 240, overflow: 'hidden' }}
    >
      {/* Logo area */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', minHeight: 64 }}>
        <Logo size={28} />
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.02em' }}>
                <span style={{ color: 'var(--green)' }}>Time</span>
                <span style={{ color: 'var(--red)' }}>Cure</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-sec)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>Patient Portal</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon size={17} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="nav-label">
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '0.75rem 0', borderTop: '1px solid var(--border)' }}>
        {/* Settings link */}
        <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Settings size={17} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="nav-label">Settings</motion.span>}
          </AnimatePresence>
        </NavLink>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          {theme === 'dark' ? <Sun size={17} style={{ flexShrink: 0 }} /> : <Moon size={17} style={{ flexShrink: 0 }} />}
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="nav-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</motion.span>}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="nav-label">Collapse</motion.span>}
          </AnimatePresence>
        </button>

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginTop: 4 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #3fb950, #f85149)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, color: '#fff' }}>P</div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Prathvik</div>
                <div style={{ fontSize: 11, color: 'var(--text-sec)' }}>Patient</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
