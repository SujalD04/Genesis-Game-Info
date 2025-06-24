import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger for advanced scroll effects

gsap.registerPlugin(ScrollTrigger);

const GamesAnimation = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);

  // Define game logos and their corresponding website URLs
  const gameInfo = [
    { src: '/valorant.png', url: 'https://playvalorant.com/en-us/', name: 'Valorant' },
    { src: '/league2.png', url: 'https://www.leagueoflegends.com/en-us/', name: 'League of Legends' },
    { src: '/apex.png', url: 'https://www.ea.com/games/apex-legends/free-to-play', name: 'Apex Legends' },
    { src: '/cod.png', url: 'https://www.callofduty.com/', name: 'Call of Duty' },
    { src: '/fortnite.png', url: 'https://www.fortnite.com/', name: 'Fortnite' },
    { src: '/cs2.png', url: 'https://www.counter-strike.net/cs2', name: 'CS2' },
    { src: '/dota2.png', url: 'https://www.dota2.com/home', name: 'Dota 2' },
    { src: '/rocketleague.png', url: 'https://www.rocketleague.com/', name: 'Rocket League' },
    { src: '/pubg.png', url: 'https://pubg.com/', name: 'PUBG' },
    { src: '/destiny2.png', url: 'https://www.bungie.net/7/en/Destiny', name: 'Destiny 2' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title entrance animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%', // When top of title is 80% from top of viewport
            toggleActions: 'play none none reverse',
          },
        }
      );

      // GSAP infinite horizontal scroll for the game logos
      const scrollTween = gsap.to(scrollContainerRef.current, {
        xPercent: -50, // Scrolls exactly half the concatenated content
        ease: 'none',
        duration: 30, // Adjust duration for speed
        repeat: -1,
        modifiers: {
          xPercent: gsap.utils.wrap(-50, 0), // Wraps the x position to create infinite loop
        },
      });

      // Pause/play animation on hover
      if (scrollContainerRef.current) {
        const cards = scrollContainerRef.current.children;
        Array.from(cards).forEach((card) => {
          (card as HTMLElement).addEventListener('mouseenter', () => scrollTween.pause());
          (card as HTMLElement).addEventListener('mouseleave', () => scrollTween.play());
        });
      }

      // Optional: Parallax effect on the section background
      gsap.to(".games-parallax-bg", {
        yPercent: -15, // Subtle parallax
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

    }); // <-- End of GSAP context

    return () => ctx.revert(); // Clean up GSAP animations on unmount
  }, []);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-black via-slate-950 to-indigo-950">
      {/* Subtle background glow/gradient */}
      <div
        className="absolute inset-0 opacity-20 games-parallax-bg"
        style={{
          background: `radial-gradient(circle at center, rgba(30, 64, 175, 0.1) 0%, rgba(15, 23, 42, 0) 70%)`,
          filter: 'blur(70px)',
          transform: 'scale(1.2)'
        }}
      />
       {/* Mesh Gradient Overlay - similar to Hero for consistency */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-slate-900/10 to-indigo-900/5" />


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          ref={titleRef}
          className="text-5xl md:text-6xl font-extrabold text-center mb-16
                     bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300
                     drop-shadow-lg"
        >
          Explore Our Supported Games
        </h2>

        {/* Scrolling Container */}
        <div className="relative w-full overflow-hidden py-4">
          <div
            ref={scrollContainerRef}
            className="flex flex-nowrap space-x-8 md:space-x-12 lg:space-x-16" // Added more space for better visual separation
            style={{ width: `${gameInfo.length * 2 * (135 + 48)}px` }} // Adjust width based on card size + spacing (135px width, 48px for space-x-12)
          >
            {/* Duplicate the array to ensure seamless infinite scrolling */}
            {gameInfo.concat(gameInfo).map((game, index) => (
              <div
                key={index} // Index is fine for a static, duplicated list
                className="group relative flex-shrink-0 min-w-[135px] h-[150px]
                           bg-white/5 border border-white/10 rounded-2xl p-4
                           flex flex-col items-center justify-center
                           shadow-2xl shadow-indigo-900/20
                           transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-blue-500/50
                           transform-gpu overflow-hidden" // Use transform-gpu for better performance
              >
                {/* Overlay for subtle shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit official website for ${game.name}`}
                  className="w-full h-full flex flex-col items-center justify-center space-y-2"
                >
                  <img
                    src={game.src}
                    alt={`${game.name} Logo`}
                    className="w-20 h-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {game.name}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade - consistent with Hero */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </section>
  );
};

export default GamesAnimation;