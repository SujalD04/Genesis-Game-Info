import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GamepadIcon, Bell, Zap, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const services = [
    {
      title: 'Game Overview & Details',
      description: 'Get comprehensive information about popular games, including gameplay mechanics, storylines, platforms, system requirements, and developer info.',
      image: '/service1.webp',
      icon: GamepadIcon,
      gradient: 'from-blue-800 to-blue-900',
      shadowColor: 'shadow-blue-900/50'
    },
    {
      title: 'Latest Game Updates & News',
      description: 'Stay up-to-date with the latest patches, updates, and announcements from game developers.',
      image: '/service2.webp',
      icon: Bell,
      gradient: 'from-slate-700 to-slate-800',
      shadowColor: 'shadow-slate-800/50'
    },
    {
      title: 'Real-Time Updates',
      description: 'Get live updates on the latest game announcements, news, and trending topics from the gaming world.',
      image: '/service3.webp',
      icon: Zap,
      gradient: 'from-blue-900 to-slate-800',
      shadowColor: 'shadow-blue-800/50'
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

      // Cards stagger animation
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { y: 80, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
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

      // Parallax effect for service cards
      gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.to(card as Element, {
          yPercent: -10 * (index + 1),
          ease: "none",
          scrollTrigger: {
            trigger: card as Element,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id='services-section' 
      className="relative py-20 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-800 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-700 rounded-full blur-3xl" />
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md rounded-full px-6 py-3 border border-slate-700/50 mb-6">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-slate-200 font-medium">What We Offer</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Discover powerful tools and insights designed to enhance your gaming experience
            and keep you at the forefront of the gaming world.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group relative bg-slate-900/30 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800/50 hover:border-slate-700/60 transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Service Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                
                {/* Floating Icon */}
                <div className={`absolute top-6 right-6 w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center border border-slate-600/30 ${service.shadowColor} shadow-lg backdrop-blur-sm`}>
                  <service.icon className="w-6 h-6 text-slate-200" />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-200 mb-4 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                  {service.description}
                </p>

                {/* CTA Button */}
                <button className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors group/btn">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-5 blur-xl`} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center justify-center gap-8 p-8 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/50">
            <div>
              <h3 className="text-2xl font-bold text-slate-200 mb-2">Ready to Get Started?</h3>
              <p className="text-slate-400">Join thousands of gamers already using Genesis</p>
            </div>
            
            <button className="px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl font-bold text-white shadow-2xl shadow-blue-900/50 hover:shadow-blue-800/60 transition-all duration-300 hover:scale-105 border border-blue-600/30">
              Explore Games
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default Services;