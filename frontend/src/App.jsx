import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

export default function App() {
  return (
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
  );
}
