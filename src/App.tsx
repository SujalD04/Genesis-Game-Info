import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import ProtectedRoute from './components/protectedRoutes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Make sure your firebase config is correctly imported

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/signin' || location.pathname === '/signup';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Sets true if user exists, false otherwise
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {!hideNavbarFooter && (
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      )}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Hero />
                  <Services />
                  <Testimonials />
                  <GamesAnimation />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GamesSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signin"
            element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
