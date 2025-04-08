import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import GamesAnimation from './components/GamesAnimation';
import GamesSection from './components/GamesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import SignIn from './components/signin';
import SignUp from './components/signup';
import PageNotFound from './components/NotFound';
import Settings from './components/Settings';
import PrivacyPolicy from './components/Privacy';
import TermsAndConditions from './components/Terms';
import { Analytics } from "@vercel/analytics/react"

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

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);  
  const location = useLocation();
  const [isInvalidRoute, setIsInvalidRoute] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/protected`, {
          withCredentials: true,
        });        
  
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
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
                element={
                  <>
                    <Hero />
                    <Services />
                    <Testimonials />
                    <GamesAnimation />
                  </>
                  }
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

              <Route
                path="/settings"
                element = {isAuthenticated ? <Settings /> : <Navigate to="/signin" replace />}
              />  

              <Route
                path="/privacy"
                element = {isAuthenticated ? <PrivacyPolicy /> : <Navigate to="/signin" replace />}
              />

              <Route
                path="/terms"
                element = {isAuthenticated ? <TermsAndConditions /> : <Navigate to="/signin" replace />}
              />


              {/* Auth Routes */}
              <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />

              {/* Game-Specific Routes*/}
              <Route 
                path="/valorant" 
                element = {isAuthenticated ? <Valorant /> : <Navigate to="/signin" replace />} 
              />
              <Route 
                path="/apex" 
                element = {isAuthenticated ? <Apex /> : <Navigate to="/signin" replace />}
              />
              <Route 
                path="/cod" 
                element = {isAuthenticated ? <Cod /> : <Navigate to="/signin" replace />}
              />
              <Route 
                path="/cs2" 
                element = {isAuthenticated ? <Cs2 /> : <Navigate to="/signin" replace />}
              />
              <Route 
                path="/d2" 
                element = {isAuthenticated ? <D2 /> : <Navigate to="/signin" replace />} 
              />
              <Route 
                path="/dota2" 
                element = {isAuthenticated ? <Dota2 /> : <Navigate to="/signin" replace />}
              />
              <Route 
                path="/fortnite" 
                element = {isAuthenticated ? <Fortnite /> : <Navigate to="/signin" replace />}
              />
              <Route 
                path="/lol" 
                element = {isAuthenticated ? <Lol /> : <Navigate to="/signin" replace />} 
              />
              <Route 
                path="/pubg" 
                element = {isAuthenticated ? <Pubg /> : <Navigate to="/signin" replace /> }
              />
              <Route 
                path="/rl" 
                element = {isAuthenticated ? <Rl /> : <Navigate to="/signin" replace />}
              />
            </Routes>
          </main>

          {/* Footer */}
          {!hideNavbarFooter && <Footer />}

          {/*Analytics */}
          <Analytics />
        </>
      )}
    </div>
  );
}

export default App;
