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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // New loading state
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/signin' || location.pathname === '/signup';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);  // Set loading to false once auth state is checked
    });

    // Simulate other loading or API fetching processes if needed
    setTimeout(() => setLoading(false), 3000);  // Simulate some loading delay (e.g., fetching data)

    return () => unsubscribe();
  }, []);

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
              {/* Main Sections */}
              <Route path="/" element={<><Hero /><Services /><Testimonials /><GamesAnimation /></>} />
              <Route path="/games" element={<GamesSection />} />
              <Route path="/about" element={<AboutSection />} />
              <Route path="/contact" element={<ContactSection />} />

              {/* Auth Routes */}
              <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Game-Specific Routes */}
              <Route path="/valorant" element={<Valorant />} />
              <Route path="/apex" element={<Apex />} />
              <Route path="/cod" element={<Cod />} />
              <Route path="/cs2" element={<Cs2 />} />
              <Route path="/d2" element={<D2 />} />
              <Route path="/dota2" element={<Dota2 />} />
              <Route path="/fortnite" element={<Fortnite />} />
              <Route path="/lol" element={<Lol />} />
              <Route path="/pubg" element={<Pubg />} />
              <Route path="/rl" element={<Rl />} />
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
