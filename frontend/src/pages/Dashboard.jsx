import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/auth';

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await authAPI.getMe();
        setUser(response.user);
      } catch (err) {
        setError('Failed to load user data');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await authAPI.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] font-sans flex items-center justify-center">
        <div className="text-center py-15 px-5 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] font-sans flex items-center justify-center">
        <div className="text-center py-15 px-5 text-lg text-[#c33]">{error}</div>
      </div>
    );
  }

  const userRole = user?.username ? 'patient' : user?.role;
  const isDoctor = userRole === 'doctor';

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-sans">
      <nav className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] px-5 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center sticky top-0 z-[100] gap-4 md:gap-0">
        <div>
          <h1 className="m-0 text-[#333] text-2xl font-bold">🏥 TimeCure</h1>
        </div>
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
          <span className="font-semibold text-[#333]">{user?.username}</span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${isDoctor ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#e3f2fd] text-[#1565c0]'}`}>
            {isDoctor ? '👨‍⚕️ Doctor' : '👤 Patient'}
          </span>
          <button onClick={handleLogout} className="px-4 py-2 bg-[#ff6b6b] text-white border-none rounded-md cursor-pointer font-semibold transition-colors hover:bg-[#ee5a52]">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-5 md:p-10 max-w-[1200px] mx-auto">
        <div className="mb-10">
          <h2 className="text-[#333] text-2xl md:text-3xl font-bold mb-2.5">Welcome, {user?.username}! 👋</h2>
          <p className="text-[#666] text-base">
            {isDoctor
              ? 'Welcome to your doctor dashboard'
              : 'Welcome to your patient dashboard'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isDoctor ? (
            <>
              <div className="bg-white rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] block">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-[#333] my-4 text-lg font-bold">My Appointments</h3>
                <p className="text-[#666] text-sm mb-5">View and manage your appointments</p>
                <button className="w-full p-2.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-md cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)] block">View Appointments</button>
              </div>

              <div className="bg-white rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] block">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-[#333] my-4 text-lg font-bold">My Patients</h3>
                <p className="text-[#666] text-sm mb-5">Manage your patient list</p>
                <button className="w-full p-2.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-md cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)] block">View Patients</button>
              </div>

              <div className="bg-white rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] block">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-[#333] my-4 text-lg font-bold">Reports</h3>
                <p className="text-[#666] text-sm mb-5">View your activity reports</p>
                <button className="w-full p-2.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-md cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)] block">View Reports</button>
              </div>

              <div className="bg-white rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] block">
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-[#333] my-4 text-lg font-bold">Profile Settings</h3>
                <p className="text-[#666] text-sm mb-5">Update your profile information</p>
                <button className="w-full p-2.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-md cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)] block">Edit Profile</button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] block">
                <div className="text-5xl mb-4">🏥</div>
                <h3 className="text-[#333] my-4 text-lg font-bold">Find Doctor</h3>
                <p className="text-[#666] text-sm mb-5">Search and book appointments with doctors</p>
                <button className="w-full p-2.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-md cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)] block">Find Doctor</button>
              </div>

              <div className="bg-white rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] block">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-[#333] my-4 text-lg font-bold">My Appointments</h3>
                <p className="text-[#666] text-sm mb-5">View your scheduled appointments</p>
                <button className="w-full p-2.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-md cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)] block">View Appointments</button>
              </div>

              <div className="bg-white rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] block">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-[#333] my-4 text-lg font-bold">Medical History</h3>
                <p className="text-[#666] text-sm mb-5">Access your medical records</p>
                <button className="w-full p-2.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-md cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)] block">View History</button>
              </div>

              <div className="bg-white rounded-xl p-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)] block">
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-[#333] my-4 text-lg font-bold">Profile Settings</h3>
                <p className="text-[#666] text-sm mb-5">Update your profile information</p>
                <button className="w-full p-2.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-md cursor-pointer font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_15px_rgba(102,126,234,0.3)] block">Edit Profile</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
