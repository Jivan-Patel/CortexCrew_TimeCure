/**
 * useAuth — JWT auth context
 * 
 * JWT payload structure from backend:
 *   { id, role: 'patient'|'receptionist'|'doctor', sessionId }
 * 
 * All API calls go through Vite proxy:
 *   POST /api/auth/login      → localhost:3000/api/auth/login
 *   POST /api/auth/register   → localhost:3000/api/auth/register
 *   GET  /api/auth/logout     → localhost:3000/api/auth/logout
 *   GET  /api/auth/get-me     → localhost:3000/api/auth/get-me
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthCtx = createContext({
  user: null, token: null, role: null,
  isLoggedIn: false, loading: true,
  login: async () => {}, register: async () => {}, logout: async () => {},
});

export const useAuth = () => useContext(AuthCtx);

// Decode JWT payload without a library (just base64 decode the claims)
function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Auto-refresh access token using the httpOnly refresh cookie
async function refreshAccessToken() {
  try {
    const res = await fetch('/api/auth/refresh-token', { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('tc-token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('tc-user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const role = token ? (decodeJwt(token)?.role ?? null) : null;
  const isLoggedIn = Boolean(token && user);

  // On mount: if we have a stale token, try to refresh silently
  useEffect(() => {
    const init = async () => {
      if (token) {
        const decoded = decodeJwt(token);
        // If token expired, try refresh
        if (decoded && decoded.exp * 1000 < Date.now()) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            setToken(newToken);
            sessionStorage.setItem('tc-token', newToken);
          } else {
            // Refresh also failed — clear everything
            setToken(null); setUser(null);
            sessionStorage.clear();
          }
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setToken(data.accessToken);
    setUser(data.user);
    sessionStorage.setItem('tc-token', data.accessToken);
    sessionStorage.setItem('tc-user', JSON.stringify(data.user));
    return data;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    setToken(data.accessToken);
    setUser(data.user);
    sessionStorage.setItem('tc-token', data.accessToken);
    sessionStorage.setItem('tc-user', JSON.stringify(data.user));
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { credentials: 'include' });
    } catch { /* ignore */ }
    setToken(null); setUser(null);
    sessionStorage.clear();
  }, []);

  return (
    <AuthCtx.Provider value={{ user, token, role, isLoggedIn, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
