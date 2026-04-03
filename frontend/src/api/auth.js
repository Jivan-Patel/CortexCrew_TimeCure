import axios from 'axios';

const API_BASE_URL = '/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (username, email, password, role) => {
    try {
      const response = await api.post('/register', {
        username,
        email,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/get-me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  logout: async () => {
    try {
      await api.get('/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  verifyEmail: async (email, otp) => {
    try {
      const response = await api.post('/verify-email', {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Email verification failed' };
    }
  },
};

export default authAPI;
