import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: Number,
    required: true
  },
  appointmentId: {
    type: Number,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ["M", "F"]
  },
  scheduledDay: {
    type: Date
  },
  appointmentDay: {
    type: Date
  },
  age: {
    type: Number,
    min: 0
  },
  neighbourhood: {
    type: String
  },
  scholarship: {
    type: Boolean
  },
  hypertension: {
    type: Boolean
  },
  diabetes: {
    type: Boolean
  },
  alcoholism: {
    type: Boolean
  },
  handicap: {
    type: Number
  },
  smsReceived: {
    type: Boolean
  },
  noShow: {
    type: Boolean
  }
}, { timestamps: true });

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;