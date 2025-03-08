import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WavyBackground } from './ui/wavy-background';
import Logo from '../logo.png';
import axios from 'axios';

const SignIn = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Email/Password Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signin",
        { email, password },
        { withCredentials: true } // ✅ Enables sending/receiving cookies
      );
  
      if (response.status === 200) {
        setIsAuthenticated(true);  
        navigate("/");  
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.msg || "Error signing in");
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
          <h2 className="text-4xl font-semibold text-white mb-6 text-center">Sign In</h2>
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div>
              <label className="block text-lg text-white mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-lg text-white mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
            <button className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-lg transition duration-300 mt-4">
              Sign In
            </button>
            <p className="text-md text-center text-gray-400 mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
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
            Explore in-depth analytics, statistics, and updates for all your favorite games.
          </p>
        </div>
      </div>
    </WavyBackground>
  );
};

export default SignIn;
