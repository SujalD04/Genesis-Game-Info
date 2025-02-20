import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WavyBackground } from './ui/wavy-background';
import Logo from '../logo.png';
import axios from 'axios';

const SignUp = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Sign-Up
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate('/'); // Redirect to homepage after successful signup
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || 'Error signing up');
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
              <label className="block text-lg text-white mb-2">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
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
            <div>
              <label className="block text-lg text-white mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                required
              />
            </div>
            <div>
              <label className="block text-lg text-white mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                required
              />
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
