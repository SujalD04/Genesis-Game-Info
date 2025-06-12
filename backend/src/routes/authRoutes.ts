// backend/src/routes/authRoutes.ts
import express, { Request, Response } from "express"; // Import Request and Response types
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { body, validationResult } from "express-validator";
import verifyToken from "../middlewares/authMiddleware"; // Assuming this is your authMiddleware

const router = express.Router();

// Define a custom interface extending Express Request
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Ensure the request includes the user property
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}$/;

// Signup Route
router.post(
  "/signup",
  [
    body("email").matches(emailRegex).isEmail().withMessage("Invalid email"),
    body("password").matches(passwordRegex).withMessage("Password must be at least 8 characters, include a letter, a number and a special character."),
    body("username").notEmpty().withMessage("Username is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      const payload = { userId: newUser.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "7d" });

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // --- START CHANGE ---
        // Changed sameSite to "none" for cross-domain cookie sending.
        // Requires secure: true, which is handled by process.env.NODE_ENV === "production"
        sameSite: "none",
        // --- END CHANGE ---
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ msg: "Signup successful" });
    } catch (err) {
      console.error("Signup error:", err); // More specific logging
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Signin Route
router.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Account does not exist. Please Create a new account." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Email or Password might be wrong." });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "7d" });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // --- START CHANGE ---
      // Changed sameSite to "none" for cross-domain cookie sending.
      sameSite: "none",
      // --- END CHANGE ---
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ msg: "Login successful" });
  } catch (err) {
    console.error("Signin error:", err); // More specific logging
    res.status(500).json({ msg: "Server error" });
  }
});

// Logout Route
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // --- START CHANGE ---
    // Changed sameSite to "none" for cross-domain cookie clearing.
    sameSite: "none",
    // --- END CHANGE ---
  });
  res.json({ msg: "Logged out" });
});

// Protected Route (used by the frontend for initial authentication check)
router.get("/protected", verifyToken, (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user; // Type assertion
  res.json({ msg: "You are authenticated!", user });
});

// Changed path from "/auth/status" to just "/status"
// Because app.use('/api/auth', authRoutes) already adds '/api/auth/'
router.get("/status", (req: Request, res: Response) => {
  console.log("Received GET /api/auth/status request"); // Added for debugging Render logs
  const token = req.cookies.authToken; // Get the cookie

  if (!token) {
    console.log("No auth token found in cookie."); // Debugging
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
    console.log("Auth token verified successfully."); // Debugging
    res.json({ isAuthenticated: true, user: decoded });
  } catch (err) {
    console.error("Auth status verification failed:", err); // More specific logging
    res.json({ isAuthenticated: false });
  }
});

export default router;
