/**
 * useQueue — Live queue polling hook
 * Polls /api/queue (→ localhost:4000/queue) every 30 seconds.
 * Falls back to mock data if backend is unreachable.
 * Also exposes cumulative wait time calculation (Step 3 math).
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const POLL_INTERVAL = 30_000; // 30 seconds

// Mock fallback so the UI is never broken when backend is down
const MOCK_QUEUE = [
  { id: 1, name: 'Prathvik M.', status: 'in-progress', predictedTime: 18, waitTime: 0, noShowProb: 0.08, smsStrategy: 'low_risk' },
  { id: 2, name: 'Riya Shah', status: 'waiting', predictedTime: 14, waitTime: 18, noShowProb: 0.22, smsStrategy: 'medium_risk' },
  { id: 3, name: 'Arjun Nair', status: 'waiting', predictedTime: 20, waitTime: 32, noShowProb: 0.45, smsStrategy: 'high_risk' },
  { id: 4, name: 'Sneha Patel', status: 'waiting', predictedTime: 12, waitTime: 52, noShowProb: 0.1, smsStrategy: 'low_risk' },
];

const MOCK_STATS = { waiting: 3, inProgress: 1, done: 4, arrived: 1, missing: 0, total: 9 };

export function useQueue() {
  const { token } = useAuth();
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [stats, setStats] = useState(MOCK_STATS);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchQueue = useCallback(async () => {
    try {
      const [qRes, sRes] = await Promise.all([
        fetch('/api/queue/queue', { headers: authHeaders, credentials: 'include' }),
        fetch('/api/queue/stats', { headers: authHeaders, credentials: 'include' }),
      ]);
      if (!qRes.ok) throw new Error(`Queue responded ${qRes.status}`);
      const [qData, sData] = await Promise.all([qRes.json(), sRes.ok ? sRes.json() : MOCK_STATS]);
      setQueue(qData);
      setStats(typeof sData === 'object' ? sData : MOCK_STATS);
      setIsLive(true);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      // Backend down → keep showing mock data, mark as offline
      setIsLive(false);
      setError(err.message);
    }
  }, [token]);

  // Initial fetch + polling
  useEffect(() => {
    fetchQueue();
    const id = setInterval(fetchQueue, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchQueue]);

  // Cumulative wait time for current user (Step 3 math)
  const myWaitTime = useCallback((myPosition) => {
    let time = 0;
    for (let i = 0; i < myPosition; i++) {
      const p = queue[i];
      if (p && p.status !== 'no-show' && p.status !== 'done') {
        time += p.predictedTime || 0;
      }
    }
    return time;
  }, [queue]);

  return { queue, stats, isLive, lastUpdated, error, refresh: fetchQueue, myWaitTime };
}
