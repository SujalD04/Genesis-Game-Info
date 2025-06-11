import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Type Definitions ---
interface Hero {
  id: number;
  name: string; // e.g., "npc_dota_hero_antimage" - used for splash art URL
  primary_attr: 'agi' | 'str' | 'int' | 'all';
  attack_type: 'Melee' | 'Ranged';
  roles: string[];
  img: string; // Relative path for main image (e.g., "/apps/dota2/images/dota_react/heroes/antimage.png?")
  icon: string; // Relative path for icon (e.g., "/apps/dota2/images/dota_react/heroes/icons/antimage.png?")
  base_health: number;
  base_health_regen: number;
  base_mana: number;
  base_mana_regen: number;
  base_armor: number;
  base_mr: number; // Magic Resist
  base_attack_min: number;
  base_attack_max: number;
  base_str: number;
  base_agi: number;
  base_int: number;
  str_gain: number;
  agi_gain: number;
  int_gain: number;
  attack_range: number;
  projectile_speed: number;
  attack_rate: number; // Attack Speed
  base_attack_time: number;
  attack_point: number;
  move_speed: number;
  turn_rate: number | null;
  cm_enabled: boolean;
  legs: number;
  day_vision: number;
  night_vision: number;
  localized_name: string; // Display name (e.g., "Anti-Mage")
  // Adding all other properties from the API for completeness, though not all will be displayed as bars
  "1_pick": number;
  "1_win": number;
  "2_pick": number;
  "2_win": number;
  "3_pick": number;
  "3_win": number;
  "4_pick": number;
  "4_win": number;
  "5_pick": number;
  "5_win": number;
  "6_pick": number;
  "6_win": number;
  "7_pick": number;
  "7_win": number;
  "8_pick": number;
  "8_win": number;
  turbo_picks: number;
  turbo_picks_trend: number[];
  turbo_wins: number;
  turbo_wins_trend: number[];
  pro_pick: number;
  pro_win: number;
  pro_ban: number;
  pub_pick: number;
  pub_pick_trend: number[];
  pub_win: number;
  pub_win_trend: number[];
}

// --- API Endpoints ---
const DOTA_API_HEROSTATS = 'https://api.opendota.com/api/herostats';
const DOTA_CDN_BASE_URL = 'https://cdn.dota2.com';

// --- Helper Components ---

// Simple loading spinner
const Spinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

