import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define a custom interface extending Express Request
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Ensure the request includes the user property
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.authToken; // Use cookies instead of headers

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey") as { userId: string };
    req.user = decoded; // Attach userId to request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
