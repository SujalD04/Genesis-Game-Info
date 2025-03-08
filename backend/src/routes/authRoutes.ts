import express, { Request, Response } from "express"; // Import Request and Response types
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { body, validationResult } from "express-validator";
import verifyToken from "../middlewares/authMiddleware";

const router = express.Router();

// Define a custom interface extending Express Request
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Ensure the request includes the user property
}

// Signup Route
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
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
      const token = jwt.sign(payload, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "1h" });

      // Set httpOnly Cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, // Fix: Removed incorrect semicolon
      });

      res.json({ msg: "Signup successful" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Signin Route
router.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: "1h" });

    // Fix: Store token in httpOnly Cookie instead of returning it in JSON
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ msg: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Logout Route
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("authToken", { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ msg: "Logged out" });
});

// Protected Route
router.get("/protected", verifyToken, (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user; // Type assertion
  res.json({ msg: "You are authenticated!", user });
});

router.get("/auth/status", (req: Request, res: Response) => {
  const token = req.cookies.authToken; // Get the cookie

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
    res.json({ isAuthenticated: true, user: decoded });
  } catch (err) {
    res.json({ isAuthenticated: false });
  }
});



export default router;
