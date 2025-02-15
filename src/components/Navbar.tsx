import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, GamepadIcon, LogOut, Settings as SettingsIcon, Shield as ShieldIcon, FileText as FileTextIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../logo.png";
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };
  

  return (
    <nav className="fixed top-0 w-full bg-black/60 backdrop-blur-md shadow-md z-50 font-orbitron text-xl font-bold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-9 w-9" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent tracking-wide">
              Genesis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`relative text-gray-300 hover:text-blue-400 transition duration-200 
              after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] 
              after:bg-blue-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
              hover:after:scale-x-100 hover:after:origin-left ${
                location.pathname === '/' ? 'after:scale-x-100 after:origin-left' : ''
              }`}
            >
            Home
          </Link>

          <Link
              to="/games"
              className={`relative text-gray-300 hover:text-blue-400 transition duration-200 
                after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] 
                after:bg-blue-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
                hover:after:scale-x-100 hover:after:origin-left ${
                  location.pathname === '/games' ? 'after:scale-x-100 after:origin-left' : ''
                }`}
            >
              Games
          </Link>

          <Link
            to="/about"
            className={`relative text-gray-300 hover:text-blue-400 transition duration-200 
              after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] 
              after:bg-blue-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
              hover:after:scale-x-100 hover:after:origin-left ${
                location.pathname === '/about' ? 'after:scale-x-100 after:origin-left' : ''
              }`}
          >
            About
          </Link>
          
          <Link
            to="/contact"
            className={`relative text-gray-300 hover:text-blue-400 transition duration-200 
              after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] 
              after:bg-blue-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
              hover:after:scale-x-100 hover:after:origin-left ${
                location.pathname === '/contact' ? 'after:scale-x-100 after:origin-left' : ''
              }`}
          >
            Contact
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
                    <SettingsIcon className="inline h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <Link
                    to="/privacy"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition duration-200"
                  >
                    <ShieldIcon className="inline h-4 w-4 mr-2" />
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition duration-200"
                  >
                    <FileTextIcon className="inline h-4 w-4 mr-2" />
                    Terms & Conditions
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition duration-200"
                  >
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
          className={`block px-3 py-2 relative text-gray-300 hover:text-blue-400 transition duration-200 
            after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] 
            after:bg-blue-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
            hover:after:scale-x-100 hover:after:origin-left ${
              location.pathname === '/' ? 'after:scale-x-100 after:origin-left' : ''
            }`}
        >
          Home
        </Link>

        <Link
          to="/games"
          className={`block px-3 py-2 relative text-gray-300 hover:text-blue-400 transition duration-200 
            after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] 
            after:bg-blue-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
            hover:after:scale-x-100 hover:after:origin-left ${
              location.pathname === '/games' ? 'after:scale-x-100 after:origin-left' : ''
            }`}
        >
          Games
        </Link>

        <Link
          to="/about"
          className={`block px-3 py-2 relative text-gray-300 hover:text-blue-400 transition duration-200 
            after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] 
            after:bg-blue-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
            hover:after:scale-x-100 hover:after:origin-left ${
              location.pathname === '/about' ? 'after:scale-x-100 after:origin-left' : ''
            }`}
        >
          About
        </Link>

        <Link
          to="/contact"
          className={`block px-3 py-2 relative text-gray-300 hover:text-blue-400 transition duration-200 
            after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] 
            after:bg-blue-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
            hover:after:scale-x-100 hover:after:origin-left ${
              location.pathname === '/contact' ? 'after:scale-x-100 after:origin-left' : ''
            }`}
        >
          Contact Us
        </Link>

        {/* Profile Dropdown for Mobile */}
        <div className="border-t border-gray-700 mt-2 pt-2">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2 w-full text-gray-300 hover:text-blue-400 transition duration-200"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60"
              alt="Profile"
              className="h-9 w-9 rounded-full border-2 border-blue-500"
            />
            <span>Profile</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pl-8 mt-2 space-y-1"
            >
              <Link
                to="/settings"
                className="block text-gray-300 hover:text-blue-400 transition duration-200"
              >
                <SettingsIcon className="inline h-4 w-4 mr-2" />
                Settings
              </Link>
              <Link
                to="/privacy"
                className="block text-gray-300 hover:text-blue-400 transition duration-200"
              >
                <ShieldIcon className="inline h-4 w-4 mr-2" />
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="block text-gray-300 hover:text-blue-400 transition duration-200"
              >
                <FileTextIcon className="inline h-4 w-4 mr-2" />
                Terms & Conditions
              </Link>
              <button
              onClick={handleLogout} 
              className="w-full text-left text-gray-300 hover:text-blue-400 transition duration-200">
                <LogOut className="inline h-4 w-4 mr-2" />
                Logout
              </button>
            </motion.div>            
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

    </nav>
  );
};

export default Navbar;
