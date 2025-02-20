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
import ProtectedRoute from './components/ProtectedRoutes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// ✅ Ensure correct imports for game pages
import Valorant from './pages/Valorant';
import Apex from './pages/Apex';
import Cod from './pages/Cod';
import Cs2 from './pages/Cs2';
import D2 from './pages/D2';
import Dota2 from './pages/Dota2';
import Fortnite from './pages/Fortnite';
import Lol from './pages/Lol';
import Pubg from './pages/Pubg';
import Rl from './pages/Rl';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/signin' || location.pathname === '/signup';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
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
          {/* Protected Main Sections */}
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
          <Route path="/games" element={<ProtectedRoute><GamesSection /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutSection /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><ContactSection /></ProtectedRoute>} />

          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Game-Specific Routes */}
          <Route path="/valorant" element={<ProtectedRoute><Valorant /></ProtectedRoute>} />
          <Route path="/apex" element={<ProtectedRoute><Apex /></ProtectedRoute>} />
          <Route path="/cod" element={<ProtectedRoute><Cod /></ProtectedRoute>} />
          <Route path="/cs2" element={<ProtectedRoute><Cs2 /></ProtectedRoute>} />
          <Route path="/d2" element={<ProtectedRoute><D2 /></ProtectedRoute>} />
          <Route path="/dota2" element={<ProtectedRoute><Dota2 /></ProtectedRoute>} />
          <Route path="/fortnite" element={<ProtectedRoute><Fortnite /></ProtectedRoute>} />
          <Route path="/lol" element={<ProtectedRoute><Lol /></ProtectedRoute>} />
          <Route path="/pubg" element={<ProtectedRoute><Pubg /></ProtectedRoute>} />
          <Route path="/rl" element={<ProtectedRoute><Rl /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
