"""
test_model.py — Tests the ML API with SMS_received included
=============================================================

HOW TO RUN:
  1. Start Flask server (in a separate terminal):
       python ml/app.py

  2. Run this test:
       python ml/test_model.py
"""

import json
import urllib.request
import urllib.error

BASE_URL = "https://cortexcrew-timecure.onrender.com"

def call_predict(patient_data: dict) -> dict:
    body = json.dumps(patient_data).encode("utf-8")
    req  = urllib.request.Request(
        url     = f"{BASE_URL}/predict",
        data    = body,
        headers = {"Content-Type": "application/json"},
        method  = "POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.URLError:
        return {"error": "❌ Could not connect. Is 'python ml/app.py' running?"}

def call_health() -> dict:
    try:
        with urllib.request.urlopen(f"{BASE_URL}/health", timeout=5) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.URLError:
        return {"error": "❌ Server not reachable."}

# ──────────────────────────────────────────────────────────────
#  TEST SCENARIOS  (SMS_received = 0 means SMS not sent yet)
# ──────────────────────────────────────────────────────────────
TEST_CASES = [
    {
        "label": "Young healthy patient — NO SMS sent yet",
        "data": {
            "Age": 30, "Gender": 0, "Hipertension": 0, "Diabetes": 0,
            "Alcoholism": 0, "Handcap": 0, "Scholarship": 0, "SMS_received": 0
        }
    },
    {
        "label": "Same patient — AFTER SMS was sent",
        "data": {
            "Age": 30, "Gender": 0, "Hipertension": 0, "Diabetes": 0,
            "Alcoholism": 0, "Handcap": 0, "Scholarship": 0, "SMS_received": 1
        }
    },
    {
        "label": "Elderly diabetic male — NO SMS sent yet",
        "data": {
            "Age": 72, "Gender": 1, "Hipertension": 1, "Diabetes": 1,
            "Alcoholism": 0, "Handcap": 0, "Scholarship": 0, "SMS_received": 0
        }
    },
    {
        "label": "Elderly diabetic male — AFTER SMS was sent",
        "data": {
            "Age": 72, "Gender": 1, "Hipertension": 1, "Diabetes": 1,
            "Alcoholism": 0, "Handcap": 0, "Scholarship": 0, "SMS_received": 1
        }
    },
    {
        "label": "Scholarship patient with alcoholism — NO SMS",
        "data": {
            "Age": 45, "Gender": 1, "Hipertension": 0, "Diabetes": 0,
            "Alcoholism": 1, "Handcap": 0, "Scholarship": 1, "SMS_received": 0
        }
    },
]

SMS_STRATEGY_LABELS = {
    "high_risk":   "🔴 HIGH  → Send SMS 24h before + 2h before appointment",
    "medium_risk": "🟡 MED   → Send SMS 24h before appointment only",
    "low_risk":    "🟢 LOW   → No SMS needed",
}

if __name__ == "__main__":
    print("=" * 65)
    print("  TimeCure ML — Model Test Runner (with SMS_received)")
    print("=" * 65)

    print("\n[1/2] Checking server health...")
    health = call_health()
    if "error" in health:
        print(health["error"])
        raise SystemExit(1)
    print(f"  ✅  Status       : {health['status']}")
    print(f"  ✅  Models loaded: {health['models_loaded']}")

    print("\n[2/2] Running prediction tests...\n")

    for i, case in enumerate(TEST_CASES, 1):
        print(f"  Test {i}: {case['label']}")
        result = call_predict(case["data"])

        if "error" in result:
            print(f"  ❌ Error: {result['error']}\n")
        else:
            prob     = result["no_show_probability"]
            time     = result["estimated_time"]
            strategy = result.get("sms_strategy", "unknown")

            print(f"  No-show prob    : {prob}")
            print(f"  Estimated time  : {time} minutes")
            print(f"  SMS strategy    : {SMS_STRATEGY_LABELS.get(strategy, strategy)}")
        print()

    print("=" * 65)
    print("  ✅  SMS flow demo: compare Test 1 vs Test 2 (same patient)")
    print("      After SMS is sent → no_show_probability drops.")
    print("=" * 65)
