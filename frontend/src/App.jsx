import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
<<<<<<< theme-refactor
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
=======
import Dashboard from './pages/Dashboard';
import { useTheme } from './hooks/useTheme';
import AppointmentPage from './pages/AppointmentPage';

function App() {
  useTheme(); // Initialize theme
>>>>>>> main

export default function App() {
  return (
<<<<<<< theme-refactor
    <BrowserRouter>
      <QueueProvider>
        <Routes>
          <Route path="/"         element={<Navigate to="/login" replace />} />
          <Route path="/login"    element={<Signin />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/doctor"   element={<DoctorDashboard />} />
          <Route path="/patient"  element={<PatientDashboard />} />
          <Route path="*"         element={<Navigate to="/login" replace />} />
        </Routes>
      </QueueProvider>
    </BrowserRouter>
=======
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment" element={<AppointmentPage />} />
      </Routes>
    </Router>
>>>>>>> main
  );
}
