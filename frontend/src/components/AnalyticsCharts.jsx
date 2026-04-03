import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../hooks/useTheme';

const waitingData = [
  { time: '08:00', wait: 12 }, { time: '09:00', wait: 18 }, { time: '10:00', wait: 25 },
  { time: '11:00', wait: 15 }, { time: '12:00', wait: 10 }, { time: '13:00', wait: 30 },
  { time: '14:00', wait: 20 }
];

const workloadData = [
  { name: 'Dr. Sarah', patients: 14 },
  { name: 'Dr. John', patients: 18 },
  { name: 'Dr. Emily', patients: 12 },
  { name: 'Dr. Mike', patients: 22 },
];

const noShowData = [
  { name: 'Attended', value: 85 },
  { name: 'No-Show', value: 15 },
];

const COLORS = ['#0d9488', '#2563eb', '#dc2626', '#f59e0b']; // Refined 'stable' colors

const AnalyticsCharts = () => {
  const { isDark } = useTheme();

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full w-full">
      {/* Line Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-panel p-6 flex flex-col h-[320px] xl:h-full"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Wait Time Trends</h3>
        <div className="flex-1 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waitingData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="time" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: tooltipText }}
                itemStyle={{ color: '#0d9488' }}
              />
              <Line type="monotone" dataKey="wait" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: isDark ? '#0f172a' : '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar & Pie Combo */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel p-6 flex flex-col h-[320px] xl:h-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Workload & Reliability</h3>
        </div>
        <div className="flex-1 w-full flex gap-2 min-h-[200px]">
          <div className="w-[55%] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-30} textAnchor="end" />
                <YAxis stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }} contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: tooltipText }} />
                <Bar dataKey="patients" radius={[4, 4, 0, 0]} animationDuration={1500}>
                  {workloadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-[45%] h-full flex flex-col justify-center items-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={noShowData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                  stroke="none"
                >
                  {noShowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0d9488' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: tooltipText }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">85%</span>
              <span className="text-[9px] text-slate-500 uppercase font-semibold">Attended</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;
