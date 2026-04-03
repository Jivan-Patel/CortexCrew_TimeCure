import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/database.js";

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
}

connectDB();

app.listen(3000, () => {
    console.log(`Server running on 3000...`);
});