import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Stethoscope, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import AppointmentPanel from '../components/AppointmentPanel';
import QueuePanel from '../components/QueuePanel';
import AIPredictionPanel from '../components/AIPredictionPanel';
import DoctorPanel from '../components/DoctorPanel';
import NotificationPanel from '../components/NotificationPanel';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-darker overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[30%] rounded-full bg-neon-blue/5 blur-[120px] pointer-events-none"></div>

        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6 scroll-smooth z-10 relative custom-scrollbar">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 max-w-[1600px] mx-auto"
          >
            {/* 1️⃣ STATS CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
               <StatsCard title="Total Appointments" value={124} icon={Calendar} trend="up" trendValue="12%" colorClass="bg-primary" />
               <StatsCard title="Average Wait Time" value="14 min" icon={Clock} trend="down" trendValue="5%" colorClass="bg-amber-500" />
               <StatsCard title="No-show Rate" value="4.2%" icon={Users} trend="down" trendValue="1.2%" colorClass="bg-neon-red" />
               <StatsCard title="Doctor Utilization" value="88%" icon={Stethoscope} trend="up" trendValue="3%" colorClass="bg-neon-blue" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Left Column (2/3 width on xl) */}
              <div className="xl:col-span-2 flex flex-col gap-6">
                
                {/* 2️⃣ APPOINTMENT SCHEDULER PANEL */}
                <div className="h-[400px]">
                  <AppointmentPanel />
                </div>
                
                {/* 5️⃣ ANALYTICS CHARTS */}
                <div className="h-[350px]">
                  <AnalyticsCharts />
                </div>

              </div>

              {/* Sidebar Right Column (1/3 width on xl) */}
              <div className="flex flex-col gap-6">
                
                {/* 4️⃣ AI PREDICTION PANEL */}
                <div className="h-[250px]">
                  <AIPredictionPanel />
                </div>

                {/* 3️⃣ REAL-TIME QUEUE PANEL */}
                <div className="flex-1 min-h-[350px]">
                  <QueuePanel />
                </div>

              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-6">
              {/* 6️⃣ DOCTOR AVAILABILITY PANEL */}
              <div className="xl:col-span-2 h-[350px]">
                <DoctorPanel />
              </div>
              
              {/* 7️⃣ NOTIFICATION PANEL */}
              <div className="h-[350px]">
                <NotificationPanel />
              </div>
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
