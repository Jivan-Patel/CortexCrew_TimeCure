import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import appointmentRouter from "./routes/appointment.routes.js";
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/book", appointmentRouter);

// Error handling middleware - MUST be last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;