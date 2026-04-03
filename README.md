# 🏥 Smart Appointment Scheduling System (HealthTech)

---

## 🚀 Project Overview

Traditional hospital appointment systems rely on fixed schedules and fail to handle:
- Variable consultation times  
- Patient no-shows  
- Late arrivals  
- Real-time delays  

👉 This leads to:
- Long waiting times  
- Inefficient doctor utilization  

---

## 🎯 Objective

To build an **intelligent appointment scheduling system** that:

- Predicts consultation time  
- Predicts patient no-show probability  
- Dynamically updates queue in real-time  
- Reduces waiting time  
- Improves hospital efficiency  

---

## 🧠 Core Idea

👉 **Machine Learning = Prediction**  
👉 **Backend = Decision making**  
👉 **Real-time = Event-driven updates**

---

## 📊 Dataset Used

We use the Kaggle dataset:

./KaggleV2-May-2016.csv

---

### 📁 Dataset Summary

- Total records: **110,527 medical appointments**
- Total features: **14 variables**
- Goal: Predict whether patient will **show up or not and time**

---

### 📖 Data Dictionary

| Feature | Description |
|--------|------------|
| PatientId | Unique patient ID |
| AppointmentID | Appointment ID |
| Gender | Male / Female |
| DataMarcacaoConsulta | Appointment date |
| DataAgendamento | Booking date |
| Age | Patient age |
| Neighbourhood | Location |
| Scholarship | Govt. welfare program |
| Hipertension | True/False |
| Diabetes | True/False |
| Alcoholism | True/False |
| Handcap | True/False |
| SMS_received | Reminder sent |
| No-show | Target (Yes/No) |

---

### 💡 Inspiration

> “What if it was possible to predict whether a patient will not show up?”

---

## 🏗️ System Architecture
Frontend (React)
↓
Backend (Node.js / Express)
↓
ML Service (Python - Flask)
↓
Models:
• No-show Prediction Model
• Time Prediction Model

---

## 🔄 Complete Workflow

---

### 🧾 1. Appointment Booking

1. Patient enters details:
   - Age  
   - Health conditions  
   - Other info  

2. Backend sends data to ML API  

3. ML returns:
{
"no_show_probability": 0.3,
"estimated_time": 15
}

4. Backend:
   - Assigns appointment slot  
   - Stores in database  

---

### 🏥 2. Patient Arrival

- Patient checks in via:
  - App OR reception  
status = "arrived"


---

### ❌ 3. No-Show Handling

- If patient does not arrive within threshold (e.g., 10 mins):

status = "no-show"


- Remove patient from queue  
- Recalculate waiting times  

---

### ⏰ 4. Late Arrival Handling

- If patient arrives late:

status = "late"


- Reinsert into queue:
👉 Insert after current patient  

- Update queue dynamically  

---

### 👨‍⚕️ 5. Consultation Process

Doctor dashboard actions:

- Start Consultation  
- End Consultation  

System calculates:


actual_time = end_time - start_time


---

### 🔄 6. Real-Time Update Logic (CORE)

After each consultation:

1. Calculate delay:


delay = actual_time - predicted_time


2. Update dynamic average:


new_avg = recent_patient_times


3. Recalculate queue:


wait_time = sum(previous patients time) + delay


4. Notify all patients  

---

### 📱 7. Patient View

Users see:
- Estimated wait time  
- Queue position  
- Real-time updates  

---

## 🤖 Machine Learning Models

---

### 🧠 Model 1: No-Show Prediction

- Type: Classification  
- Output:
  - 0 → No-show  
  - 1 → Show  

- Features:
  - Age  
  - SMS_received  
  - Diabetes  
  - Hypertension  

---

### ⏱️ Model 2: Consultation Time Prediction

- Type: Regression  
- Output:
  - Time in minutes  

- Features:
  - Age  
  - Health condition  
  - Visit type  

---

### ⚠️ Important Notes

- Models are trained using Kaggle dataset  
- Training happens **once (offline)**  
- Models are saved as `.pkl` files  
- No real-time retraining required  

