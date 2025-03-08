import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WavyBackground } from './ui/wavy-background';
import Logo from '../logo.png';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";

interface SignUpProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const SignUp: React.FC<SignUpProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Moved outside
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value });
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handle Sign-Up
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send sign-up request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      

      if (response.status === 200) {
        setIsAuthenticated(true); 
        navigate('/'); 
      } else {
        setError('Error signing up');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Sign-up error:", error.response?.data || error);
        setError(error.response?.data?.errors?.[0]?.msg || "Error signing up");
      } else {
        console.error("Sign-up error:", error);
        setError("Error signing up");
      }
    }    
  };

  return (
    <WavyBackground>
      <div className="flex items-center justify-center min-h-screen w-full max-w-6xl mx-auto px-4">
        {/* Left Section: Form */}
        <motion.div
          className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 rounded-xl shadow-lg w-full md:w-2/5"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-semibold text-white mb-6 text-center">Sign Up</h2>
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label className="block text-lg text-white mb-2">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                required
              />
            </div>
            <div>
              <label className="block text-lg text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-lg text-white mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"} // ✅ Dynamically change type
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange} // ✅ Corrected function
                className="w-full p-4 pr-12 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-14 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative mt-4">
              <label className="block text-lg text-white mb-2">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"} // ✅ Keep it consistent
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange} // ✅ Corrected function
                className="w-full p-4 pr-12 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-14 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
            <button className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-lg transition duration-300 mt-4">
              Sign Up
            </button>
            <p className="text-md text-center text-gray-400 mt-4">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link>
            </p>
          </form>
        </motion.div>

        {/* Right Section: Logo and Description */}
        <div className="hidden md:flex w-3/5 flex-col items-center justify-center text-center p-12">
          <img
            src={Logo}
            alt="Logo"
            className="w-48 mb-6 drop-shadow-lg shadow-black"
          />
          <h1 className="text-6xl font-orbitron text-white mb-4">Genesis</h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            Join now to get access to the latest game analytics, statistics, and updates.
          </p>
        </div>
      </div>
    </WavyBackground>
  );
};

export default SignUp;
