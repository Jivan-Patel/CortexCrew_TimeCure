import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import SymptomsCheck from './pages/SymptomsCheck';
import Settings from './pages/Settings';
import './index.css';

function AppRoutes() {
  const location = useLocation();
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
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
