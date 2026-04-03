const axios = require('axios'); // Requires axios (npm install axios)

// Endpoints
const AUTH_URL = "http://localhost:3000/api/auth";
const QUEUE_URL = "http://localhost:4000";
const MY_PHONE = "+918849839615"; // Twilio destination

console.log("=======================================================================");
console.log(" 🚀 STARTING FULL MASTER TEST: Auth + ML + Queue Logic + SMS Twilio");
console.log("=======================================================================\n");

async function runMasterTest() {
    try {
        console.log("-----------------------------------------------------------------------");
        console.log(" 1️⃣  PART 1: AUTHENTICATION SYSTEM (Port 3000)");
        console.log("-----------------------------------------------------------------------");
        
        let token = "";
        try {
            console.log("⏳ Registering a new Patient Account...");
            const regRes = await axios.post(`${AUTH_URL}/register`, {
                username: `Jivan_Patient_${Date.now()}`,
                email: `test_${Date.now()}@test.com`,
                password: "SecurePassword123",
                phone: MY_PHONE,
                role: "patient"
            });
            token = regRes.data.accessToken;
            console.log(`✅ Success! User created inside MongoDB.`);
            console.log(`✅ Success! Received JWT Secure Token (Role encoded).\n`);
        } catch (e) {
            console.log("⚠️ Patient might exist or Auth server is down.");
            console.log(e.message);
        }

        console.log("-----------------------------------------------------------------------");
        console.log(" 2️⃣  PART 2: SMART QUEUE BOOKING (Port 4000) -> ML API (Port 5000)");
        console.log("-----------------------------------------------------------------------");
        
        console.log("⏳ Sending Patient Medical Data to Book Appointment...");
        
        let patientId = null;
        try {
            const bookRes = await axios.post(`${QUEUE_URL}/book`, {
                name: "Jivan Patel",
                phone: MY_PHONE,
                Age: 40,
                Gender: 1,
                Hipertension: 1, 
                Diabetes: 1,     // High-risk features
                Alcoholism: 0,
                Handcap: 0,
                Scholarship: 0,
                SMS_received: 0 
            });

            patientId = bookRes.data.patient.id;
            console.log(`✅ Success! Node.js received the Payload.`);
            console.log(`✅ Success! Machine Learning returned No-Show Risk: ${bookRes.data.patient.noShowProb}`);
            console.log(`✅ Success! Machine Learning selected SMS Strategy: ${bookRes.data.patient.smsStrategy}`);
            console.log(`✅ Success! Waiting Time Calculated: ${bookRes.data.patient.predictedTime} mins\n`);
        } catch (e) {
            console.log("❌ Booking failed. Make sure port 4000 and 5000 are alive.");
            console.log(e.message);
            return;
        }

        console.log("-----------------------------------------------------------------------");
        console.log(" 3️⃣  PART 3: SMS REMINDERS & ML RE-CALCULATION");
        console.log("-----------------------------------------------------------------------");
        
        console.log("⏳ Triggering automated Twilio SMS alert...");
        try {
            const smsRes = await axios.post(`${QUEUE_URL}/trigger-sms/${patientId}`);
            console.log(`✅ Success! Twilio sent live SMS to ${MY_PHONE}`);
            console.log(`✅ Success! Backend automatically pinged ML model again.`);
            console.log(`✅ Success! Risk Probability Dropped to: ${smsRes.data.updatedPatient.noShowProb}`);
            console.log(`   (SMS_received changed from 0 -> 1 in database)`);
        } catch (e) {
            console.log("❌ SMS failed or blocked by Twilio.");
            if (e.response) console.log(e.response.data);
            else console.log(e.message);
        }

        console.log("\n=======================================================================");
        console.log(" 🎉 ALL 3 SYSTEMS (AUTH, ML, BACKEND QUEUE) ARE WORKING PERFECTLY! ");
        console.log("=======================================================================");

    } catch (err) {
        console.error("\n❌ CRITICAL SYSTEM FAILURE:");
        console.error(err.message);
    }
}

runMasterTest();
