import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import QueuePanel from '../components/QueuePanel';
import AppointmentPanel from '../components/AppointmentPanel';
import WalkInModal from '../components/WalkInModal';
import MLStatusBadge from '../components/MLStatusBadge';

const DoctorDashboard = () => {
  const { queue, mlOnline } = useQueue();
  const [walkinOpen, setWalkinOpen] = useState(false);

  const stats = {
    total:      queue.length,
    waiting:    queue.filter(p => p.status === 'waiting').length,
    arrived:    queue.filter(p => p.status === 'arrived').length,
    inProgress: queue.filter(p => p.status === 'in-progress').length,
    done:       queue.filter(p => p.status === 'done').length,
    noShow:     queue.filter(p => p.status === 'no-show').length,
    highRisk:   queue.filter(p => p.sms_strategy === 'high_risk' && !p.sms_received).length,
  };

  return (
    <div className="flex h-screen bg-light-bg overflow-hidden font-sans">
      <Sidebar role="doctor" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="doctor" />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-[1600px] mx-auto space-y-6 pb-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctor Dashboard</h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-slate-500">Hospital Operations Control • ML Event-Driven System</p>
                  <MLStatusBadge online={mlOnline} />
                </div>
              </div>
              <button onClick={() => setWalkinOpen(true)} className="btn-primary shrink-0">
                + Register Walk-In
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatsCard title="Total" value={stats.total} color="slate" />
              <StatsCard title="Waiting" value={stats.waiting} color="amber" />
              <StatsCard title="Arrived" value={stats.arrived} color="blue" />
              <StatsCard title="In Progress" value={stats.inProgress} color="indigo" />
              <StatsCard title="Completed" value={stats.done} color="green" />
              <StatsCard title="No-Show" value={stats.noShow} color="red" />
            </div>

            {/* High-risk SMS alert banner */}
            {stats.highRisk > 0 && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-800">
                <span className="text-xl">⚠️</span>
                <p className="text-sm font-semibold">
                  {stats.highRisk} high-risk patient{stats.highRisk > 1 ? 's' : ''} have not received an SMS reminder. Send reminders to reduce no-show probability.
                </p>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <div className="xl:col-span-1">
                <AppointmentPanel />
              </div>
              <div className="xl:col-span-2">
                <QueuePanel role="doctor" />
              </div>
            </div>

          </div>
        </main>
      </div>

      {walkinOpen && <WalkInModal onClose={() => setWalkinOpen(false)} />}
    </div>
  );
};

export default DoctorDashboard;
