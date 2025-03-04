import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import GamesAnimation from './components/GamesAnimation';
import GamesSection from './components/GamesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PageNotFound from './components/NotFound'

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
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  
  const location = useLocation();
  const [isInvalidRoute, setIsInvalidRoute] = useState(false);

  // Define valid routes (you can extend this as needed)
  const validRoutes = ['/signin', '/signup', '/', '/games', '/about', '/contact'];

  // Check for invalid route on every pathname change
  useEffect(() => {
    if (location.pathname === '*' || !validRoutes.includes(location.pathname)) {
      setIsInvalidRoute(true);
    } else {
      setIsInvalidRoute(false);
    }
  }, [location.pathname]);

  const hideNavbarFooter = isInvalidRoute || location.pathname === '/signin' || location.pathname === '/signup';

  // Dummy authentication check - Replace with actual logic
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);  
  }, []);

  useEffect(() => {
    console.log('IsAuthenticated:', isAuthenticated); // Logs to console when isAuthenticated changes
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
          {/* Navbar */}
          {!hideNavbarFooter && (
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          )}

          <main className="flex-grow">
            <Routes>
              {/* Page Not Found */}
              <Route 
                path="*" 
                element={<PageNotFound />} 
              />

              {/* Main Sections */}
              <Route 
                path="/" 
                element={isAuthenticated ? (
                  <>
                    <Hero />
                    <Services />
                    <Testimonials />
                    <GamesAnimation />
                  </>
                ) : (
                  <Navigate to="/signin" replace />
                )}
              />

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

              {/* Auth Routes */}
              <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />

              {/* Game-Specific Routes - Protected */}
              <Route 
                path="/valorant" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Valorant />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/apex" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Apex />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cod" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Cod />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cs2" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Cs2 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/d2" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <D2 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dota2" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dota2 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fortnite" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Fortnite />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lol" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Lol />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pubg" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Pubg />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rl" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Rl />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          {/* Footer */}
          {!hideNavbarFooter && <Footer />}
        </>
      )}
    </div>
  );
}

export default App;
