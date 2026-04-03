const ML_API = 'http://localhost:5000';

/**
 * Calls the real Flask ML API at http://localhost:5000/predict
 * Falls back elegantly to a deterministic mock if the server is offline.
 */
export const predictPatient = async ({ age, gender = 0, hypertension = 0, diabetes = 0, alcoholism = 0, handcap = 0, scholarship = 0, sms_received = 0 }) => {
  const payload = {
    Age: parseInt(age) || 30,
    Gender: gender,
    Hipertension: hypertension ? 1 : 0,
    Diabetes: diabetes ? 1 : 0,
    Alcoholism: alcoholism ? 1 : 0,
    Handcap: handcap ? 1 : 0,
    Scholarship: scholarship ? 1 : 0,
    SMS_received: sms_received ? 1 : 0,
  };

  try {
    const resp = await fetch(`${ML_API}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });

    if (!resp.ok) throw new Error('API error');
    const data = await resp.json();
    return { ...data, source: 'live' };

  } catch (_err) {
    // ── Offline / mock fallback ──────────────────────────────────────────────
    const age_bonus = (payload.Age / 100) * 10;
    const health_bonus = (payload.Hipertension * 5) + (payload.Diabetes * 5) + (payload.Alcoholism * 3) + (payload.Handcap * 7);
    const estimated_time = Math.max(5, Math.round(15 + age_bonus + health_bonus));

    // Higher age + conditions → higher raw risk
    let base_risk = 0.15 + (payload.Hipertension * 0.08) + (payload.Diabetes * 0.07) + (payload.Age > 60 ? 0.1 : 0);
    if (sms_received) base_risk *= 0.45;   // SMS drops risk dramatically
    const no_show_probability = Math.min(0.95, parseFloat(base_risk.toFixed(2)));

    let sms_strategy = 'low_risk';
    if (no_show_probability > 0.4) sms_strategy = 'high_risk';
    else if (no_show_probability > 0.2) sms_strategy = 'medium_risk';

    return { no_show_probability, estimated_time, sms_strategy, status: 'success', source: 'mock' };
  }
};

export const checkMLHealth = async () => {
  try {
    const resp = await fetch(`${ML_API}/health`, { signal: AbortSignal.timeout(2000) });
    const data = await resp.json();
    return data.status === 'ok' && data.models_loaded;
  } catch {
    return false;
  }
};
