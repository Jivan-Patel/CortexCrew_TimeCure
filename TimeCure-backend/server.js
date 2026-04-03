require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const twilio = require('twilio');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// Load Environment Variables
const PORT = process.env.PORT || 4000;
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000/predict';

// Twilio Setup
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);

// In-Memory Database / Queue
let queue = [];
let appointmentCounter = 1;

// ── ML Prediction Helper ────────────────────────────
async function getMLPredictions(patientData) {
    try {
        const response = await axios.post(ML_API_URL, patientData);
        return response.data;
    } catch (error) {
        console.error("❌ Error contacting ML API:", error.message);
        // Fallback dummy values if ML is down
        return { estimated_time: 15, no_show_probability: 0.1, sms_strategy: 'low_risk' };
    }
}

// ── SMS Sending Function ────────────────────────────
async function sendSmsReminder(patient, type) {
    if (!patient.phone) return; // Need a phone number to send

    let message = `Hi ${patient.name || 'Patient'}, this is a reminder for your upcoming appointment.`;
    if (type === "urgent") {
        message = `URGENT: ${patient.name || 'Patient'}, your appointment is soon! Please ensure you arrive on time.`;
    }

    try {
        const twilioResponse = await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE,
            to: patient.phone // Must be proper E.164 format, e.g., +1234567890
        });
        console.log(`💬 SMS Sent to ${patient.phone} (SID: ${twilioResponse.sid})`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send SMS to ${patient.phone}:`, error.message);
        return false;
    }
}

// ── Calculate Wait Time Helper ─────────────────────
function calculateWaitTime(index) {
    let time = 0;
    for (let i = 0; i < index; i++) {
        if (queue[i].status !== "no-show" && queue[i].status !== "done") {
            time += queue[i].predictedTime;
        }
    }
    return time;
}

// ── ENDPOINTS ──────────────────────────────────────

// 1. Book Appointment
app.post("/book", async (req, res) => {
    // Expected incoming (matching ML payload constraints):
    const data = {
        Age: req.body.Age || 30,
        Gender: req.body.Gender || 0,
        Hipertension: req.body.Hipertension || 0,
        Diabetes: req.body.Diabetes || 0,
        Alcoholism: req.body.Alcoholism || 0,
        Handcap: req.body.Handcap || 0,
        Scholarship: req.body.Scholarship || 0,
        SMS_received: 0 // initially
    };

    const mlResult = await getMLPredictions(data);

    const patient = {
        id: appointmentCounter++,
        name: req.body.name || `Patient ${appointmentCounter}`,
        phone: req.body.phone, // Include a valid number for Twilio
        ...data,
        predictedTime: mlResult.estimated_time,
        noShowProb: mlResult.no_show_probability,
        smsStrategy: mlResult.sms_strategy,
        status: "waiting", // "waiting", "arrived", "in-progress", "done", "no-show"
        type: "booked",    // "booked" or "walk-in"
        createdAt: new Date()
    };

    queue.push(patient);

    // Initial SMS trigger based on strategy (Simulation for Demo)
    // Normally handled by a cron-job (see below)
    res.json({ message: "Appointment booked!", patient });
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

    const patient = {
        id: appointmentCounter++,
        name: req.body.name || `Walk-In ${appointmentCounter}`,
        phone: req.body.phone,
        ...data,
        predictedTime: mlResult.estimated_time,
        noShowProb: mlResult.no_show_probability,
        smsStrategy: 'none_walkin', // no SMS for walk-ins
        status: "arrived",
        type: "walk-in",
        createdAt: new Date()
    };

    // Insert after the current patient (index 1 if index 0 is in-progress)
    if (queue.length > 0 && queue[0].status === "in-progress") {
        queue.splice(1, 0, patient);
    } else {
        // If queue is empty or no one is in progress, they go to the front
        queue.unshift(patient);
    }

    res.json({ message: "Walk-in added!", patient });
});

// 3. Get Queue
app.get("/queue", (req, res) => {
    const updatedQueue = queue.map((p, i) => ({
        ...p,
        waitTime: calculateWaitTime(i)
    }));
    res.json(updatedQueue);
});

// 4. Start Consultation
app.post("/start/:id", (req, res) => {
    const p = queue.find(x => x.id == req.params.id);
    if (p) {
        p.status = "in-progress";
        p.startTime = Date.now();
        res.json({ message: "Started", patient: p });
    } else {
        res.status(404).json({ error: "Patient not found" });
    }
});

// 5. End Consultation
app.post("/end/:id", (req, res) => {
    const p = queue.find(x => x.id == req.params.id);
    if (p && p.status === "in-progress") {
        p.status = "done";
        p.endTime = Date.now();
        p.actualTime = (p.endTime - p.startTime) / 60000; // in mins
        res.json({ message: "Ended", patient: p });
    } else {
        res.status(400).json({ error: "Patient not found or not in progress" });
    }
});

// 6. Mark No-Show
app.post("/no-show/:id", (req, res) => {
    const p = queue.find(x => x.id == req.params.id);
    if (p) {
        p.status = "no-show";
        res.json({ message: "Marked as no-show", patient: p });
    } else {
        res.status(404).json({ error: "Patient not found" });
    }
});

// 7. Late Arrival
app.post("/late/:id", (req, res) => {
    const index = queue.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        const patient = queue.splice(index, 1)[0];
        // Re-insert after current patient (at index 1)
        if (queue.length > 0 && queue[0].status === "in-progress") {
             queue.splice(1, 0, patient);
        } else {
             queue.unshift(patient);
        }
        patient.status = "waiting";
        res.json({ message: "Late arrival handled", patient });
    } else {
        res.status(404).json({ error: "Patient not found" });
    }
});

// 8. Dashboard Stats
app.get("/stats", (req, res) => {
    const arrived = queue.filter(p => p.status === "arrived").length;
    const waiting = queue.filter(p => p.status === "waiting").length;
    const inProgress = queue.filter(p => p.status === "in-progress").length;
    const done = queue.filter(p => p.status === "done").length;
    const missing = queue.filter(p => p.status === "no-show").length;
    res.json({ arrived, waiting, inProgress, done, missing, total: queue.length });
});

// ── SMS Cron Job (Mock / Hackathon Simulation) ──────
// This job runs every 5 minutes in this demo (normally every 1 hr)
cron.schedule('*/5 * * * *', async () => {
    console.log("⏰ Running SMS Reminder Job...");
    
    // Find patients who need SMS but haven't received it yet (SMS_received=0)
    for (let p of queue) {
        if (p.status !== "done" && p.status !== "no-show" && p.SMS_received === 0) {
            
            if (p.smsStrategy === "high_risk" || p.smsStrategy === "medium_risk") {
                console.log(`📩 Triggering automated SMS for Patient ID ${p.id} (${p.smsStrategy})`);
                
                // Attempt SMS
                const success = await sendSmsReminder(p, "normal");
                
                if (success) {
                    // Update patient state
                    p.SMS_received = 1;
                    
                    // Call ML again with new SMS context to get updated lower risk
                    const dataPayload = {
                        Age: p.Age, Gender: p.Gender, Hipertension: p.Hipertension,
                        Diabetes: p.Diabetes, Alcoholism: p.Alcoholism, 
                        Handcap: p.Handcap, Scholarship: p.Scholarship,
                        SMS_received: 1
                    };
                    
                    try {
                        const newMlResult = await getMLPredictions(dataPayload);
                        console.log(`📉 Patient ID ${p.id} risk updated: ${p.noShowProb} ➔ ${newMlResult.no_show_probability}`);
                        p.noShowProb = newMlResult.no_show_probability;
                        p.smsStrategy = newMlResult.sms_strategy; // update to new strategy
                    } catch (e) {
                         console.error("Failed to re-fetch ML predictions for SMS update.");
                    }
                }
            }
        }
    }
});

// ── TRIGGER MANUAL SMS (For testing via Postman) ──
app.post("/trigger-sms/:id", async (req, res) => {
    const p = queue.find(x => x.id == req.params.id);
    if (!p) return res.status(404).json({ error: "Patient not found" });
    if (!p.phone) return res.status(400).json({ error: "Patient has no phone number on record." });

    const type = req.body?.type || "normal"; // "urgent" or "normal"
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

        res.json({ message: "SMS triggered via Twilio successfully and Probability Updated", updatedPatient: p });
    } else {
        res.status(500).json({ error: "Failed. Check Twilio credentials." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
    console.log(`🔌 ML target pointing to: ${ML_API_URL}`);
});
