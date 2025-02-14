import React from 'react';

const GamesAnimation = () => {
  const gameLogos = [
    'https://upload.wikimedia.org/wikipedia/en/5/5e/Valorant_logo_-_pink.svg',
    'https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/League_of_Legends_2019_vector.svg/1200px-League_of_Legends_2019_vector.svg.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Apex_legends_cover.jpg/800px-Apex_legends_cover.jpg',
    'https://upload.wikimedia.org/wikipedia/en/8/85/Fortnite_Save_The_World.jpg',
    'https://upload.wikimedia.org/wikipedia/en/7/74/CS-GO_icon.jpg',
  ];

  return (
    <section className="py-12 bg-black/95 backdrop-blur-lg">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 mb-12">
        Supported Games
      </h2>

      <div className="relative overflow-hidden w-full">
        <div className="flex space-x-10 animate-scroll">
          {gameLogos.concat(gameLogos).map((logo, index) => (
            <div
              key={index}
              className="min-w-[150px] h-[150px] flex items-center justify-center bg-black/70 rounded-xl shadow-xl backdrop-blur-md overflow-hidden hover:scale-110 transition-transform duration-300"
            >
              <img
                src={logo}
                alt="Game Logo"
                className="w-28 h-28 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesAnimation;
