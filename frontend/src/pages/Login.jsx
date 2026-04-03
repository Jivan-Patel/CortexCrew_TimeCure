import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authAPI from '../api/auth';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData.email, formData.password);

      if (response.user) {
        // Store user info if needed
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 font-sans">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] px-10 py-12 w-full max-w-[450px] animate-[slideIn_0.5s_ease-out]">
        <h2 className="text-center text-[#333] mb-2.5 text-3xl font-semibold">Welcome Back</h2>
        <p className="text-center text-[#666] mb-7 text-sm">Login to Your TimeCure Account</p>

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors box-border focus:outline-none focus:border-[#667eea] focus:ring-[3px] focus:ring-[#667eea]/10"
            />
          </div>

          {error && <div className="bg-[#fee] text-[#c33] px-4 py-3 rounded-lg mb-4 text-sm border-l-4 border-[#c33]">{error}</div>}

          <button type="submit" className="w-full p-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all mt-2.5 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(102,126,234,0.3)] disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center my-5">
          <Link to="/forgot-password" className="text-[#667eea] no-underline font-semibold transition-colors hover:text-[#764ba2] hover:underline">
            Forgot Password?
          </Link>
        </div>

        <p className="text-center mt-5 text-[#666] text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#667eea] no-underline font-semibold transition-colors hover:text-[#764ba2] hover:underline">
            Sign Up
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
