from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
import os
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

# ──────────────────────────────────────────────
# Feature lists (must match train_model.py exactly)
# ──────────────────────────────────────────────
# SMS_received is included in no-show prediction:
# patients who got an SMS reminder have higher show-up rates
FEATURES_NOSHOW = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship', 'SMS_received']

# SMS doesn't affect how long a consultation takes
FEATURES_TIME   = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship']

# ──────────────────────────────────────────────
# Model Loading
# ──────────────────────────────────────────────
MODEL_DIR = "ml" if os.path.basename(os.getcwd()) != "ml" else "."
<<<<<<< theme-refactor
FEATURES_TIME = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship']
FEATURES_NO_SHOW = FEATURES_TIME + ['SMS_received']
=======
>>>>>>> main

no_show_path = os.path.join(MODEL_DIR, "no_show.pkl")
time_path    = os.path.join(MODEL_DIR, "time.pkl")

if os.path.exists(no_show_path) and os.path.exists(time_path):
    with open(no_show_path, "rb") as f:
        model_no_show = pickle.load(f)
    with open(time_path, "rb") as f:
        model_time = pickle.load(f)
    print("✅ Models loaded successfully.")
else:
    print(f"⚠️  Models not found in '{MODEL_DIR}/'. Run train_model.py first.")
    model_no_show = None
    model_time = None


# ──────────────────────────────────────────────
# /predict  POST endpoint
# ──────────────────────────────────────────────
# Expected JSON from backend:
# {
#   "Age": 30,
#   "Gender": 0,           0=Female, 1=Male
#   "Hipertension": 0,
#   "Diabetes": 0,
#   "Alcoholism": 0,
#   "Handcap": 0,
#   "Scholarship": 0,
#   "SMS_received": 0      0=not sent yet, 1=SMS already sent
# }
#
# Response:
# {
#   "no_show_probability": 0.3,
#   "estimated_time": 15.0,
#   "status": "success"
# }
#
# 📌 SMS FLOW EXPLANATION:
#   - On BOOKING:   call /predict with SMS_received=0  → get initial risk
#   - After SMS:    call /predict with SMS_received=1  → get updated (lower) risk
#   - The backend decides WHEN to send SMS based on no_show_probability:
#       > 0.4  → HIGH RISK   → send SMS 24h before + 2h before appointment
#       > 0.2  → MEDIUM RISK → send SMS 24h before appointment
#       ≤ 0.2  → LOW RISK   → no SMS needed
@app.route('/predict', methods=['POST'])
def predict():
    if model_no_show is None or model_time is None:
        return jsonify({"error": "Models not loaded. Run train_model.py first."}), 500

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON body provided."}), 400

<<<<<<< theme-refactor
        # Build feature row — fall back to 0 for missing values
        row = {}
        for feat in FEATURES_NO_SHOW:
            val = data.get(feat)
            if val is None:
                val = data.get(feat.lower(), 0)
            row[feat] = val

        # Use DataFrame so scikit-learn doesn't warn about feature names
        input_df_show = pd.DataFrame([row], columns=FEATURES_NO_SHOW)
        
        row_time = {f: row[f] for f in FEATURES_TIME}
        input_df_time = pd.DataFrame([row_time], columns=FEATURES_TIME)

        # 1. No-Show Probability
        #    model returns P(Show=1), so P(No-show) = 1 - P(Show)
        show_prob    = model_no_show.predict_proba(input_df_show)[0][1]
=======
        def get_val(key, default=0):
            """Get value, trying original casing and lowercase fallback."""
            return data.get(key, data.get(key.lower(), default))

        # ── No-Show features (includes SMS_received) ──
        noshow_row = {
            'Age':          get_val('Age'),
            'Gender':       get_val('Gender'),
            'Hipertension': get_val('Hipertension'),
            'Diabetes':     get_val('Diabetes'),
            'Alcoholism':   get_val('Alcoholism'),
            'Handcap':      get_val('Handcap'),
            'Scholarship':  get_val('Scholarship'),
            'SMS_received': get_val('SMS_received', 0)   # default 0 = not sent yet
        }

        # ── Time features (no SMS) ──
        time_row = {k: noshow_row[k] for k in FEATURES_TIME}

        noshow_df = pd.DataFrame([noshow_row], columns=FEATURES_NOSHOW)
        time_df   = pd.DataFrame([time_row],   columns=FEATURES_TIME)

        # 1. No-Show Probability
        show_prob    = model_no_show.predict_proba(noshow_df)[0][1]
>>>>>>> main
        no_show_prob = round(1 - show_prob, 2)
        
        sms_strategy = "low_risk"
        if no_show_prob > 0.4:
            sms_strategy = "high_risk"
        elif no_show_prob > 0.2:
            sms_strategy = "medium_risk"

<<<<<<< theme-refactor
        # 2. Consultation Time (minutes)
        estimated_time = round(float(model_time.predict(input_df_time)[0]), 1)

        return jsonify({
            "no_show_probability": no_show_prob,
            "estimated_time": estimated_time,
            "sms_strategy": sms_strategy,
            "status": "success"
=======
        # 2. Consultation Time
        estimated_time = round(float(model_time.predict(time_df)[0]), 1)

        # 3. SMS recommendation — backend uses this to decide when/if to send
        if no_show_prob > 0.4:
            sms_strategy = "high_risk"      # send SMS 24h before + 2h before
        elif no_show_prob > 0.2:
            sms_strategy = "medium_risk"    # send SMS 24h before only
        else:
            sms_strategy = "low_risk"       # no SMS needed

        return jsonify({
            "no_show_probability": no_show_prob,
            "estimated_time":      estimated_time,
            "sms_strategy":        sms_strategy,
            "status":              "success"
>>>>>>> main
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ──────────────────────────────────────────────
# /health  GET
# ──────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status":        "ok",
        "models_loaded": model_no_show is not None and model_time is not None
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
