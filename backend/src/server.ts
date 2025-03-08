import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import valorantRoutes from "./routes/valorantRoutes";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "https://genesis-game-info.vercel.app/"], methods: ["GET", "POST"], allowedHeaders: ["Content-Type"], credentials: true, }));
app.use(express.json());
app.use(cookieParser());

// Connect to DB and Start Server
connectDB().then(() => {
  console.log("✅ MongoDB connected, starting server...");

  app.use('/api/auth', authRoutes);

  app.use("/api/valorant", valorantRoutes);

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});
