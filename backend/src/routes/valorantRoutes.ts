import express from "express";
import { fetchValorantContent } from "../services/valorantService";
import ValorantModel from "../models/Valorant";

const router = express.Router();

// Fetch & Store Data
router.get("/update-content", async (req, res) => {
  try {
    const data = await fetchValorantContent();
    res.json({ message: "Valorant data updated successfully", data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get Stored Data
router.get("/content", async (req, res) => {
  try {
    const content = await ValorantModel.findOne().lean();
    if (!content) return res.status(404).json({ message: "No data found" });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
