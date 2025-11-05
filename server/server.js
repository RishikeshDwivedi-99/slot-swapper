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

app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/swaps", swapRoutes);

app.get("/", (req, res) => {
  res.send("SlotSwapper API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
