// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
// The BrowserRouter is typically used higher up in the component tree, often in index.tsx
// import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; // motion is required for the embedded Loader component

// Assuming these component files exist in your project structure
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import GamesAnimation from './components/GamesAnimation';
import GamesSection from './components/GamesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import PageNotFound from './components/NotFound';
import Settings from './components/Settings';
import PrivacyPolicy from './components/Privacy';
import TermsAndConditions from './components/Terms';
import { Analytics } from "@vercel/analytics/react"

// Assuming these page component files exist in your project structure
import Valorant from './pages/valorant';
import Apex from './pages/apex';
import Cod from './pages/cod';
import Cs2 from './pages/cs2';
import D2 from './pages/d2';
import Dota2 from './pages/dota2';
import Fortnite from './pages/fortnite';
import Lol from './pages/lol';
import Pubg from './pages/pubg';
import Rl from './pages/rl';
import Rivals from './pages/rivals';

// Embedded Loader component directly within this file to avoid import resolution issues
const Loader = () => {
  const [progress, setProgress] = useState(0);
  
  // Simulate loading progress over 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4; // Increment by 2% every 100ms (5 seconds total)
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Outer ring rotation animation
  const outerRingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  // Inner ring counter-rotation animation
  const innerRingVariants = {
    animate: {
      rotate: -360,
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  // Pulsing center circle animation
  const centerVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  // Floating particles animation
  const particleVariants = {
    animate: {
      y: [-20, -40, -20],
      x: [-10, 10, -10],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 2.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  // Progress text animation
  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background animated gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black/40 via-gray-900/20 to-black/40"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full blur-sm"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          variants={particleVariants}
          animate="animate"
          transition={{
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Main loader container */}
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="w-32 h-32 border-4 border-transparent rounded-full"
          style={{ 
            borderTopColor: '#164491',
            borderRightColor: '#164491' + 'CC'
          }}
          variants={outerRingVariants}
          animate="animate"
        />

        {/* Inner counter-rotating ring */}
        <motion.div
          className="absolute top-2 left-2 w-28 h-28 border-4 border-transparent rounded-full"
          style={{ 
            borderBottomColor: '#164491' + 'AA',
            borderLeftColor: '#164491' + 'DD'
          }}
          variants={innerRingVariants}
          animate="animate"
        />

        {/* Pulsing center circle */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-16 h-16 -mt-8 -ml-8 rounded-full shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, #164491, #164491)`,
            boxShadow: `0 0 15px rgb(22,68,145, 0.4)`
          }}
          variants={centerVariants}
          animate="animate"
        />

        {/* Inner glow effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-12 h-12 -mt-6 -ml-6 rounded-full blur-sm"
          style={{ backgroundColor: '#164491' + '30' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-64 h-2 bg-black/80 rounded-full overflow-hidden backdrop-blur-sm border border-gray-900/60">
        <motion.div
          className="h-full rounded-full shadow-lg"
          style={{ 
            background: `linear-gradient(90deg, #164491, #164491, #164491)`,
            boxShadow: `0 0 15px rgba(60, 243, 134, 0.4)`
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Progress text */}
      <motion.div
        className="mt-4 text-center"
        variants={textVariants}
        animate="animate"
      >
        <div className="text-2xl font-bold mb-1" style={{ color: '#164491' }}>
          {progress}%
        </div>
        <div className="text-sm font-medium tracking-wider" style={{ color: '#164491' + 'AA' }}>
          {progress < 25 && "INITIALIZING..."}
          {progress >= 25 && progress < 50 && "LOADING RESOURCES..."}
          {progress >= 50 && progress < 75 && "PROCESSING DATA..."}
          {progress >= 75 && progress < 100 && "FINALIZING..."}
          {progress === 100 && "COMPLETE!"}
        </div>
      </motion.div>

      {/* Decorative corner elements */}
      <motion.div
        className="absolute top-4 left-4 w-3 h-3 rounded-full"
        style={{ backgroundColor: '#164491' }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute top-4 right-4 w-3 h-3 rounded-full"
        style={{ backgroundColor: '#164491' + 'CC' }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-4 left-4 w-3 h-3 rounded-full"
        style={{ backgroundColor: '#164491' + 'AA' }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1.5,
        }}
      />
      <motion.div
        className="absolute bottom-4 right-4 w-3 h-3 rounded-full"
        style={{ backgroundColor: '#164491' + 'DD' }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />
    </div>
  );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initial state is loading
  const location = useLocation();
  const [isInvalidRoute, setIsInvalidRoute] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Using import.meta.env

  // Define valid routes to determine Navbar/Footer visibility and handle invalid routes
  const validRoutes = [
    '/signin', '/signup', '/', '/games', '/about', '/contact',
    '/settings', '/privacy', '/terms',
    '/valorant', '/apex', '/cod', '/cs2', '/d2', '/dota2',
    '/fortnite', '/lol', '/pubg', '/rl', '/rivals'
  ];

  // Effect to check for invalid routes based on current pathname
  useEffect(() => {
    const isKnownRoute = validRoutes.some(route => {
      return route === location.pathname;
    });
    // Set isInvalidRoute based on whether the current path is NOT in validRoutes AND it's not the root
    setIsInvalidRoute(!isKnownRoute && location.pathname !== '/');
  }, [location.pathname, validRoutes]);

  const hideNavbarFooter = isInvalidRoute || location.pathname === '/signin' || location.pathname === '/signup';

  // Main useEffect for authentication and loading state management
  useEffect(() => {
    // Only run auth check and global loader if the route is valid
    if (!isInvalidRoute) {
      const checkAuthAndLoad = async () => {
        // Create a promise for a minimum loading time of 5 seconds
        const minLoadTimePromise = new Promise(resolve => setTimeout(resolve, 5000));

        try {
          // Await both the minimum load time and the actual authentication status check
          const [_, authResponse] = await Promise.all([
            minLoadTimePromise, // Ensures loader is shown for at least this duration
            axios.get(`${API_BASE_URL}/api/auth/status`, { withCredentials: true })
          ]);

          // Update authentication state based on the API response
          if (authResponse.data && typeof authResponse.data.isAuthenticated === 'boolean') {
            setIsAuthenticated(authResponse.data.isAuthenticated);
          } else {
            console.warn("Unexpected response structure from /api/auth/status:", authResponse.data);
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Log authentication check errors and set isAuthenticated to false
          console.error("Authentication check failed:", error);
          setIsAuthenticated(false);
        } finally {
          // Always set loading to false after both promises have resolved
          setLoading(false);
        }
      };
      checkAuthAndLoad(); // Execute the async function
    } else {
      // If the route is invalid, ensure loading is immediately false
      setLoading(false);
    }
  }, [API_BASE_URL, isInvalidRoute]); // Dependency array includes API_BASE_URL and isInvalidRoute

  // Effect for debugging authentication state changes
  useEffect(() => {
    console.log('IsAuthenticated:', isAuthenticated); // Logs current authentication status
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Conditional rendering for PageNotFound, Loader, or Main Content */}
      {isInvalidRoute ? (
        <PageNotFound /> // Render PageNotFound instantly for invalid routes
      ) : (
        loading ? (
          // Display the custom Loader component while valid routes are loading
          <div className="flex justify-center items-center h-screen">
            <Loader />
          </div>
        ) : (
          // Render main application content once loading is complete for valid routes
          <>
            {/* Navbar component, conditionally rendered */}
            {!hideNavbarFooter && (
              <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            )}

            <main className="flex-grow">
              {/* React Router Routes for navigation */}
              <Routes>
                {/* No explicit Route for "*" here, as it's handled by isInvalidRoute check at top level */}

                {/* Main landing page route */}
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <Services />
                      <Testimonials />
                      <GamesAnimation />
                    </>
                  }
                />

                {/* Protected Routes: accessible only if isAuthenticated is true, otherwise redirects to signin */}
                <Route
                  path="/games"
                  element={isAuthenticated ? <GamesSection /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/about"
                  element={isAuthenticated ? <AboutSection /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/contact"
                  element={isAuthenticated ? <ContactSection /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/settings"
                  element={isAuthenticated ? <Settings /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/privacy"
                  element={isAuthenticated ? <PrivacyPolicy /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/terms"
                  element={isAuthenticated ? <TermsAndConditions /> : <Navigate to="/signin" replace />}
                />

                {/* Authentication Routes: accessible regardless of authentication status */}
                <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />

                {/* Game-Specific Routes: also protected */}
                <Route
                  path="/valorant"
                  element={isAuthenticated ? <Valorant /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/apex"
                  element={isAuthenticated ? <Apex /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/cod"
                  element={isAuthenticated ? <Cod /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/cs2"
                  element={isAuthenticated ? <Cs2 /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/d2"
                  element={isAuthenticated ? <D2 /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/dota2"
                  element={isAuthenticated ? <Dota2 /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/fortnite"
                  element={isAuthenticated ? <Fortnite /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/lol"
                  element={isAuthenticated ? <Lol /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/pubg"
                  element={isAuthenticated ? <Pubg /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/rl"
                  element={isAuthenticated ? <Rl /> : <Navigate to="/signin" replace />}
                />
                <Route
                  path="/rivals"
                  element={isAuthenticated ? <Rivals /> : <Navigate to="/signin" replace />}
                />
              </Routes>
            </main>

            {/* Footer component, conditionally rendered */}
            {!hideNavbarFooter && <Footer />}

            {/* Vercel Analytics component */}
            <Analytics />
          </>
        )
      )}
    </div>
  );
}

export default App;