---

## 🔗 Backend + ML Integration

- ML service built using Flask  
- Backend sends request to `/predict` API  
- ML returns both predictions in one response  

---

## ⚙️ Key Design Principles

- Event-driven updates (not continuous tracking)  
- Hybrid system (automation + manual confirmation)  
- Fair queue handling  
- Modular architecture  

---

## 🚨 Edge Case Handling

| Scenario | Solution |
|---------|--------|
| No-show | Remove from queue |
| Late arrival | Reinsert after current patient |
| Delay | Update wait time |
| Faster consultation | Reduce waiting time |

---

## 🎯 System Behavior Summary

✔ Predicts appointment behavior  
✔ Tracks real-time events  
✔ Dynamically updates queue  
✔ Minimizes waiting time  

---

## 🧑‍💻 Team Task Distribution (4 Members)

---

### 👨‍🎨 Member 1: Frontend (React)

- Patient interface  
- Doctor dashboard  
- Queue display  
- Real-time UI updates  

---

### ⚙️ Member 2: Backend (Node.js)

- API development  
- Queue logic  
- Event handling (start/end/no-show)  
- Database management  
- ML API integration  

---

### 🧠 Member 3: ML Engineer (No-Show Model)

- Data preprocessing  
- Train classification model  
- Feature engineering  
- Export model (`no_show.pkl`)  

---

### ⏱️ Member 4: ML Engineer (Time Prediction Model)

- Train regression model  
- Predict consultation time  
- Optimize performance  
- Export model (`time.pkl`)  

---

## 🔥 Final Pitch Line

> “Our system combines machine learning-based predictions with event-driven real-time updates to dynamically optimize patient scheduling and minimize waiting time.”

---

## 🏆 Conclusion

This system is:

- Predictive (ML-based)  
- Real-time adaptive  
- Efficient and scalable  
- Practical for real-world healthcare systems

# ⚙️ Backend System – Smart Appointment Scheduling

---

## 🚀 Overview

The backend is the **core brain of the system** responsible for:

- Managing patient queue  
- Integrating ML predictions  
- Handling real-time updates  
- Processing events (start, end, no-show, late, walk-in)  
- Serving data to frontend  

---

## 🎯 Design Principle

👉 Store only what is:
- Required for ML  
- Required for backend logic  
- Required for UI  

---

## 🏗️ Tech Stack

- Node.js  
- Express.js  
- Axios (for ML API calls)  
- MongoDB  
- Mongoose (ODM)  

---

## 📁 Folder Structure

```text
backend/
├── models/
│ └── Patient.js
├── config/
│ └── db.js
├── server.js
```

---

## ⚙️ Database Setup

### 1️⃣ Install

```bash
npm install mongoose
```

