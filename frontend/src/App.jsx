import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import SymptomsCheck from './pages/SymptomsCheck';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './index.css';

/**
 * ProtectedLayout — wraps the main app shell.
 * Step 4: If user is not logged in, show Login page.
 * "Continue without login" still works (bypasses auth, uses mock data).
 */
function ProtectedLayout() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Allow bypass — user can skip login and use mock data
  const [bypassed, setBypassed] = useState(() => {
    return sessionStorage.getItem('tc-bypass') === '1';
  });

  const handleLoginSuccess = () => {
    sessionStorage.setItem('tc-bypass', '1');
    setBypassed(true);
    navigate('/dashboard', { replace: true });
  };

  // Still loading auth state from sessionStorage — show nothing brief
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--green)', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authenticated and not bypassed → show Login
  if (!isLoggedIn && !bypassed) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  // Authenticated (or bypassed) → show full app
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/symptoms" element={<SymptomsCheck />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ProtectedLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
