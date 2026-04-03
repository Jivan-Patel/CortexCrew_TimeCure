require('dotenv').config();
const twilio = require('twilio');

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;

// The "from" number is the Twilio Virtual Number
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER; 

// The "to" number is the patient's number provided by you
const PATIENT_PHONE = '+918849839615'; 

const client = twilio(TWILIO_SID, TWILIO_TOKEN);

async function testSMS() {
    console.log("🚀 Attempting to send test SMS via Twilio...");
    console.log(`From (Twilio Number): ${TWILIO_PHONE}`);
    console.log(`To (Patient Number):  ${PATIENT_PHONE}`);
    console.log("-----------------------------------------");

    try {
        const message = await client.messages.create({
            body: "Hello! This is a test message from your TimeCure Smart Appointment System! 🏥",
            from: TWILIO_PHONE,
            to: PATIENT_PHONE
        });
        
        console.log("✅ SUCCESS!");
        console.log("Message SID:", message.sid);
        console.log("Status:", message.status);
    } catch (error) {
        console.error("❌ FAILED TO SEND SMS");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("\n💡 Hint: If the error says 'unverified from number', it means you need to put the virtual phone number Twilio gave you into the .env file, NOT your personal number.");
    }
}

testSMS();
