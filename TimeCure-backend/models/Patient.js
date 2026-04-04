const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  // Appointment Meta
  name: { type: String, required: true },
  phone: { type: String, required: true },
  
  // 🧠 ML INPUT FEATURES
  Age: { type: Number, required: true },
  Gender: { type: Number, required: true },       // 0 or 1
  Hipertension: { type: Number, required: true }, // 0 or 1
  Diabetes: { type: Number, required: true },     // 0 or 1
  Alcoholism: { type: Number, required: true },   // 0 or 1
  Handcap: { type: Number, required: true },      // 0 or 1
  Scholarship: { type: Number, required: true },  // 0 or 1
  SMS_received: { type: Number, default: 0 },     // 0 = not sent, 1 = sent

  // 📈 ML OUTPUTS
  noShowProb: { type: Number, default: 0 },
  predictedTime: { type: Number, default: 15 },
  smsStrategy: { type: String, default: "low_risk" },

  // 🏥 Queue Tracking
  status: { 
    type: String, 
    enum: ["waiting", "arrived", "in-progress", "done", "no-show"],
    default: "waiting" 
  },
  type: {
    type: String,
    enum: ["booked", "walk-in"],
    required: true
  },
  queuePosition: { type: Number },
  
  // Timestamps for performance analytics
  startTime: { type: Date },
  endTime: { type: Date },
  actualTime: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
