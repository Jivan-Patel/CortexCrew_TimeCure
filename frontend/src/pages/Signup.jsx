import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RoleSelector } from '../components/RoleSelector';
import authAPI from '../api/auth';
import './Auth.css';

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(
        formData.username,
        formData.email,
        formData.password,
        formData.role
      );

      setRegisteredEmail(formData.email);
      setShowOtpForm(true);
      // Auto-focus to OTP input
      setTimeout(() => {
        document.getElementById('otpInput')?.focus();
      }, 0);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyEmail(registeredEmail, otp);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (showOtpForm) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Verify Email</h2>
          <p className="email-text">
            We've sent a verification code to <strong>{registeredEmail}</strong>
          </p>

          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <input
                id="otpInput"
                type="text"
                placeholder="Enter OTP (6 digits)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <p className="switch-auth">
            Didn't receive code?{' '}
            <button
              type="button"
              onClick={() => setShowOtpForm(false)}
              className="link-btn"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join TimeCure - Bridging Care and Time</p>

        <form onSubmit={handleSubmit}>
          <RoleSelector
            selectedRole={formData.role}
            onRoleChange={handleRoleChange}
          />

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
