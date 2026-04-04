import axios from 'axios';

export const authService = {
  login: async (email, password) => {
    // 🔐 Real Connection to Auth Server (Port 3000)
    const res = await axios.post('/api/auth/login', { email, password });
    return res.data;
  },
  
  register: async (username, email, password, role) => {
    // 🔐 Real Connection to Auth Server (Port 3000)
    const res = await axios.post('/api/auth/register', { username, email, password, role });
    return res.data;
  },
  
  checkAdmin: async () => {
    const res = await axios.get('/api/auth/has-admin');
    return res.data.hasAdmin;
  }
};

export const queueService = {
  book: async (payload) => {
    const res = await axios.post('/api/queue/book', payload);
    return res.data;
  },
  getQueue: async () => {
    try {
      const res = await axios.get('/api/queue/queue');
      return res.data;
    } catch { return []; } 
  },
  start: async (id) => axios.post(`/api/queue/start/${id}`),
  end: async (id) => axios.post(`/api/queue/end/${id}`),
  noShow: async (id) => axios.post(`/api/queue/no-show/${id}`)
};
