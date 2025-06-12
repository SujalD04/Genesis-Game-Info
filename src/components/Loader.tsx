import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  // Animation variants for the container
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1, // Stagger the animation of child elements
        delayChildren: 0.2,
      },
    },
  };

  // Animation variants for each individual sphere
  const sphereVariants = {
    initial: {
      y: "0%", // Start at current position
    },
    animate: {
      y: ["0%", "-40%", "0%"], // Animate up and down
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity, // Repeat indefinitely
        repeatDelay: 0.1,
      },
    },
  };

  return (
    <div className="flex justify-center items-center h-full min-h-[300px] bg-transparent">
      <motion.div
        className="flex space-x-3" // Container for the spheres, with spacing
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* First sphere */}
        <motion.span
          className="block w-8 h-8 rounded-full bg-blue-500 shadow-lg" // Blue sphere
          variants={sphereVariants}
          style={{ transitionDelay: '0s' }} // Stagger delay for animation
        />
        {/* Second sphere */}
        <motion.span
          className="block w-8 h-8 rounded-full bg-blue-400 shadow-lg" // Slightly lighter blue
          variants={sphereVariants}
          style={{ transitionDelay: '0.1s' }} // Stagger delay for animation
        />
        {/* Third sphere */}
        <motion.span
          className="block w-8 h-8 rounded-full bg-blue-300 shadow-lg" // Even lighter blue
          variants={sphereVariants}
          style={{ transitionDelay: '0.2s' }} // Stagger delay for animation
        />
      </motion.div>
    </div>
  );
};

export default Loader;
