const axios = require('axios');

const BASE_URL = "https://cortexcrew-timecure-1.onrender.com"; // TimeCure-backend (Live)
const MY_PHONE = "+918849839615"; // The user's requested phone number

async function testFullFlow() {
    console.log("====================================================");
    console.log("🏥 Testing Full End-to-End Flow (Backend + ML + SMS)");
    console.log("====================================================\n");

    try {
        // 1. BOOK A HIGH-RISK PATIENT
        console.log("⏳ 1. Booking a high-risk patient...");
        const bookPayload = {
            name: "Jivan Patel",
            phone: MY_PHONE,
            Age: 25,
            Gender: 1,
            Hipertension: 0,
            Diabetes: 0,
            Alcoholism: 1, // Features chosen to increase no-show prob
            Handcap: 0,
            Scholarship: 1
        };

        let res = await axios.post(`${BASE_URL}/book`, bookPayload);
        const patientId = res.data.patient.id;
        console.log("✅ Booking Successful!");
        console.log(`   Name: ${res.data.patient.name}`);
        console.log(`   Initial No-Show Risk: ${res.data.patient.noShowProb}`);
        console.log(`   Initial SMS Strategy: ${res.data.patient.smsStrategy}`);
        console.log(`   Current Queue Status: ${res.data.patient.status}`);

        console.log("\n----------------------------------------------------");

        // 2. CHECK QUEUE BEFORE SMS
        console.log("⏳ 2. Fetching current queue...");
        res = await axios.get(`${BASE_URL}/queue`);
        console.log(`   Patients in queue: ${res.data.length}`);
        console.log(`   Wait time for Jivan: ${res.data[0].waitTime} mins`);

        console.log("\n----------------------------------------------------");

        // 3. TRIGGER MANUAL SMS VIA TWILIO (to simulate the automated cron job)
        console.log(`⏳ 3. Triggering SMS for Patient ID ${patientId}... (Backend will text and call ML again)`);

        // We will hit the manual trigger endpoint we built into server.js
        res = await axios.post(`${BASE_URL}/trigger-sms/${patientId}`, { type: "urgent" });

        console.log("✅ SMS Trigger Response:");
        console.log(`   Message: ${res.data.message}`);
        console.log(`   NEW Updated No-Show Risk: ${res.data.updatedPatient.noShowProb}`);
        console.log(`   Did SMS_received change to 1? ${res.data.updatedPatient.SMS_received === 1 ? 'YES' : 'NO'}`);

        console.log("\n====================================================");
        console.log("🎉 Test Complete. Check your phone for the SMS!");
        console.log("====================================================");

    } catch (err) {
        console.error("❌ Test Failed!");
        if (err.response) {
            console.error(err.response.data);
        } else {
            console.error(err.message);
            console.error("Make sure Python ML (port 5000) and Node Backend (port 4000) are both running!");
        }
    }
}

testFullFlow();
