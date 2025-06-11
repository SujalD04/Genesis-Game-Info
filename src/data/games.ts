import { Game } from '../types';

export const games: Game[] = [
  {
    id: '1',
    name: 'Valorant',
    description: 'A 5v5 character-based tactical shooter',
    image: '/valo.webp',
    genre: ['FPS', 'Tactical Shooter'],
    link: 'valorant',
  },
  {
    id: '2',
    name: 'League of Legends',
    description: 'A team-based strategy game',
    image: '/league.webp',
    genre: ['MOBA', 'Strategy'],
    link: 'lol',
  },
  {
    id: '3',
    name: 'Apex Legends',
    description: 'A free-to-play battle royale game',
    image: '/apex.webp',
    genre: ['Battle Royale', 'FPS'],
    link: 'apex',
  },
  {
    id: '4',
    name: 'Fortnite',
    description: 'A battle royale and building survival game',
    image: '/fortnite.webp',
    genre: ['Battle Royale', 'Survival'],
    link: 'fortnite',
  },
  {
    id: '5',
    name: 'DOTA 2',
    description: 'A multiplayer online battle arena game',
    image: 'dota.webp',
    genre: ['MOBA', 'Strategy'],
    link: 'dota2',
  },
  {
    id: '6',
    name: 'Counter-Strike: 2',
    description: 'A tactical first-person shooter',
    image: 'cs.webp',
    genre: ['FPS', 'Tactical Shooter'],
    link: 'cs2',
  },
  {
    id: '7',
    name: 'PUBG',
    description: 'A battle royale shooter game',
    image: 'pubg.webp',
    genre: ['Battle Royale', 'Shooter'],
    link: 'pubg',
  },
  {
    id: '8',
    name: 'Marvel Rivals',
    description: 'an RPG FPS game with marvel characters',
    image: 'rivals.webp',
    genre: ['FPS', 'Action'],
    link: 'rivals',
  }
];

export default games;
