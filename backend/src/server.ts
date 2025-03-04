import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

// Connect to DB and Start Server
connectDB().then(() => {
  console.log("✅ MongoDB connected, starting server...");

  // Import routes **after** database connection is established
  import("./routes/authRoutes").then(({ default: authRoutes }) => {
    app.use("/api/auth", authRoutes);
  });

  import("./routes/valorantRoutes").then(({ default: valorantRoutes }) => {
    app.use("/api/valorant", valorantRoutes);
  });

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});
