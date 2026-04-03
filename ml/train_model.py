import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, accuracy_score
import os

# Set seed for reproducibility
np.random.seed(42)

# Column names from the CSV:
# PatientId, AppointmentID, Gender, ScheduledDay, AppointmentDay, Age, Neighbourhood, Scholarship, Hipertension, Diabetes, Alcoholism, Handcap, SMS_received, No-show

<<<<<<< theme-refactor
# Define features used by both models
FEATURES_TIME = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship']
FEATURES_NO_SHOW = FEATURES_TIME + ['SMS_received']
=======
# Features for No-Show model — SMS_received is a strong predictor of whether patient shows up
FEATURES_NOSHOW = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship', 'SMS_received']

# Features for Time model — SMS has no effect on consultation duration
FEATURES_TIME   = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship']
>>>>>>> main

def main():
    # Load the dataset
    file_path = "ml/KaggleV2-May-2016.csv"
    if not os.path.exists(file_path):
        file_path = "KaggleV2-May-2016.csv"

    print(f"Reading dataset from {file_path}...")
    df = pd.read_csv(file_path)

    # Basic Preprocessing
    df['Gender'] = df['Gender'].map({'F': 0, 'M': 1})
    
    # ⏱️ 1. Consultation Time Prediction (Pseudo-Target Synthesis)
    # Since original data doesn't have it, we create a pseudo-target for simulation
    def get_time(row):
        base = 15
        age_bonus = (row['Age'] / 100) * 10
        health_bonus = (row['Hipertension'] * 5) + (row['Diabetes'] * 5) + (row['Alcoholism'] * 3) + (row['Handcap'] * 7)
        return max(5, round(base + age_bonus + health_bonus + np.random.normal(0, 3)))

    df['ConsultationTime'] = df.apply(get_time, axis=1)

    # 🧠 2. No-Show Prediction
    # No-show: 'Yes' means they didn't show up. 'No' means they did.
    # README asks for 0 -> No-show, 1 -> Show.
    df['Target_Show'] = df['No-show'].map({'No': 1, 'Yes': 0})

<<<<<<< theme-refactor
    # Train No-Show Model
    print("Training No-Show Classification Model...")
    X_s = df[FEATURES_NO_SHOW]
=======
    # Train No-Show Model (with SMS_received)
    print("Training No-Show Classification Model (with SMS_received)...")
    X_s = df[FEATURES_NOSHOW]
>>>>>>> main
    y_s = df['Target_Show']
    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X_s, y_s, test_size=0.2, random_state=42)
    model_no_show = RandomForestClassifier(n_estimators=100, random_state=42)
    model_no_show.fit(X_train_s, y_train_s)
    print(f"- Accuracy: {accuracy_score(y_test_s, model_no_show.predict(X_test_s)):.2f}")

    # Train Consultation Time Model (no SMS — it doesn't affect duration)
    print("Training Time Prediction Regression Model...")
    X_t = df[FEATURES_TIME]
    y_t = df['ConsultationTime']
    X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X_t, y_t, test_size=0.2, random_state=42)
    model_time = RandomForestRegressor(n_estimators=100, random_state=42)
    model_time.fit(X_train_t, y_train_t)
    print(f"- MAE: {mean_absolute_error(y_test_t, model_time.predict(X_test_t)):.2f} minutes")

    # Export
    ml_dir = "ml" if os.path.basename(os.getcwd()) != "ml" else "."
    
    with open(os.path.join(ml_dir, "no_show.pkl"), "wb") as f:
        pickle.dump(model_no_show, f)
    with open(os.path.join(ml_dir, "time.pkl"), "wb") as f:
        pickle.dump(model_time, f)

    print(f"\nAll models saved successfully to '{ml_dir}' folder.")

if __name__ == "__main__":
    main()