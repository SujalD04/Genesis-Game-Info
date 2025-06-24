import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Play, Sparkles, Gamepad2, Trophy, Users } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated gradient background
      gsap.to(gradientRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      // Main text animations
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children, 
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            stagger: 0.2, 
            duration: 1.2, 
            ease: "power3.out",
            delay: 0.3
          }
        );
      }

      // Floating cards animation
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.children,
          { y: 60, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.15,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 1
          }
        );
      }

      // Floating elements
      if (floatingRef.current) {
        gsap.to(floatingRef.current.children, {
          y: -20,
          duration: 2,
          stagger: 0.3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }

      // Parallax effect on scroll
      gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => {
    // Navigation logic here
    console.log('Navigate to games');
  };

  const handleLearnMore = () => {
    document.getElementById('services-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-navy-900">
      {/* Animated Background Gradient */}
      <div 
        ref={gradientRef}
        className="absolute inset-0 opacity-20"
        style={{
          background: `conic-gradient(from 0deg, #1e3a8a, #0f172a, #1e293b, #0c1426, #1e3a8a)`,
          filter: 'blur(80px)',
          transform: 'scale(1.5)'
        }}
      />

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-slate-900/10 to-navy-900/5" />

      {/* Floating Geometric Shapes */}
      <div ref={floatingRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-800/15 rounded-full blur-xl" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-slate-700/20 rounded-lg rotate-45 blur-lg" />
        <div className="absolute bottom-40 left-40 w-20 h-20 bg-blue-900/15 rounded-full blur-lg" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-slate-800/20 rounded-lg rotate-12 blur-xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Main Text Content */}
          <div ref={textRef} className="space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md rounded-full px-6 py-3 border border-slate-700/50">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-slate-200 font-medium">Welcome to the Future of Gaming</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-tight">
              <span className="block bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
                GENESIS
              </span>
              <span className="block text-3xl md:text-5xl font-light text-slate-300 mt-4">
                Your Gaming Universe Awaits
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Dive into comprehensive game analytics, discover trending titles, and unlock insights 
              that transform how you experience gaming.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button
                onClick={handleGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl font-bold text-white text-lg shadow-2xl shadow-blue-900/50 hover:shadow-blue-800/60 transition-all duration-300 hover:scale-105 border border-blue-600/30"
              >
                <span className="flex items-center gap-3">
                  <Gamepad2 className="w-6 h-6" />
                  Explore Games
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={handleLearnMore}
                className="group px-8 py-4 bg-slate-800/50 backdrop-blur-md rounded-xl font-semibold text-slate-200 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
              >
                <span className="flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </span>
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="group p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Game Rankings</h3>
              <p className="text-white/60">Discover top-rated games with real-time rankings and community scores.</p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Insights</h3>
              <p className="text-white/60">AI-powered analytics to help you find your next favorite game.</p>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community</h3>
              <p className="text-white/60">Connect with millions of gamers and share your gaming journey.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '1M+', label: 'Games Tracked' },
              { number: '500K+', label: 'Active Users' },
              { number: '2M+', label: 'Reviews' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-white/60 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </div>
  );
};

export default Hero;