require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const twilio = require('twilio');
const cron = require('node-cron');
const mongoose = require('mongoose');

const Patient = require('./models/Patient');

const app = express();
app.use(cors());
app.use(express.json());

// Load Environment Variables
const PORT = process.env.PORT || 4000;
const ML_API_URL = process.env.ML_API_URL || 'https://cortexcrew-timecure.onrender.com/predict';
const MONGO_URI = process.env.MONGO_URI;

// 🗄️ Connect to Database
if (!MONGO_URI) {
    console.error("❌ CRITICAL: MONGO_URI is missing in .env!");
    process.exit(1);
}
mongoose.connect(MONGO_URI).then(() => {
    console.log("🗄️ MongoDB Connected successfully to TimeCure Queue!");
}).catch(err => console.error("Mongo Connection Error:", err));


// Twilio Setup
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);


// ── ML Prediction Helper ────────────────────────────
async function getMLPredictions(patientData) {
    try {
        const response = await axios.post(ML_API_URL, patientData);
        return response.data;
    } catch (error) {
        console.error("❌ Error contacting ML API:", error.message);
        return { estimated_time: 15, no_show_probability: 0.1, sms_strategy: 'low_risk' };
    }
}

// ── SMS Sending Function ────────────────────────────
async function sendSmsReminder(patient, type) {
    if (!patient.phone) return;

    let message = `Hi ${patient.name || 'Patient'}, this is a reminder for your upcoming appointment.`;
    if (type === "urgent") {
        message = `URGENT: ${patient.name || 'Patient'}, your appointment is soon! Please ensure you arrive on time.`;
    }

    try {
        const twilioResponse = await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE,
            to: patient.phone
        });
        console.log(`💬 SMS Sent to ${patient.phone} (SID: ${twilioResponse.sid})`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send SMS to ${patient.phone}:`, error.message);
        return false;
    }
}

// ── ENDPOINTS ──────────────────────────────────────

// 1. Book Appointment
app.post("/book", async (req, res) => {
    // 1. Gather Payload
    const data = {
        Age: req.body.Age || 30,
        Gender: req.body.Gender || 0,
        Hipertension: req.body.Hipertension || 0,
        Diabetes: req.body.Diabetes || 0,
        Alcoholism: req.body.Alcoholism || 0,
        Handcap: req.body.Handcap || 0,
        Scholarship: req.body.Scholarship || 0,
        SMS_received: 0 
    };

    // 2. Fetch ML Prediction
    const mlResult = await getMLPredictions(data);

    // 3. Save to MongoDB natively
    const patient = await Patient.create({
        name: req.body.name || "Booked Patient",
        phone: req.body.phone || "+0000000000",
        ...data,
        predictedTime: mlResult.estimated_time,
        noShowProb: mlResult.no_show_probability,
        smsStrategy: mlResult.sms_strategy,
        status: "waiting",
        type: "booked"
    });

    res.json({ message: "Appointment booked!", patient: { id: patient._id, ...patient.toObject() } });
});

// 2. Walk-In Patient
app.post("/walk-in", async (req, res) => {
    const data = {
        Age: req.body.Age || 30,
        Gender: req.body.Gender || 0,
        Hipertension: req.body.Hipertension || 0,
        Diabetes: req.body.Diabetes || 0,
        Alcoholism: req.body.Alcoholism || 0,
        Handcap: req.body.Handcap || 0,
        Scholarship: req.body.Scholarship || 0,
        SMS_received: 0
    };

    const mlResult = await getMLPredictions(data);

    const patient = await Patient.create({
        name: req.body.name || "Walk-In Patient",
        phone: req.body.phone,
        ...data,
        predictedTime: mlResult.estimated_time,
        noShowProb: mlResult.no_show_probability,
        smsStrategy: 'none_walkin', 
        status: "arrived",
        type: "walk-in"
    });

    res.json({ message: "Walk-in added!", patient: { id: patient._id, ...patient.toObject() } });
});

// 3. Get Real-Time Queue (Calculates mathematical wait time dynamically)
app.get("/queue", async (req, res) => {
    // Fetch only active queue participants sorted by creation order
    const activeQueue = await Patient.find({
        status: { $in: ["waiting", "arrived", "in-progress"] }
    }).sort({ createdAt: 1 });

    const updatedQueue = [];
    let timeAcc = 0;
    
    for (let p of activeQueue) {
        // Build payload and append cumulative dynamic waiting time
        updatedQueue.push({ id: p._id, ...p.toObject(), waitTime: timeAcc });
        timeAcc += p.predictedTime || 0; // The next patient waits an additional X mins
    }
    
    res.json(updatedQueue);
});

// 4. Start Consultation
app.post("/start/:id", async (req, res) => {
    const p = await Patient.findByIdAndUpdate(req.params.id, {
        status: "in-progress",
        startTime: Date.now()
    }, { new: true });
    
    if (p) res.json({ message: "Started", patient: { id: p._id, ...p.toObject() } });
    else res.status(404).json({ error: "Patient not found" });
});

// 5. End Consultation
app.post("/end/:id", async (req, res) => {
    const p = await Patient.findById(req.params.id);
    if (p && p.status === "in-progress") {
        p.status = "done";
        p.endTime = Date.now();
        p.actualTime = (p.endTime - p.startTime) / 60000; // minutes
        await p.save();
        res.json({ message: "Ended", patient: { id: p._id, ...p.toObject() } });
    } else {
        res.status(400).json({ error: "Patient not found or not in progress" });
    }
});

// 6. Mark No-Show
app.post("/no-show/:id", async (req, res) => {
    const p = await Patient.findByIdAndUpdate(req.params.id, { status: "no-show" }, { new: true });
    if (p) res.json({ message: "Marked as no-show", patient: { id: p._id, ...p.toObject() } });
    else res.status(404).json({ error: "Patient not found" });
});

// 7. Dashboard Stats
app.get("/stats", async (req, res) => {
    const arrived = await Patient.countDocuments({ status: "arrived" });
    const waiting = await Patient.countDocuments({ status: "waiting" });
    const inProgress = await Patient.countDocuments({ status: "in-progress" });
    const done = await Patient.countDocuments({ status: "done" });
    const missing = await Patient.countDocuments({ status: "no-show" });
    const total = await Patient.countDocuments();
    
    res.json({ arrived, waiting, inProgress, done, missing, total });
});

// ── SMS Cron Job (Mock / Hackathon Simulation) ──────
cron.schedule('*/5 * * * *', async () => {
    console.log("⏰ Running MongoDB SMS Reminder Job...");
    
    // Find all active patients who haven't received an SMS yet
    const patients = await Patient.find({
        status: { $nin: ["done", "no-show"] },
        SMS_received: 0,
        smsStrategy: { $in: ["high_risk", "medium_risk"] }
    });

    for (let p of patients) {
        console.log(`📩 Triggering automated SMS for DB Patient ID ${p._id} (${p.smsStrategy})`);
        
        const success = await sendSmsReminder(p, "normal");
        
        if (success) {
            p.SMS_received = 1;
            
            // Re-fetch ML probability dynamically now that SMS was sent
            const dataPayload = {
                Age: p.Age, Gender: p.Gender, Hipertension: p.Hipertension,
                Diabetes: p.Diabetes, Alcoholism: p.Alcoholism, 
                Handcap: p.Handcap, Scholarship: p.Scholarship,
                SMS_received: 1
            };
            
            try {
                const newMlResult = await getMLPredictions(dataPayload);
                console.log(`📉 Patient ${p._id} risk updated: ${p.noShowProb} ➔ ${newMlResult.no_show_probability}`);
                p.noShowProb = newMlResult.no_show_probability;
                p.smsStrategy = newMlResult.sms_strategy;
                await p.save(); // Save Native DB Status
            } catch (e) {
                 console.error("Failed to re-fetch ML predictions for SMS update.");
            }
        }
    }
});

// ── TRIGGER MANUAL SMS (For testing via Postman/Master Test) ──
app.post("/trigger-sms/:id", async (req, res) => {
    const p = await Patient.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Patient not found in Database" });
    if (!p.phone) return res.status(400).json({ error: "Patient has no phone number on record." });

    const type = req.body?.type || "normal"; 
    const success = await sendSmsReminder(p, type);
    
    if (success) {
        p.SMS_received = 1;
        const dataPayload = {
             Age: p.Age, Gender: p.Gender, Hipertension: p.Hipertension,
             Diabetes: p.Diabetes, Alcoholism: p.Alcoholism, Handcap: p.Handcap, Scholarship: p.Scholarship,
             SMS_received: 1
        };
        const newMlResult = await getMLPredictions(dataPayload);
        p.noShowProb = newMlResult.no_show_probability;
        await p.save();

        res.json({ message: "SMS triggered via Twilio successfully and Probability Updated in MongoDB", updatedPatient: { id: p._id, ...p.toObject() } });
    } else {
        res.status(500).json({ error: "Failed. Check Twilio credentials." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 TimeCure Backend Database Server running on port ${PORT} (Live: https://cortexcrew-timecure-1.onrender.com)`);
    console.log(`🔌 ML target pointing to: ${ML_API_URL}`);
});
