"""
run_full_test.py — Boots Flask in a background thread, then runs the full test suite.
Usage: python ml/run_full_test.py   (from project root)
       python run_full_test.py      (from inside the ml/ folder)
"""
import sys, os, time, threading, json, urllib.request, urllib.error

# ── Path setup so imports work from either cwd ──────────────────
ML_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT   = os.path.dirname(ML_DIR)
if os.path.basename(os.getcwd()) != "ml":
    os.chdir(ROOT)          # ensure working dir is project root

sys.path.insert(0, ML_DIR)

# ── Boot Flask in a daemon thread ───────────────────────────────
import app as flask_app

server_thread = threading.Thread(
    target=lambda: flask_app.app.run(host="127.0.0.1", port=5000, debug=False, use_reloader=False),
    daemon=True
)
server_thread.start()

# Wait until /health responds (up to 30 s)
BASE = "http://127.0.0.1:5000"
print("Waiting for Flask server to start", end="", flush=True)
for _ in range(30):
    try:
        with urllib.request.urlopen(f"{BASE}/health", timeout=2) as r:
            h = json.loads(r.read())
            print(f"\n✅ Server up | models_loaded={h['models_loaded']}")
            break
    except Exception:
        print(".", end="", flush=True)
        time.sleep(1)
else:
    print("\n❌ Server failed to start in 30 s. Aborting.")
    sys.exit(1)

# ── Test cases ───────────────────────────────────────────────────
TEST_CASES = [
    {
        "label": "Young healthy patient — NO SMS sent yet",
        "data":  {"Age":30,"Gender":0,"Hipertension":0,"Diabetes":0,"Alcoholism":0,"Handcap":0,"Scholarship":0,"SMS_received":0}
    },
    {
        "label": "Same patient — AFTER SMS was sent",
        "data":  {"Age":30,"Gender":0,"Hipertension":0,"Diabetes":0,"Alcoholism":0,"Handcap":0,"Scholarship":0,"SMS_received":1}
    },
    {
        "label": "Elderly diabetic male — NO SMS",
        "data":  {"Age":72,"Gender":1,"Hipertension":1,"Diabetes":1,"Alcoholism":0,"Handcap":0,"Scholarship":0,"SMS_received":0}
    },
    {
        "label": "Elderly diabetic male — AFTER SMS",
        "data":  {"Age":72,"Gender":1,"Hipertension":1,"Diabetes":1,"Alcoholism":0,"Handcap":0,"Scholarship":0,"SMS_received":1}
    },
    {
        "label": "Scholarship patient with alcoholism — NO SMS",
        "data":  {"Age":45,"Gender":1,"Hipertension":0,"Diabetes":0,"Alcoholism":1,"Handcap":0,"Scholarship":1,"SMS_received":0}
    },
]

SMS_LABELS = {
    "high_risk":   "🔴 HIGH   → send SMS 24h + 2h before",
    "medium_risk": "🟡 MEDIUM → send SMS 24h before only",
    "low_risk":    "🟢 LOW    → no SMS needed",
}

print("\n" + "="*65)
print("  TimeCure ML — Full Integration Test")
print("="*65)

all_passed = True
for i, case in enumerate(TEST_CASES, 1):
    body = json.dumps(case["data"]).encode()
    req  = urllib.request.Request(f"{BASE}/predict", data=body,
                                  headers={"Content-Type":"application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            result = json.loads(r.read())
    except Exception as e:
        print(f"\n  Test {i}: {case['label']}")
        print(f"  ❌ Request failed: {e}")
        all_passed = False
        continue

    if "error" in result:
        print(f"\n  Test {i}: {case['label']}")
        print(f"  ❌ API error: {result['error']}")
        all_passed = False
        continue

    prob  = result["no_show_probability"]
    mins  = result["estimated_time"]
    strat = result.get("sms_strategy", "?")
    status = result.get("status", "?")

    ok = status == "success" and isinstance(prob, float) and isinstance(mins, float)
    tag = "✅" if ok else "❌"
    if not ok:
        all_passed = False

    print(f"\n  Test {i} {tag}: {case['label']}")
    print(f"    No-show probability : {prob}")
    print(f"    Estimated time      : {mins} min")
    print(f"    SMS strategy        : {SMS_LABELS.get(strat, strat)}")
    print(f"    Status              : {status}")

print("\n" + "="*65)
if all_passed:
    print("  ✅  ALL TESTS PASSED — ML pipeline is working perfectly!")
else:
    print("  ❌  SOME TESTS FAILED — check errors above.")
print("="*65)

sys.exit(0 if all_passed else 1)
