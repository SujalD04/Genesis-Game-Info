import express, { Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs"; // Added bcrypt for password hashing
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/valorantDB";
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const REGION = "ap";

// Middleware
app.use(cors());
app.use(express.json());

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// User Model
const User = mongoose.model('User', userSchema);

// API Route to handle signup data
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});

// API Route to handle login data
app.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Compare the password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // If everything matches, respond with success
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Check if Riot API Key exists
if (!RIOT_API_KEY) {
  console.error("Error: RIOT_API_KEY is missing in .env");
  process.exit(1);
}

// TypeScript Interface for MongoDB Schema
interface IValorantContent extends Document {
  version: string;
  characters: { id: string; name: string }[];
  maps: { id: string; name: string; image?: string }[];
  chromas: { id: string; name: string }[];
  skins: { id: string; name: string; image?: string }[];
  skinLevels: { id: string; name: string }[];
  equips: { id: string; name: string }[];
  gameModes: { id: string; name: string; image?: string }[];
  sprays: { id: string; name: string; image?: string }[];
  sprayLevels: { id: string; name: string }[];
  charms: { id: string; name: string }[];
  charmLevels: { id: string; name: string }[];
  playerCards: { id: string; name: string; image?: string }[];
  playerTitles: { id: string; name: string }[];
  acts: { id: string; name: string }[];
}

// Define Mongoose Schema for Valorant content
const valorantSchema = new Schema<IValorantContent>(
  {
    version: String,
    characters: [{ id: String, name: String }],
    maps: [{ id: String, name: String, image: String }],
    chromas: [{ id: String, name: String }],
    skins: [{ id: String, name: String, image: String }],
    skinLevels: [{ id: String, name: String }],
    equips: [{ id: String, name: String }],
    gameModes: [{ id: String, name: String, image: String }],
    sprays: [{ id: String, name: String, image: String }],
    sprayLevels: [{ id: String, name: String }],
    charms: [{ id: String, name: String }],
    charmLevels: [{ id: String, name: String }],
    playerCards: [{ id: String, name: String, image: String }],
    playerTitles: [{ id: String, name: String }],
    acts: [{ id: String, name: String }],
  },
  { collection: "valorant" }
);

const ValorantModel = mongoose.model<IValorantContent>("Valorant", valorantSchema);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Fetch Data from Riot API and Store in MongoDB
app.get("/api/update-content", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`https://${REGION}.api.riotgames.com/val/content/v1/contents`, {
      headers: { "X-Riot-Token": RIOT_API_KEY },
    });

    const {
      version,
      characters,
      maps,
      chromas,
      skins,
      skinLevels,
      equips,
      gameModes,
      sprays,
      sprayLevels,
      charms,
      charmLevels,
      playerCards,
      playerTitles,
      acts,
    } = response.data;

    const formattedData = {
      version,
      characters: characters.map((char: any) => ({ id: char.id, name: char.name })),
      maps: maps.map((map: any) => ({ id: map.id, name: map.name, image: `https://valorant-api.com/assets/${map.assetPath}` })),
      chromas: chromas.map((chroma: any) => ({ id: chroma.id, name: chroma.name })),
      skins: skins.map((skin: any) => ({ id: skin.id, name: skin.name, image: `https://valorant-api.com/assets/${skin.assetPath}` })),
      skinLevels: skinLevels.map((level: any) => ({ id: level.id, name: level.name })),
      equips: equips.map((equip: any) => ({ id: equip.id, name: equip.name })),
      gameModes: gameModes.map((mode: any) => ({ id: mode.id, name: mode.name, image: `https://valorant-api.com/assets/${mode.assetPath}` })),
      sprays: sprays.map((spray: any) => ({ id: spray.id, name: spray.name, image: `https://valorant-api.com/assets/${spray.assetPath}` })),
      sprayLevels: sprayLevels.map((level: any) => ({ id: level.id, name: level.name })),
      charms: charms.map((charm: any) => ({ id: charm.id, name: charm.name })),
      charmLevels: charmLevels.map((level: any) => ({ id: level.id, name: level.name })),
      playerCards: playerCards.map((card: any) => ({ id: card.id, name: card.name, image: `https://valorant-api.com/assets/${card.assetPath}` })),
      playerTitles: playerTitles.map((title: any) => ({ id: title.id, name: title.name })),
      acts: acts.map((act: any) => ({ id: act.id, name: act.name })),
    };

    // Update MongoDB (insert if not exists)
    await ValorantModel.findOneAndUpdate({}, formattedData, { upsert: true, new: true });

    res.json({ message: "Data updated successfully", data: formattedData });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Fetch Data from MongoDB
app.get("/api/content", async (req: Request, res: Response) => {
  try {
    const content: IValorantContent | null = await ValorantModel.findOne().lean();
    if (!content) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
