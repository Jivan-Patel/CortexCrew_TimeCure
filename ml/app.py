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
FEATURES_TIME = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship']
FEATURES_NOSHOW = FEATURES_TIME + ['SMS_received']

# ──────────────────────────────────────────────
# Model Loading
# ──────────────────────────────────────────────
MODEL_DIR = "ml" if os.path.basename(os.getcwd()) != "ml" else "."

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

@app.route('/predict', methods=['POST'])
def predict():
    if model_no_show is None or model_time is None:
        return jsonify({"error": "Models not loaded. Run train_model.py first."}), 500

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON body provided."}), 400

        def get_val(key, default=0):
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
            'SMS_received': get_val('SMS_received', 0)
        }

        # ── Time features (no SMS) ──
        time_row = {k: noshow_row[k] for k in FEATURES_TIME}

        noshow_df = pd.DataFrame([noshow_row], columns=FEATURES_NOSHOW)
        time_df   = pd.DataFrame([time_row],   columns=FEATURES_TIME)

        # 1. No-Show Probability
        show_prob    = model_no_show.predict_proba(noshow_df)[0][1]
        no_show_prob = round(1 - show_prob, 2)
        
        # 2. Consultation Time
        estimated_time = round(float(model_time.predict(time_df)[0]), 1)

        # 3. SMS Recommendation logic
        sms_strategy = "low_risk"
        if no_show_prob > 0.4:
            sms_strategy = "high_risk"
        elif no_show_prob > 0.2:
            sms_strategy = "medium_risk"

        return jsonify({
            "no_show_probability": no_show_prob,
            "estimated_time":      estimated_time,
            "sms_strategy":        sms_strategy,
            "status":              "success"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status":        "ok",
        "models_loaded": model_no_show is not None and model_time is not None
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
