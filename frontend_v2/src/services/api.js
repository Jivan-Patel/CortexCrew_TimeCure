import axios from 'axios';

// 🌐 Live Deployment URLs
const AUTH_BASE_URL = 'https://cortexcrew-timecure-2.onrender.com';   // backend (auth)
const QUEUE_BASE_URL = 'https://cortexcrew-timecure-1.onrender.com';  // TimeCure-backend (queue)

export const authService = {
  login: async (email, password) => {
    // 🔐 Real Connection to Auth Server (Live)
    const res = await axios.post(`${AUTH_BASE_URL}/api/auth/login`, { email, password });
    return res.data;
  },
  
  register: async (username, email, password, role) => {
    // 🔐 Real Connection to Auth Server (Live)
    const res = await axios.post(`${AUTH_BASE_URL}/api/auth/register`, { username, email, password, role });
    return res.data;
  },
  
  checkAdmin: async () => {
    const res = await axios.get(`${AUTH_BASE_URL}/api/auth/has-admin`);
    return res.data.hasAdmin;
  }
};

export const queueService = {
  book: async (payload) => {
    const res = await axios.post(`${QUEUE_BASE_URL}/book`, payload);
    return res.data;
  },
  getQueue: async () => {
    try {
      const res = await axios.get(`${QUEUE_BASE_URL}/queue`);
      return res.data;
    } catch { return []; } 
  },
  start: async (id) => axios.post(`${QUEUE_BASE_URL}/start/${id}`),
  end: async (id) => axios.post(`${QUEUE_BASE_URL}/end/${id}`),
  noShow: async (id) => axios.post(`${QUEUE_BASE_URL}/no-show/${id}`),
  triggerSms: async (id, type = 'normal') => axios.post(`${QUEUE_BASE_URL}/trigger-sms/${id}`, { type })
};
