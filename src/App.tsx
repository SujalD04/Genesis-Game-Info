import React, { useState } from 'react';
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/signin' || location.pathname === '/signup';

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
              <>
                <Hero />
                <Services />
                <Testimonials />
                <GamesAnimation />
              </>
            }
          />
          <Route path="/games" element={<GamesSection />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
