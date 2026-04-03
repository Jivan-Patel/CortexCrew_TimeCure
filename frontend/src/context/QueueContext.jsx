import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { predictPatient, checkMLHealth } from '../services/mlService';

const QueueContext = createContext();
export const useQueue = () => useContext(QueueContext);

const INITIAL_QUEUE = [
  { id: 1, name: 'Emma Watson', age: 32, gender: 0, hypertension: 0, diabetes: 0, sms_received: true, type: 'booked', status: 'in-progress', noShowProb: 0.05, predictedTime: 16, waitTime: 0, sms_strategy: 'low_risk', startTime: Date.now() },
  { id: 2, name: 'James Smith', age: 55, gender: 1, hypertension: 1, diabetes: 0, sms_received: false, type: 'walk-in', status: 'arrived', noShowProb: 0.28, predictedTime: 22, waitTime: 16, sms_strategy: 'medium_risk' },
  { id: 3, name: 'Olivia Brown', age: 71, gender: 0, hypertension: 1, diabetes: 1, sms_received: false, type: 'booked', status: 'waiting', noShowProb: 0.48, predictedTime: 29, waitTime: 38, sms_strategy: 'high_risk' },
  { id: 4, name: 'Liam Johnson', age: 28, gender: 1, hypertension: 0, diabetes: 0, sms_received: true, type: 'booked', status: 'waiting', noShowProb: 0.08, predictedTime: 14, waitTime: 67, sms_strategy: 'low_risk' },
];

const recalcWaitTimes = (q) => {
  let accumulated = 0;
  return q.map((p) => {
    const w = p.status === 'in-progress' || p.status === 'no-show' || p.status === 'done' ? 0 : accumulated;
    if (p.status !== 'no-show' && p.status !== 'done') accumulated += p.predictedTime;
    return { ...p, waitTime: w };
  });
};

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState(recalcWaitTimes(INITIAL_QUEUE));
  const [mlOnline, setMlOnline] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  // Check ML health on mount
  useEffect(() => {
    checkMLHealth().then(setMlOnline);
    const interval = setInterval(() => checkMLHealth().then(setMlOnline), 10000);
    return () => clearInterval(interval);
  }, []);

  const bookPatient = useCallback(async (formData) => {
    setIsPredicting(true);
    const result = await predictPatient({ ...formData, sms_received: 0 });
    setIsPredicting(false);

    // _dryRun = just return prediction, don't add to queue
    if (formData._dryRun) return result;

    const newPatient = {
      id: Date.now(),
      name: formData.name,
      age: formData.age,
      gender: formData.gender || 0,
      hypertension: formData.hypertension ? 1 : 0,
      diabetes: formData.diabetes ? 1 : 0,
      sms_received: false,
      type: 'booked',
      status: 'waiting',
      noShowProb: result.no_show_probability,
      predictedTime: result.estimated_time,
      waitTime: 0,
      sms_strategy: result.sms_strategy,
    };

    setQueue(prev => recalcWaitTimes([...prev, newPatient]));
    return result;
  }, []);

  const addWalkIn = useCallback(async (name, age = 30) => {
    setIsPredicting(true);
    const result = await predictPatient({ age, sms_received: 0 });
    setIsPredicting(false);

    const newPatient = {
      id: Date.now(),
      name,
      age,
      sms_received: false,
      type: 'walk-in',
      status: 'arrived',
      noShowProb: result.no_show_probability,
      predictedTime: result.estimated_time,
      waitTime: 0,
      sms_strategy: result.sms_strategy,
    };

    setQueue(prev => {
      const q = [...prev];
      let insertIndex = q.findIndex(p => p.status !== 'in-progress');
      if (insertIndex === -1) insertIndex = q.length;
      q.splice(insertIndex, 0, newPatient);
      return recalcWaitTimes(q);
    });
  }, []);

  const updateStatus = useCallback((id, newStatus) => {
    setQueue(prev => {
      let q = [...prev];
      if (newStatus === 'late') {
        const idx = q.findIndex(p => p.id === id);
        if (idx !== -1) {
          const [patient] = q.splice(idx, 1);
          patient.status = 'waiting';
          let insertAt = q.findIndex(p => p.status !== 'in-progress');
          if (insertAt === -1) insertAt = q.length;
          q.splice(insertAt + 1, 0, patient);
        }
      } else {
        q = q.map(p => p.id === id
          ? { ...p, status: newStatus, ...(newStatus === 'in-progress' ? { startTime: Date.now() } : {}), ...(newStatus === 'done' ? { endTime: Date.now() } : {}) }
          : p
        );
      }
      return recalcWaitTimes(q);
    });
  }, []);

  const sendSMS = useCallback(async (id) => {
    const patient = queue.find(p => p.id === id);
    if (!patient) return;

    const result = await predictPatient({ ...patient, sms_received: 1 });

    setQueue(prev => recalcWaitTimes(
      prev.map(p => p.id === id
        ? { ...p, sms_received: true, noShowProb: result.no_show_probability, sms_strategy: result.sms_strategy }
        : p
      )
    ));
  }, [queue]);

  return (
    <QueueContext.Provider value={{ queue, mlOnline, isPredicting, bookPatient, addWalkIn, updateStatus, sendSMS }}>
      {children}
    </QueueContext.Provider>
  );
};
