import React from 'react';

const GamesAnimation = () => {
  // Define game logos and their corresponding website URLs
  const gameInfo = [
    { src: '/valorant.png', url: 'https://playvalorant.com/en-us/' },
    { src: '/league2.png', url: 'https://www.leagueoflegends.com/en-us/' },
    { src: '/apex.png', url: 'https://www.ea.com/games/apex-legends/free-to-play' },
    { src: '/cod.png', url: 'https://www.callofduty.com/' },
    { src: '/fortnite.png', url: 'https://www.fortnite.com/' },
    { src: '/cs2.png', url: 'https://www.counter-strike.net/cs2' },
    { src: '/dota2.png', url: 'https://www.dota2.com/home' },
    { src: '/rocketleague.png', url: 'https://www.rocketleague.com/' },
    { src: '/pubg.png', url: 'https://pubg.com/' },
    { src: '/destiny2.png', url: 'https://www.bungie.net/7/en/Destiny' },
  ];

  return (
    <section className="py-12 bg-black/95 backdrop-blur-lg">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 mb-12">
        Supported Games
      </h2>

      <div className="relative overflow-hidden w-full">
        <div className="flex w-full space-x-10 animate-scroll">
          {/* Duplicate the array to ensure continuous scrolling effect */}
          {gameInfo.concat(gameInfo).map((game, index) => (
            <div
              key={index} // Using index as key is acceptable here due to static, duplicated list
              className="min-w-[135px] h-[150px] flex items-center justify-center bg-black/70 rounded-xl shadow-xl backdrop-blur-md overflow-hidden hover:scale-110 transition-transform duration-300"
            >
              {/* Anchor tag to make the logo clickable */}
              <a
                href={game.url}
                target="_blank" // Opens the link in a new tab
                rel="noopener noreferrer" // Security best practice for target="_blank"
                aria-label={`Visit official website for ${game.src.replace('.png', '').replace('/', '')}`} // Accessibility label
                className="w-full h-full flex items-center justify-center" // Ensure link covers the whole div
              >
                <img
                  src={game.src}
                  alt={`${game.src.replace('.png', '').replace('/', '')} Logo`}
                  className="w-20 h-23 object-contain"
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%); /* Scrolls exactly half the concatenated content */
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite; /* Adjust duration for speed */
        }
      `}</style>
    </section>
  );
};

export default GamesAnimation;
