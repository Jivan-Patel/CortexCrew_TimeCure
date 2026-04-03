import React, { useState } from 'react';
import { Network, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import AppointmentPanel from '../components/AppointmentPanel';
import QueuePanel from '../components/QueuePanel';
import WalkInModal from '../components/WalkInModal';

const initialQueue = [
  { id: 1, name: 'Emma Watson', type: 'booked', status: 'in-progress', noShowProb: 0.05, predictedTime: 15, waitTime: 0 },
  { id: 2, name: 'James Smith', type: 'walk-in', status: 'arrived', noShowProb: 0.12, predictedTime: 12, waitTime: 15 },
  { id: 3, name: 'Olivia Brown', type: 'booked', status: 'waiting', noShowProb: 0.75, predictedTime: 20, waitTime: 27 },
];

const Dashboard = () => {
  const [queue, setQueue] = useState(initialQueue);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);

  // Stats computation based on active Queue state
  const arrivedCnt = queue.filter(p => p.status === 'arrived' || p.status === 'waiting').length;
  const inProgressCnt = queue.filter(p => p.status === 'in-progress').length;
  const totalCnt = queue.length;

  const handleWalkIn = (patientData) => {
    // Generate simple mock ID and place immediately after 'in-progress' or at position 1
    const newPatient = {
      id: Date.now(),
      name: patientData.name || 'Unknown Patient',
      type: 'walk-in',
      status: 'arrived',
      noShowProb: Math.random() * 0.2, // low prob for walk ins
      predictedTime: Math.floor(Math.random() * 15) + 5,
      waitTime: Math.floor(Math.random() * 10) + 5
    };
    
    // Insert at start of waiting queue
    setQueue(prev => {
      const q = [...prev];
      let insertIndex = q.findIndex(p => p.status !== 'in-progress');
      if (insertIndex === -1) insertIndex = q.length;
      q.splice(insertIndex, 0, newPatient);
      return q;
    });
    setIsWalkInOpen(false);
  };

  const handleBook = (patientData) => {
    // End of queue booking
    const newPatient = {
      id: Date.now(),
      name: patientData.name || 'New Booking',
      type: 'booked',
      status: 'waiting',
      noShowProb: patientData.mockNoShow,
      predictedTime: patientData.mockTime,
      waitTime: queue.reduce((acc, p) => acc + p.predictedTime, 0)
    };
    setQueue(prev => [...prev, newPatient]);
  };

  const updatePatientStatus = (id, newStatus) => {
    if (newStatus === 'late') {
       // Move to back
       setQueue(prev => {
         const patientIndex = prev.findIndex(p => p.id === id);
         if (patientIndex === -1) return prev;
         const p = prev[patientIndex];
         p.status = 'waiting';
         const q = prev.filter(x => x.id !== id);
         // Insert after current (mocking late reinsertion logic)
         q.splice(1, 0, p);
         return q;
       });
       return;
    }

    setQueue(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="flex h-screen bg-light-bg overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 scroll-smooth z-10 custom-scrollbar">
          <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-8">
            
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Hospital Operations Control</h1>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <Network className="w-4 h-4 text-primary" />
                  ML Event-Driven Architecture Active
                </p>
              </div>
              <button onClick={() => setIsWalkInOpen(true)} className="btn-primary">
                + Register Walk-In
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <StatsCard title="Total Assigned" value={totalCnt} />
               <StatsCard title="Arrived / Waiting" value={arrivedCnt} />
               <StatsCard title="Currently Consulting" value={inProgressCnt} />
            </div>

            {/* PANELS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              
              <div className="xl:col-span-1 h-full">
                <AppointmentPanel onBook={handleBook} />
              </div>

              <div className="xl:col-span-2 flex flex-col gap-6">
                <QueuePanel queue={queue} onUpdateStatus={updatePatientStatus} />
              </div>

            </div>
          </div>
        </main>
      </div>

      {isWalkInOpen && <WalkInModal onClose={() => setIsWalkInOpen(false)} onAdd={handleWalkIn} />}
    </div>
  );
};

export default Dashboard;
