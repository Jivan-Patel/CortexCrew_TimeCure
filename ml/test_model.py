"""
test_model.py — Run this file to test the ML models
=====================================================

HOW TO RUN:
  1. Make sure Flask server is running (in a separate terminal):
       python ml/app.py

  2. Then run this test file:
       python ml/test_model.py

This will test 4 different patient scenarios and print results.
"""

import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:5000"

def call_predict(patient_data: dict) -> dict:
    """Send POST request to /predict and return parsed JSON."""
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
    """GET /health to check server is alive."""
    try:
        with urllib.request.urlopen(f"{BASE_URL}/health", timeout=5) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.URLError:
        return {"error": "❌ Server not reachable. Start it with: python ml/app.py"}

# ──────────────────────────────────────────────────────────────
#  TEST SCENARIOS
# ──────────────────────────────────────────────────────────────
TEST_CASES = [
    {
        "label": "Young healthy patient (30F, no conditions)",
        "data": {
            "Age":         30,
            "Gender":       0,   # 0 = Female
            "Hipertension": 0,
            "Diabetes":     0,
            "Alcoholism":   0,
            "Handcap":      0,
            "Scholarship":  0
        }
    },
    {
        "label": "Elderly patient with multiple conditions (72M, Hypertension + Diabetes)",
        "data": {
            "Age":         72,
            "Gender":       1,   # 1 = Male
            "Hipertension": 1,
            "Diabetes":     1,
            "Alcoholism":   0,
            "Handcap":      0,
            "Scholarship":  0
        }
    },
    {
        "label": "Middle-aged patient on scholarship + alcoholism (45M)",
        "data": {
            "Age":         45,
            "Gender":       1,
            "Hipertension": 0,
            "Diabetes":     0,
            "Alcoholism":   1,
            "Handcap":      0,
            "Scholarship":  1
        }
    },
    {
        "label": "Handicapped elderly patient (80F, all conditions)",
        "data": {
            "Age":         80,
            "Gender":       0,
            "Hipertension": 1,
            "Diabetes":     1,
            "Alcoholism":   0,
            "Handcap":      1,
            "Scholarship":  1
        }
    }
]

# ──────────────────────────────────────────────────────────────
#  MAIN
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":

    print("=" * 60)
    print("  TimeCure ML — Model Test Runner")
    print("=" * 60)

    # Step 1: Health check
    print("\n[1/2] Checking server health...")
    health = call_health()
    if "error" in health:
        print(health["error"])
        raise SystemExit(1)
    print(f"  ✅  Status      : {health['status']}")
    print(f"  ✅  Models loaded: {health['models_loaded']}")

    # Step 2: Run predictions
    print("\n[2/2] Running prediction tests...\n")

    for i, case in enumerate(TEST_CASES, 1):
        print(f"  Test {i}: {case['label']}")
        print(f"  Input  : {case['data']}")

        result = call_predict(case["data"])

        if "error" in result:
            print(f"  ❌ Error: {result['error']}\n")
        else:
            prob = result["no_show_probability"]
            time = result["estimated_time"]
            risk = "🔴 HIGH RISK" if prob > 0.4 else ("🟡 MEDIUM" if prob > 0.2 else "🟢 LOW RISK")

            print(f"  Output :")
            print(f"    No-show probability : {prob}  {risk}")
            print(f"    Estimated time      : {time} minutes")
        print()

    print("=" * 60)
    print("  All tests done. Your ML service is working correctly.")
    print("=" * 60)
