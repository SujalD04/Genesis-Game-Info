import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, Users, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Pro Gamer',
      feedback: "Genesis has completely changed the way I stay updated with the games I love. The real-time updates on patch notes and live events keep me ahead of the curve. It's a must-have for any gamer!",
      rating: 5,
      avatar: '🎮'
    },
    {
      name: 'Jane Smith',
      role: 'Gaming Enthusiast',
      feedback: "Before Genesis, I used to jump between websites to get game news and updates. Now, I have everything I need in one place. The real-time news and updates are spot-on, and the design is fantastic!",
      rating: 5,
      avatar: '👩‍💻'
    },
    {
      name: 'Alex Johnson',
      role: 'Content Creator',
      feedback: "As a content creator, staying informed about new game releases, updates, and live events is crucial. Genesis provides the best insights, and I can rely on it for accurate and timely information.",
      rating: 5,
      avatar: '📹'
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Cards animation with stagger
      if (cardsRef.current) {
        gsap.fromTo(
          (cardsRef.current as HTMLElement).children,
          { y: 60, opacity: 0, rotationY: 15 },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              end: "bottom 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Stats counter animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              end: "bottom 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Floating quote animation
      gsap.to(".floating-quote", {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.5
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/bg2.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-950/90 to-black/80 backdrop-blur-sm" />
      </div>

      {/* Floating Background Shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-32 left-20 w-64 h-64 bg-blue-800 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-slate-700 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md rounded-full px-6 py-3 border border-slate-700/50 mb-6">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-slate-200 font-medium">User Reviews</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
              What Our Users Say
            </span>
          </h2>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied gamers who trust Genesis for their gaming insights and updates.
          </p>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto">
          {[
            { number: '50K+', label: 'Happy Users' },
            { number: '4.9/5', label: 'Average Rating' },
            { number: '1M+', label: 'Reviews Read' },
            { number: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/50">
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-slate-500 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div ref={cardsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-slate-700/60 transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Floating Quote Icon */}
              <div className="floating-quote absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-800 to-slate-800 rounded-full flex items-center justify-center border border-slate-600/30 shadow-lg">
                <Quote className="w-6 h-6 text-blue-200" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-slate-300 text-lg leading-relaxed mb-8 italic">
                "{testimonial.feedback}"
              </blockquote>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-slate-800 rounded-full flex items-center justify-center text-2xl border border-slate-600/30">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-200">{testimonial.name}</h4>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-800/10 to-slate-700/10 blur-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-6 p-8 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/50">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-2xl font-bold text-slate-200">Ready to Join Them?</h3>
                <p className="text-slate-400">Experience Genesis for yourself</p>
              </div>
            </div>
            
            <button className="px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl font-bold text-white shadow-2xl shadow-blue-900/50 hover:shadow-blue-800/60 transition-all duration-300 hover:scale-105 border border-blue-600/30">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default Testimonials;