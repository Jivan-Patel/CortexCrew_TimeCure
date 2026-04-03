from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
import os
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

# ──────────────────────────────────────────────
# Model Loading
# ──────────────────────────────────────────────
# Works whether you run from project root OR from ml/ folder
MODEL_DIR = "ml" if os.path.basename(os.getcwd()) != "ml" else "."
FEATURES_TIME = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship']
FEATURES_NO_SHOW = FEATURES_TIME + ['SMS_received']

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
# Expected JSON body from the backend:
# {
#   "Age": 30,
#   "Gender": 0,          # 0 = Female, 1 = Male
#   "Hipertension": 0,    # 1 = yes
#   "Diabetes": 0,        # 1 = yes
#   "Alcoholism": 0,      # 1 = yes
#   "Handcap": 0,         # 1 = yes
#   "Scholarship": 0      # 1 = govt welfare
# }
#
# Response:
# {
#   "no_show_probability": 0.3,   # 0 = No-show, 1 = Show  (README format)
#   "estimated_time": 15.0,       # minutes
#   "status": "success"
# }
@app.route('/predict', methods=['POST'])
def predict():
    if model_no_show is None or model_time is None:
        return jsonify({"error": "Models not loaded. Run train_model.py first."}), 500

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON body provided."}), 400

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
        no_show_prob = round(1 - show_prob, 2)
        
        sms_strategy = "low_risk"
        if no_show_prob > 0.4:
            sms_strategy = "high_risk"
        elif no_show_prob > 0.2:
            sms_strategy = "medium_risk"

        # 2. Consultation Time (minutes)
        estimated_time = round(float(model_time.predict(input_df_time)[0]), 1)

        return jsonify({
            "no_show_probability": no_show_prob,
            "estimated_time": estimated_time,
            "sms_strategy": sms_strategy,
            "status": "success"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ──────────────────────────────────────────────
# /health  GET endpoint  (quick liveness check)
# ──────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "models_loaded": model_no_show is not None and model_time is not None
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
