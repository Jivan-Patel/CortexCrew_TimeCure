import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/auth';
import './Dashboard.css';

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
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const userRole = user?.username ? 'patient' : user?.role;
  const isDoctor = userRole === 'doctor';

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🏥 TimeCure</h1>
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.username}</span>
          <span className={`role-badge ${isDoctor ? 'doctor' : 'patient'}`}>
            {isDoctor ? '👨‍⚕️ Doctor' : '👤 Patient'}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user?.username}! 👋</h2>
          <p>
            {isDoctor
              ? 'Welcome to your doctor dashboard'
              : 'Welcome to your patient dashboard'}
          </p>
        </div>

        <div className="dashboard-cards">
          {isDoctor ? (
            <>
              <div className="card">
                <div className="card-icon">📋</div>
                <h3>My Appointments</h3>
                <p>View and manage your appointments</p>
                <button className="card-btn">View Appointments</button>
              </div>

              <div className="card">
                <div className="card-icon">👥</div>
                <h3>My Patients</h3>
                <p>Manage your patient list</p>
                <button className="card-btn">View Patients</button>
              </div>

              <div className="card">
                <div className="card-icon">📊</div>
                <h3>Reports</h3>
                <p>View your activity reports</p>
                <button className="card-btn">View Reports</button>
              </div>

              <div className="card">
                <div className="card-icon">⚙️</div>
                <h3>Profile Settings</h3>
                <p>Update your profile information</p>
                <button className="card-btn">Edit Profile</button>
              </div>
            </>
          ) : (
            <>
              <div className="card">
                <div className="card-icon">🏥</div>
                <h3>Find Doctor</h3>
                <p>Search and book appointments with doctors</p>
                <button className="card-btn">Find Doctor</button>
              </div>

              <div className="card">
                <div className="card-icon">📅</div>
                <h3>My Appointments</h3>
                <p>View your scheduled appointments</p>
                <button className="card-btn">View Appointments</button>
              </div>

              <div className="card">
                <div className="card-icon">📋</div>
                <h3>Medical History</h3>
                <p>Access your medical records</p>
                <button className="card-btn">View History</button>
              </div>

              <div className="card">
                <div className="card-icon">⚙️</div>
                <h3>Profile Settings</h3>
                <p>Update your profile information</p>
                <button className="card-btn">Edit Profile</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