// Stat bar component for visualizing hero stats
const StatBar = ({ label, value, max, colorClass, showValueOnly = false }: { label: string; value: number | null; max: number; colorClass: string; showValueOnly?: boolean }) => {
    if (value === null) return null; // Don't display if value is null

    // For stats that are better just displayed as a number
    if (showValueOnly) {
        return (
            <div className="flex justify-between items-center bg-gray-700/50 rounded-md p-2">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className="text-sm font-bold text-white">{value}</span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className="text-sm font-bold text-white">{value}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                    className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${(value / max) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};


// --- Main 'Dota' Component ---
const Dota = () => {
  // --- State Management ---
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback image in case the CDN image fails to load
  // Assumes 'dota-placeholder.png' is in your project's 'public' folder
  const NO_IMAGE_PLACEHOLDER = '/dota-placeholder.png'; // Ensure you have this file!

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchHeroes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(DOTA_API_HEROSTATS);

        if (!response.ok) {
          throw new Error(`API error! Status: ${response.status}`);
        }

        const data: Hero[] = await response.json();

        // Sort heroes alphabetically by localized_name
        const sortedHeroes = data.sort((a, b) =>
          a.localized_name.localeCompare(b.localized_name)
        );
        setHeroes(sortedHeroes);

        // Set the first hero in the list as the default selected one
        if (sortedHeroes.length > 0) {
          setSelectedHero(sortedHeroes[0]);
        }
      } catch (e: any) {
        console.error('Failed to fetch Dota 2 heroes:', e);
        setError(e.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  // --- Memoized Filtering ---
  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero =>
      hero.localized_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [heroes, searchQuery]);

  // Function to get splash art URL from hero.name
  const getHeroSplashUrl = (heroName: string) => {
    // Convert "npc_dota_hero_antimage" to "antimage"
    const simpleName = heroName.replace('npc_dota_hero_', '');
    // Splash image format in Dota 2 CDN is typically _full.png for background
    return `${DOTA_CDN_BASE_URL}/apps/dota2/images/heroes/${simpleName}_full.png`;
  };

  // Function to get hero icon URL from hero.icon
  const getHeroIconUrl = (heroIconPath: string) => {
    // The hero.icon path already includes /apps/dota2/images/dota_react/heroes/icons/
    return `${DOTA_CDN_BASE_URL}${heroIconPath}`;
  };

  // Helper for attribute text color
  const getAttributeColorClass = (attr: Hero['primary_attr']) => {
    switch (attr) {
      case 'str':
        return 'text-red-400';
      case 'agi':
        return 'text-green-400';
      case 'int':
        return 'text-blue-400';
      case 'all': // Universal heroes
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}. Please try refreshing the page.</p>
      </div>
    );
  }

  const splashUrl = selectedHero
    ? getHeroSplashUrl(selectedHero.name)
    : 'https://placehold.co/1280x720/0a101f/1e293b?text=Select+a+Hero'; // Placeholder for background


  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200">
      <div className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out">
        <div
          key={selectedHero ? selectedHero.id : 'none'}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 animate-fade-in"
          style={{ backgroundImage: `url(${splashUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 h-screen">

        {/* --- Hero List and Search (Left Panel) --- */}
        <aside className="lg:col-span-1 xl:col-span-1 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 flex flex-col h-full overflow-hidden border border-red-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Dota 2 Heroes</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Hero..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </div>
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredHeroes.map(hero => (
                <button
                  key={hero.id}
                  onClick={() => setSelectedHero(hero)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 ${selectedHero?.id === hero.id ? 'ring-4 ring-red-500' : 'ring-2 ring-transparent'}`}
                  title={hero.localized_name}
                >
                  <img
                    src={getHeroIconUrl(hero.icon)}
                    alt={hero.localized_name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <p className="absolute bottom-1 left-0 right-0 text-center text-xs font-semibold text-white truncate px-1">
                    {hero.localized_name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* --- Hero Details (Right Panel) --- */}
        <section className="lg:col-span-2 xl:col-span-3 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 md:p-8 flex flex-col h-full overflow-y-auto border border-red-500/20 custom-scrollbar"> {/* Added custom-scrollbar */}
          {selectedHero ? (
            <div key={selectedHero.id} className="animate-fade-in-up">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>{selectedHero.localized_name}</h1>
                <p className={`text-xl md:text-2xl font-light capitalize ${getAttributeColorClass(selectedHero.primary_attr)}`}>
                  {selectedHero.attack_type} Attack | Primary Attr: {selectedHero.primary_attr.toUpperCase()}
                </p>
              </div>

              {/* Roles */}
              <div className="mb-8">
                <h3 className="font-bold text-white mb-2">Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHero.roles.map(role => (
                    <span key={role} className="bg-red-500/20 text-red-300 text-sm font-semibold px-3 py-1 rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-red-500/30 pb-2">Base Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                  {/* Core Stats */}
                  <StatBar label="Health" value={selectedHero.base_health} max={1000} colorClass="bg-green-500" />
                  <StatBar label="Health Regen" value={selectedHero.base_health_regen} max={10} colorClass="bg-green-600" />
                  <StatBar label="Mana" value={selectedHero.base_mana} max={800} colorClass="bg-blue-500" />
                  <StatBar label="Mana Regen" value={selectedHero.base_mana_regen} max={5} colorClass="bg-blue-600" />
                  <StatBar label="Armor" value={selectedHero.base_armor} max={30} colorClass="bg-yellow-500" />
                  <StatBar label="Magic Resist" value={selectedHero.base_mr} max={35} colorClass="bg-purple-500" />
                  
                  {/* Attack Stats */}
                  <StatBar label="Min Attack" value={selectedHero.base_attack_min} max={120} colorClass="bg-red-500" />
                  <StatBar label="Max Attack" value={selectedHero.base_attack_max} max={120} colorClass="bg-red-600" />
                  <StatBar label="Attack Rate" value={selectedHero.attack_rate} max={2.0} colorClass="bg-orange-500" />
                  <StatBar label="Attack Range" value={selectedHero.attack_range} max={700} colorClass="bg-teal-500" />
                  <StatBar label="Projectile Speed" value={selectedHero.projectile_speed} max={1500} colorClass="bg-pink-500" /> {/* Max value adjusted */}

                  {/* Attribute Gains */}
                  <StatBar label="Str Gain" value={selectedHero.str_gain} max={5.0} colorClass="bg-red-400" />
                  <StatBar label="Agi Gain" value={selectedHero.agi_gain} max={5.0} colorClass="bg-green-400" />
                  <StatBar label="Int Gain" value={selectedHero.int_gain} max={5.0} colorClass="bg-blue-400" />

                  {/* Other Stats - display as value only where a bar doesn't make sense */}
                  <StatBar label="Move Speed" value={selectedHero.move_speed} max={350} colorClass="bg-cyan-500" />
                  <StatBar label="Turn Rate" value={selectedHero.turn_rate} max={1.0} colorClass="bg-gray-500" showValueOnly={true} /> {/* Turn rate max is 1.0, lower is faster */}
                  <StatBar label="Legs" value={selectedHero.legs} max={8} colorClass="bg-gray-500" showValueOnly={true} /> {/* No real max, just a number */}
                  <StatBar label="Day Vision" value={selectedHero.day_vision} max={1800} colorClass="bg-yellow-300" showValueOnly={true} />
                  <StatBar label="Night Vision" value={selectedHero.night_vision} max={1800} colorClass="bg-purple-300" showValueOnly={true} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl text-gray-500">Select a hero to view details</p>
            </div>
          )}
        </section>
      </main>

      {/* Custom scrollbar styles (Match Dota theme, mostly same as before but using red accents) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.6); /* red-500 with 60% opacity */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 68, 68, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Dota;