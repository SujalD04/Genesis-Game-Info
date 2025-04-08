import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import GameCard from './GameCard';
import { games } from '../data/games'; // This should be an API call
import valorant from '../pages/valorant';

const GamesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [filteredGames, setFilteredGames] = useState(games); // Change to use fetched games

  useEffect(() => {
    // Simulate an API call
    setTimeout(() => {
      setFilteredGames(games); 
      setLoading(false); 
    }, 2000); 
  }, []);

  const allGenres = Array.from(
    new Set(games.flatMap((game) => game.genre))
  ).sort();

  const filteredGamesList = filteredGames.filter((game) => {
    const matchesSearch = game.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || game.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black font-roboto">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg3.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>
      <div className="max-w-7xl mx-auto z-1">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-12 z-10 relative"
        >
          <h2 className="text-4xl font-extrabold mb-4 text-blue-400">
            Select Your{' '}
            <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              Game
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose from our collection of popular games and start tracking your
            progress today.
          </p>
        </motion.div>

        {/* Search Input */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </motion.div>

          {/* Genre Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 z-[1]"
          >
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-4 z-1 py-2 rounded-full text-sm font-semibold transition-colors shadow-lg ${
                !selectedGenre
                  ? 'bg-blue-500 text-white'
                  : 'bg-black/50 text-gray-300 hover:bg-blue-500/20 hover:text-white'
              }`}
            >
              All
            </button>
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 z-[1] py-2 rounded-full text-sm font-semibold transition-colors shadow-lg ${
                  selectedGenre === genre
                    ? 'bg-blue-500 text-white'
                    : 'bg-black/50 text-gray-300 hover:bg-blue-500/20 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Loading Screen */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid"></div>
          </motion.div>
        ) : (
          // Games Grid
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGamesList.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default GamesSection;
