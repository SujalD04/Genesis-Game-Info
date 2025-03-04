import express, { Request, Response } from 'express'; // Import Request and Response types
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Signup Route
router.post('/signup', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').notEmpty().withMessage('Username is required')
  ], async (req: Request, res: Response) => {  // Explicitly type req and res
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password, username } = req.body;
    
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      const payload = { userId: newUser.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'yourSecretKey', { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

// Signin Route
router.post('/signin', async (req: Request, res: Response) => {  // Explicitly type req and res
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'yourSecretKey', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