### 2️⃣ Connect Database
📄 `config/db.js`
```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/smart-appointment");
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 3️⃣ Use in server
```javascript
const connectDB = require("./config/db");
connectDB();
```

### 📦 Final Patient Schema
📄 `models/Patient.js`
```javascript
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({

  // 🧠 ML INPUT FEATURES
  age: { type: Number, required: true },
  gender: { type: Number, default: 0 },        // 0 = female, 1 = male
  hypertension: { type: Number, default: 0 },
  diabetes: { type: Number, default: 0 },
  scholarship: { type: Number, default: 0 },
  sms: { type: Number, default: 0 },           // 0 = not sent, 1 = sent

  // 🤖 ML OUTPUT
  predictedTime: { type: Number },
  noShowProb: { type: Number },

  // 🔄 QUEUE STATUS
  status: {
    type: String,
    enum: ["waiting", "arrived", "in-progress", "done", "no-show"],
    default: "waiting"
  },

  // 👤 TYPE
  type: {
    type: String,
    enum: ["booked", "walk-in"],
    default: "booked"
  },

  // ⏱️ TIME TRACKING
  startTime: { type: Date },
  endTime: { type: Date },
  actualTime: { type: Number },

  // 📅 META
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Patient", patientSchema);
```

### 📊 Why These Fields?
| Field | Reason |
|---|---|
| age, diabetes, etc. | ML input |
| predictedTime | Queue calculation |
| noShowProb | SMS + logic |
| status | Queue control |
| type | Walk-in support |
| createdAt | Queue ordering |

---

## 🔄 Database Workflow

**🧾 1. Booking**  
Backend receives data, calls ML, stores record:
```javascript
await Patient.create({
  age,
  gender,
  hypertension,
  diabetes,
  scholarship,
  sms: 0,
  predictedTime,
  noShowProb,
  status: "waiting",
  type: "booked"
});
```

**🏥 2. Arrival**
```javascript
await Patient.updateOne(
  { _id: id },
  { status: "arrived" }
);
```

**👨‍⚕️ 3. Start Consultation**
```javascript
await Patient.updateOne(
  { _id: id },
  {
    status: "in-progress",
    startTime: Date.now()
  }
);
```

**⏹ 4. End Consultation**
```javascript
await Patient.updateOne(
  { _id: id },
  {
    status: "done",
    endTime: Date.now(),
    actualTime: calculatedTime
  }
);
```

**❌ 5. No-Show**
```javascript
await Patient.updateOne(
  { _id: id },
  { status: "no-show" }
);
```

**⏰ 6. Late Arrival**
```javascript
await Patient.updateOne(
  { _id: id },
  { status: "waiting" }
);
```

---

## 📊 Queue Generation (IMPORTANT)

👉 **Queue is NOT stored**  
👉 **It is dynamically generated**

```javascript
const queue = await Patient.find({
  status: { $in: ["waiting", "arrived", "in-progress"] }
}).sort({ createdAt: 1 });
```

### ⏱️ Wait Time Calculation
```javascript
function calculateWaitTime(queue, index) {
  let time = 0;

  for (let i = 0; i < index; i++) {
    if (queue[i].status !== "no-show") {
      time += queue[i].predictedTime;
    }
  }

  return time;
}
```

---

## 🔗 Backend Integration Rules (VERY IMPORTANT)

👉 Backend and DB must agree on:

- **Field Names**: `predictedTime`, `noShowProb`, `sms`, `status`
- **Status Values**: `waiting`, `arrived`, `in-progress`, `done`, `no-show`

### 🚨 Edge Case Handling
| Scenario | DB Action |
|---|---|
| No-show | Update status |
| Late arrival | Update + reorder |
| Walk-in | Insert new record |
| Delay | Update actualTime |
| SMS sent | Update sms |

### 🧠 Important Rules
- Do NOT store queue separately
- Always fetch fresh data
- Keep schema consistent
- Do not change field names randomly

---

## 🏆 Final Summary

This database system:
✔ Stores all patient data  
✔ Supports ML integration  
✔ Enables dynamic queue  
✔ Handles real-time updates  
✔ Ensures system consistency  

---

## 🚀 What You Do Now

👉 Give this to your **database teammate**  
👉 Start MongoDB setup  
👉 Create model → test insert  

---

# 📱 SMS Reminder System

---

## 💡 What is SMS_received?

`SMS_received` is a feature in the dataset that tells us:
- `0` = Patient has **NOT** received an SMS reminder yet
- `1` = Patient **HAS** received an SMS reminder

> Studies show patients who receive an SMS reminder are more likely to show up.
> So this feature directly improves our No-Show prediction accuracy.

---

## 🧠 How It Works in the ML Model

We use `SMS_received` **only in the No-Show model** (not in the Time model).

| Model | Uses SMS_received? | Reason |
|-------|-------------------|--------|
| No-Show Prediction | ✅ YES | SMS affects whether patient shows up |
| Time Prediction | ❌ NO | SMS has no effect on consultation duration |

---

## 🔄 SMS Flow — Step by Step

### Step 1: Patient Books Appointment
- Backend calls ML with `SMS_received = 0` (SMS not sent yet)
- ML returns `no_show_probability` and `sms_strategy`

### Step 2: Backend Reads the SMS Strategy

| ML says | Risk Level | What Backend Does |
|---------|-----------|-------------------|
| `sms_strategy = "high_risk"` | 🔴 prob > 0.4 | Send SMS **24 hours before** + **2 hours before** |
| `sms_strategy = "medium_risk"` | 🟡 prob 0.2–0.4 | Send SMS **24 hours before** only |
| `sms_strategy = "low_risk"` | 🟢 prob ≤ 0.2 | **No SMS needed** |

### Step 3: After SMS is Sent
- Backend marks `sms_received = 1` in patient record
- Backend calls ML again with `SMS_received = 1`
- ML returns **updated (lower) no_show_probability**
- Queue wait times are recalculated

---

## 📦 API — What the ML Returns

**Request (on booking):**
```json
{
  "Age": 35,
  "Gender": 0,
  "Hipertension": 1,
  "Diabetes": 0,
  "Alcoholism": 0,
  "Handcap": 0,
  "Scholarship": 0,
  "SMS_received": 0
}
```

**Response:**
```json
{
  "no_show_probability": 0.35,
  "estimated_time": 18.0,
  "sms_strategy": "medium_risk",
  "status": "success"
}
```

**Request (after SMS is sent):**
```json
{
  "SMS_received": 1,
  ...same fields...
}
```

**Response (updated):**
```json
{
  "no_show_probability": 0.18,
  "estimated_time": 18.0,
  "sms_strategy": "low_risk",
  "status": "success"
}
```

---

## 🗂️ Simple Summary

```
Patient books
    ↓
ML predicts risk (SMS_received = 0)
    ↓
High/Medium risk? → Schedule SMS reminder
    ↓
SMS sent → Update patient record (SMS_received = 1)
    ↓
ML re-predicts updated risk (lower now)
    ↓
Queue recalculated with new probability
```

---

# 🔐 Authentication System (Independent)

---

## 🎯 Design Principle: Separation of Concerns

The **Patient Schema** we designed earlier is strictly for **Queue Management and ML Predictions** (it essentially represents an *Appointment* in the queue). 

**Do NOT mix login credentials into the Patient queue schema.** A patient might visit multiple times (multiple queue records over time), but they should only have **one permanent login account**. 

Therefore, authentication must be completely independent from the queue logic!

---

## 🏗️ Recommended Auth Structure

Create a separate `User` model to handle registration and login for both Receptionists and Patients.

### 📁 New Model File: `models/User.js`

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ⚠️ Store HASHED (use bcrypt)
  
  // Role string determines permissions across the app
  role: {
    type: String,
    enum: ["patient", "receptionist", "doctor"],
    default: "patient"
  },
  
  phone: { type: String } // Useful to link to the ML SMS feature
});

module.exports = mongoose.model("User", userSchema);
```

---

## 🔄 Workflow for Auth + Queues

1. **Registration:**
   - Patient registers on frontend → creates a `User` document in database.
   - Receptionists/Doctors are pre-created manually by admins.

2. **Login / JWT:**
   - User logs in via `/api/auth/login`.
   - Backend verifies password (bcrypt) and returns a **JWT token** containing their `userId` and `role`.

3. **Booking an Appointment (Connecting them):**
   - An authenticated patient hits the `/book` queue endpoint.
   - The backend securely reads their `userId` from the JWT token and attaches it to the newly generated `Patient` (queue) document.

---

## 🚨 Essential Rules for Authentication

- **Never store plain-text passwords:** Always use `bcrypt` to hash the password before saving to MongoDB.
- **Secure endpoints via Routes Guarding:** Use JWT to secure your Backend APIs. Receptionists should have access to `/start`, `/end`, and `/late`, while Patients can only access `/book` and view the `/queue`.
- **Database Separation:**
  - `Collection 1: Users` (For login / auth / profiles)
  - `Collection 2: Patients` (For daily appointments / queues / ML)

---
