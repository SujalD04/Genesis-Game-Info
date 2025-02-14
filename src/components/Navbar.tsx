import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, GamepadIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/60 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GamepadIcon className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent tracking-wide">
              Genesis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-blue-400 transition duration-200">
              Home
            </Link>
            <Link to="/games" className="text-gray-300 hover:text-blue-400 transition duration-200">
              Games
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-blue-400 transition duration-200">
              About
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition duration-200">
              Contact Us
            </Link>
          </div>

          {/* Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition duration-200"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60"
                  alt="Profile"
                  className="h-9 w-9 rounded-full border-2 border-blue-500"
                />
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-md shadow-lg py-1"
                  >
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition duration-200"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/privacy"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition duration-200"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/terms"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition duration-200"
                    >
                      Terms & Conditions
                    </Link>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition duration-200">
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-blue-400 transition duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/80 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition duration-200"
              >
                Home
              </Link>
              <Link
                to="/games"
                className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition duration-200"
              >
                Games
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition duration-200"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition duration-200"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
