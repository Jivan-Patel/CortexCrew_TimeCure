export const bookAppointment = async (req, res) => {
    try {
        const { Age, Gender, Hipertension, Diabetes, Alcoholism, Handcap, Scholarship, SMS_received, name } = req.body;
        
        // 1. Validation for ML required fields
        const requiredFields = ['Age', 'Gender', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'Scholarship', 'SMS_received'];
        const missingFields = requiredFields.filter(field => req.body[field] === undefined);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }
        
        // 2. Ensure numeric types to match ML strict schema
        const mlPayload = {
            Age: Number(Age),
            Gender: Number(Gender),
            Hipertension: Number(Hipertension),
            Diabetes: Number(Diabetes),
            Alcoholism: Number(Alcoholism),
            Handcap: Number(Handcap),
            Scholarship: Number(Scholarship),
            SMS_received: Number(SMS_received)
        };
        
        // Check for NaN
        if (Object.values(mlPayload).some(val => isNaN(val))) {
            return res.status(400).json({ message: "All ML fields must be numeric" });
        }

        console.log("Sending payload to ML model:", mlPayload);

        // 3. Forward to ML API
        try {
            const mlResponse = await fetch("http://localhost:5000/predict", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mlPayload)
            });
            
            if (!mlResponse.ok) {
                throw new Error(`ML API responded with status: ${mlResponse.status}`);
            }
            
            const mlData = await mlResponse.json();
            
            // 4. Send matched schema response to frontend
            res.status(200).json({
                message: "Booking successful",
                prediction: mlData.no_show_probability,
                estimatedDuration: mlData.estimated_time,
                rawMlResponse: mlData,
                patientName: name // Just returning it for completion
            });
        } catch (mlError) {
            console.error("ML Service Error:", mlError);
            res.status(502).json({ message: "Error communicating with ML service", error: mlError.message });
        }

    } catch (error) {
        console.error("Booking loop error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
