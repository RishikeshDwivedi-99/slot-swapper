import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import swapRoutes from "./routes/swaps.js";

connectDB();

const app = express();

// --- New, more robust CORS configuration ---
const allowedOrigins = [process.env.CORS_ORIGIN];

app.use(cors({
  origin: function (origin, callback) {
    
    // Log the origin of every request
    console.log('--- INCOMING REQUEST ORIGIN:', origin);

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin: ' + origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// --- End of new CORS code ---
app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/swaps", swapRoutes);

app.get("/", (req, res) => {
  res.send("SlotSwapper API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
