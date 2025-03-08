import React from 'react';
import { motion } from 'framer-motion';
import { Game } from '../types';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${game.link}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group bg-blue-800/30 rounded-xl overflow-hidden shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-blue-200 mb-2">{game.name}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {game.genre.map((g) => (
            <span
              key={g}
              className="px-2 py-1 text-xs font-semibold bg-blue-600/20 text-blue-400 rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
        <p className="text-blue-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {game.description}
        </p>
      </div>
    </motion.div>
  );
};

export default GameCard;
