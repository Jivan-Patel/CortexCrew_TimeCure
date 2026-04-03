import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RoleSelector } from '../components/RoleSelector';
import authAPI from '../api/auth';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] px-10 py-12 w-full max-w-[450px] animate-[slideIn_0.5s_ease-out]">
          <h2 className="text-center text-[#333] mb-2.5 text-3xl font-semibold">Verify Email</h2>
          <p className="text-center text-[#666] mb-7 text-sm">
            We've sent a verification code to <strong>{registeredEmail}</strong>
          </p>

          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <input
                id="otpInput"
                type="text"
                placeholder="Enter OTP (6 digits)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors box-border focus:outline-none focus:border-[#667eea] focus:ring-[3px] focus:ring-[#667eea]/10"
              />
            </div>

            {error && <div className="bg-[#fee] text-[#c33] px-4 py-3 rounded-lg mb-4 text-sm border-l-4 border-[#c33]">{error}</div>}

            <button type="submit" className="w-full p-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all mt-2.5 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(102,126,234,0.3)] disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <p className="text-center mt-5 text-[#666] text-sm">
            Didn't receive code?{' '}
            <button
              type="button"
              onClick={() => setShowOtpForm(false)}
              className="bg-transparent border-none text-[#667eea] cursor-pointer font-semibold no-underline p-0 transition-colors hover:text-[#764ba2] hover:underline"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] px-10 py-12 w-full max-w-[450px] animate-[slideIn_0.5s_ease-out]">
        <h2 className="text-center text-[#333] mb-2.5 text-3xl font-semibold">Create Your Account</h2>
        <p className="text-center text-[#666] mb-7 text-sm">Join TimeCure - Bridging Care and Time</p>

        <form onSubmit={handleSubmit}>
          <RoleSelector
            selectedRole={formData.role}
            onRoleChange={handleRoleChange}
          />

          <div className="mb-4">
            <label className="block mb-2 text-[#333] font-semibold text-sm">Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors box-border focus:outline-none focus:border-[#667eea] focus:ring-[3px] focus:ring-[#667eea]/10"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-[#333] font-semibold text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors box-border focus:outline-none focus:border-[#667eea] focus:ring-[3px] focus:ring-[#667eea]/10"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-[#333] font-semibold text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors box-border focus:outline-none focus:border-[#667eea] focus:ring-[3px] focus:ring-[#667eea]/10"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-[#333] font-semibold text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors box-border focus:outline-none focus:border-[#667eea] focus:ring-[3px] focus:ring-[#667eea]/10"
            />
          </div>

          {error && <div className="bg-[#fee] text-[#c33] px-4 py-3 rounded-lg mb-4 text-sm border-l-4 border-[#c33]">{error}</div>}

          <button type="submit" className="w-full p-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all mt-2.5 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(102,126,234,0.3)] disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-5 text-[#666] text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#667eea] no-underline font-semibold transition-colors hover:text-[#764ba2] hover:underline">
            Login
          </Link>
        </p>
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
