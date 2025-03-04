import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll'

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate content loading with a timeout
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the time as needed
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Loading Animation */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex justify-center items-center absolute inset-0 z-10 top-0 bottom-0"
        >
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid"></div>
        </motion.div>
      )}

      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* Content */}
      {!loading && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                Your one stop for
              </span>
              <br />
              Game Insights
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore in-depth game details, discover key stats, and stay up to date with the latest game info on Genesis 
            – your ultimate gaming resource.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                onClick={() => navigate('/games')}
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>

            <Link
            to="services-section"
            smooth={true}
            duration={100}
            className='inline-block'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-blue-500 text-blue-500 rounded-full font-semibold hover:bg-blue-500/10 transition-colors"
              >
                Learn More
              </motion.button>
            </Link> 
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Hero;
