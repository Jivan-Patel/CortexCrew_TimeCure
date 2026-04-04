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
        return { success: true };
    } catch (error) {
        console.error(`❌ Failed to send SMS to ${patient.phone}:`, error.message);
        return { success: false, error: error.message };
    }
}

// ── Helper: Build today's date range ────────────────
function getTodayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
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

    // 3. Save to MongoDB — now includes optional appointmentDate
    const patient = await Patient.create({
        name: req.body.name || "Booked Patient",
        phone: req.body.phone || "+0000000000",
        ...data,
        predictedTime: mlResult.estimated_time,
        noShowProb: mlResult.no_show_probability,
        smsStrategy: mlResult.sms_strategy,
        status: "waiting",
        type: "booked",
        appointmentDate: req.body.appointmentDate ? new Date(req.body.appointmentDate) : null
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

// 3. Get Real-Time Queue (today's patients only, excludes rescheduled)
app.get("/queue", async (req, res) => {
    const { start, end } = getTodayRange();

    // Fetch today's active patients AND all rescheduled patients (for the upcoming panel).
    // Two branches:
    //   1. waiting/arrived/in-progress whose appointmentDate is today (or null = walk-in/legacy)
    //   2. ALL rescheduled patients regardless of date (doctor needs to see them in the panel)
    const activeQueue = await Patient.find({
        $or: [
            {
                status: { $in: ["waiting", "arrived", "in-progress"] },
                $or: [
                    { appointmentDate: null },
                    { appointmentDate: { $gte: start, $lte: end } }
                ]
            },
            { status: "rescheduled" }
        ]
    }).sort({ createdAt: 1 });

    const updatedQueue = [];
    let timeAcc = 0;
    
    for (let p of activeQueue) {
        updatedQueue.push({ id: p._id, ...p.toObject(), waitTime: timeAcc });
        timeAcc += p.predictedTime || 0;
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
    const rescheduled = await Patient.countDocuments({ status: "rescheduled" });
    const total = await Patient.countDocuments();
    
    res.json({ arrived, waiting, inProgress, done, missing, rescheduled, total });
});

// ── TRIGGER MANUAL SMS ──────────────────────────────
app.post("/trigger-sms/:id", async (req, res) => {
    const p = await Patient.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Patient not found in Database" });
    if (!p.phone) return res.status(400).json({ error: "Patient has no phone number on record." });

    const type = req.body?.type || "normal"; 
    const smsResult = await sendSmsReminder(p, type);
    
    if (smsResult.success) {
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
        console.error("SMS Failed Details:", smsResult.error);
        res.status(500).json({ error: "Failed to send SMS.", details: smsResult.error });
    }
});

// ── NEW: GET /patient/:id — Single patient details ──────────────────────
app.get("/patient/:id", async (req, res) => {
    try {
        const p = await Patient.findById(req.params.id);
        if (!p) return res.status(404).json({ error: "Patient not found" });
        res.json({ id: p._id, ...p.toObject() });
    } catch (err) {
        res.status(400).json({ error: "Invalid patient ID" });
    }
});

// ── NEW: GET /queue/date — Queue for a specific future date ─────────────
app.get("/queue/date", async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ error: "date query param required (YYYY-MM-DD)" });

        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
        }

        // Build day range for the target date
        const dayStart = new Date(targetDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(targetDate);
        dayEnd.setHours(23, 59, 59, 999);

        // Find patients whose rescheduledDate OR appointmentDate falls on that day
        const patients = await Patient.find({
            $or: [
                { rescheduledDate: { $gte: dayStart, $lte: dayEnd } },
                {
                    appointmentDate: { $gte: dayStart, $lte: dayEnd },
                    rescheduledDate: null
                }
            ]
        }).sort({ rescheduledDate: 1, appointmentDate: 1 });

        // Annotate with effective date for easier frontend rendering
        const result = patients.map(p => ({
            id: p._id,
            ...p.toObject(),
            effectiveDate: p.rescheduledDate || p.appointmentDate
        }));

        res.json(result);
    } catch (err) {
        console.error("❌ /queue/date error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ── NEW: POST /reschedule/:id — Reschedule an appointment ──────────────
app.post("/reschedule/:id", async (req, res) => {
    try {
        const { newDate, reason = "" } = req.body;

        // ── 1. Find patient ──────────────────────────────
        const p = await Patient.findById(req.params.id);
        if (!p) return res.status(404).json({ error: "Patient not found" });

        // ── 2. Validate status ───────────────────────────
        const reschedulableStatuses = ["waiting", "arrived", "no-show", "rescheduled"];
        if (!reschedulableStatuses.includes(p.status)) {
            return res.status(400).json({
                error: `Cannot reschedule a patient with status "${p.status}". ` +
                       `Only waiting, arrived, no-show, or already-rescheduled patients can be rescheduled.`
            });
        }

        // ── 3. Validate reschedule count ─────────────────
        if (p.rescheduleCount >= 3) {
            return res.status(400).json({
                error: "Maximum reschedule limit reached (3). No further rescheduling is allowed for this patient."
            });
        }

        // ── 4. Validate new date ─────────────────────────
        if (!newDate) {
            return res.status(400).json({ error: "newDate is required" });
        }
        const newDateObj = new Date(newDate);
        if (isNaN(newDateObj.getTime())) {
            return res.status(400).json({ error: "newDate must be a valid ISO date string" });
        }
        // Must be at least 5 minutes in the future
        const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
        if (newDateObj < fiveMinutesFromNow) {
            return res.status(400).json({ error: "newDate must be at least 5 minutes in the future" });
        }
        // Sanity cap: no more than 365 days away
        const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        if (newDateObj > oneYearFromNow) {
            return res.status(400).json({ error: "newDate cannot be more than 1 year in the future" });
        }
        // Validate reason length
        if (reason && reason.length > 200) {
            return res.status(400).json({ error: "Reason must be 200 characters or fewer" });
        }

        // ── 5. Push audit entry ──────────────────────────
        const previousDate = p.rescheduledDate || p.appointmentDate || null;
        p.rescheduleHistory.push({
            previousDate,
            newDate: newDateObj,
            reason,
            rescheduledAt: new Date()
        });

        // ── 6. Update fields ─────────────────────────────
        p.rescheduledDate  = newDateObj;
        p.rescheduleReason = reason;
        p.rescheduleCount  = (p.rescheduleCount || 0) + 1;
        p.status           = "rescheduled";
        p.SMS_received     = 0; // Reset so cron re-sends reminder for new date

        // ── 7. Re-run ML (silently fail if ML is down) ───
        try {
            const mlPayload = {
                Age: p.Age, Gender: p.Gender, Hipertension: p.Hipertension,
                Diabetes: p.Diabetes, Alcoholism: p.Alcoholism,
                Handcap: p.Handcap, Scholarship: p.Scholarship,
                SMS_received: 0
            };
            const newMl = await getMLPredictions(mlPayload);
            p.noShowProb  = newMl.no_show_probability;
            p.smsStrategy = newMl.sms_strategy;
            console.log(`📉 ML updated for rescheduled patient ${p._id}: noShowProb = ${p.noShowProb}`);
        } catch (mlErr) {
            console.warn(`⚠️ ML update skipped for ${p._id} (ML service unavailable)`);
        }

        await p.save();

        console.log(`📅 Patient ${p.name} (${p._id}) rescheduled to ${newDateObj.toISOString()} (attempt #${p.rescheduleCount})`);

        res.json({
            message: "Appointment rescheduled successfully",
            patient: { id: p._id, ...p.toObject() },
            newDate: newDateObj.toISOString(),
            rescheduleCount: p.rescheduleCount
        });

    } catch (err) {
        console.error("❌ /reschedule error:", err.message);
        // Handle invalid MongoDB ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: "Invalid patient ID format" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

// ── SMS Cron Job ──────────────────────────────────────────────────────────
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
        
        const smsResult = await sendSmsReminder(p, "normal");
        
        if (smsResult.success) {
            p.SMS_received = 1;
            
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
                await p.save();
            } catch (e) {
                 console.error("Failed to re-fetch ML predictions for SMS update.");
            }
        }
    }
});

app.listen(PORT, () => {
    console.log(`🚀 TimeCure Backend Database Server running on port ${PORT} (Live: https://cortexcrew-timecure-1.onrender.com)`);
    console.log(`🔌 ML target pointing to: ${ML_API_URL}`);
});
