import React from 'react';

const GamesAnimation = () => {
  const gameLogos = [
    '/valorant.png',
    '/league2.png',
    '/apex.png',
    '/cod.png',
    '/fortnite.png',
    '/cs2.png',
    '/dota2.png',
    '/rocketleague.png',
    '/pubg.png',
    '/destiny2.png',
  ];

  return (
    <section className="py-12 bg-black/95 backdrop-blur-lg">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 mb-12">
        Supported Games
      </h2>

      <div className="relative overflow-hidden w-full">
        <div className="flex w-[200%] space-x-10 animate-scroll">
          {gameLogos.concat(gameLogos).map((logo, index) => (
            <div
              key={index}
              className="min-w-[135px] h-[150px] flex items-center justify-center bg-black/70 rounded-xl shadow-xl backdrop-blur-md overflow-hidden hover:scale-110 transition-transform duration-300"
            >
              <img
                src={logo}
                alt="Game Logo"
                className="w-20 h-23 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesAnimation;
