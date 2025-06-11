import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- API and Endpoint Configuration ---
const MARVEL_API_BASE_URL = '/api';

const MARVEL_ENDPOINTS = {
  heroList: `${MARVEL_API_BASE_URL}/heroes`,
};

// --- Type Definitions (Refined) ---
// Using string for IDs for consistency, as per API response often being string UIDs
interface Ability {
  id: string; // Changed from number to string for consistency
  icon: string;
  name: string;
  type: string;
  isCollab: boolean;
  description: string;
  additional_fields: { [key: string]: string | number | null };
  transformation_id: string; // If this is a UUID, keep as string
}

interface Transformation {
  id: string;
  name: string;
  icon: string;
  health: string | null;
  movement_speed: string | null;
}

interface Costume {
  id: string;
  name: string;
  icon: string;
  quality: string;
  description: string;
  appearance: string;
}

interface Hero {
  id: string;
  name: string;
  real_name: string;
  imageUrl: string; // Relative path, will need full base URL
  role: string;
  attack_type: string;
  team: string[];
  difficulty: string;
  bio: string;
  lore: string;
  transformations: Transformation[];
  costumes: Costume[];
  abilities: Ability[];
}

// --- Helper Components ---

const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-4">
    <h3 className="text-2xl font-bold">An Error Occurred</h3>
    <p className="mt-2">{message}</p>
    <p className="mt-2 text-sm text-gray-400">
      Please check your network connection or try again later. If the issue persists,
      ensure your API key is valid and your Vite proxy is configured correctly.
    </p>
  </div>
);

// --- Main Rivals Component ---

function Rivals() {
  const [heroList, setHeroList] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const detailViewRef = useRef<HTMLDivElement>(null); // For modal click outside

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchHeroList = async () => {
      setLoading(true);
      setError(null);
      setHeroList([]); // Clear previous heroes

      try {
        const response = await fetch(MARVEL_ENDPOINTS.heroList);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
        }

        const data: Hero[] = await response.json();
        setHeroList(data);
        console.log('Fetched hero list:', data);
      } catch (e: any) {
        console.error('Failed to fetch hero list:', e);
        setError(`Failed to fetch hero list: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroList();
  }, []); // Empty dependency array means this runs once on mount

  // --- Effect for closing detail view on outside click ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailViewRef.current && !detailViewRef.current.contains(event.target as Node)) {
        setSelectedItem(null);
      }
    };
    if (selectedHero) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedHero]); // Re-run when selectedHero changes

  // --- Event Handlers ---
  const handleHeroClick = (hero: Hero) => {
    setSelectedHero(hero);
  };

  const setSelectedItem = (item: Hero | null) => { // Helper for clarity matching Valorant example
    setSelectedHero(item);
  };

  // --- Memoized Filtering for Search ---
  const filteredHeroes = heroList.filter((hero) =>
    hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hero.real_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine background image based on selected hero or first hero
  const backgroundUrl = selectedHero?.imageUrl
    ? `https://marvelrivalsapi.com${selectedHero.imageUrl}`
    : heroList.length > 0
    ? `https://marvelrivalsapi.com${heroList[0].imageUrl}`
    : '';

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
      {/* Dynamic Background Image */}
      <AnimatePresence>
        <motion.div
          key={backgroundUrl}
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
        ></motion.div>
      </AnimatePresence>
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black/50"></div>

      <main className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-4rem)]">
        {/* Left Panel: Title & Filters (Placeholder) */}
        <aside className="lg:col-span-1 bg-black/30 backdrop-blur-md rounded-2xl p-4 flex flex-col border border-red-600/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent mb-6 text-center lg:text-left">
            MARVEL RIVALS
          </h1>
          {/* You could add filters here based on hero.role, hero.attack_type, etc. */}
          <nav className="flex flex-col space-y-2">
            <button
              className="w-full text-left p-3 rounded-lg text-lg font-medium transition-all duration-300 relative text-white bg-red-600/20"
            >
              <span className="relative z-10">All Heroes</span>
            </button>
            {/* Example of future filter buttons */}
            {/* <button className="w-full text-left p-3 rounded-lg text-lg font-medium text-gray-400 hover:bg-white/10 hover:text-white">
              <span className="relative z-10">Tank</span>
            </button> */}
          </nav>
        </aside>

        {/* Right Panel: Content Grid */}
        <section className="lg:col-span-3 bg-black/30 backdrop-blur-md rounded-2xl p-4 flex flex-col border border-red-600/20 overflow-hidden">
          <input
            type="text"
            placeholder="Search heroes by name..."
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-4 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar class */}
            {loading ? <Loader /> : null}
            {error ? <ErrorDisplay message={error} /> : null}
            <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <AnimatePresence>
                {!loading && !error && filteredHeroes.map((hero, index) => (
                  <motion.div
                    key={hero.id}
                    layout // Enables smooth layout transitions
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="aspect-[3/4] bg-white/5 rounded-lg overflow-hidden cursor-pointer group relative border-2 border-transparent hover:border-red-500 transition-all"
                    onClick={() => handleHeroClick(hero)}
                  >
                    <img
                      src={`https://marvelrivalsapi.com${hero.imageUrl}`} // Ensuring full URL
                      alt={hero.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <h3 className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-white text-center truncate">
                      {hero.name}
                    </h3>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {!loading && !error && filteredHeroes.length === 0 && searchTerm && (
              <div className="text-center text-gray-400 mt-8">No heroes found matching "{searchTerm}"</div>
            )}
            {!loading && !error && filteredHeroes.length === 0 && !searchTerm && (
              <div className="text-center text-gray-400 mt-8">No heroes available.</div>
            )}
          </div>
        </section>
      </main>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedHero && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={detailViewRef}
              layoutId={selectedHero.id} // Use hero.id for layoutId
              className="w-full max-w-5xl max-h-[90vh] bg-gray-900/70 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-red-500/30"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <img
                src={`https://marvelrivalsapi.com${selectedHero.imageUrl}`} // Full URL
                alt={selectedHero.name}
                className="w-full md:w-1/3 h-64 md:h-auto object-cover object-center bg-gray-800"
              />
              <div className="p-6 overflow-y-auto flex-grow custom-scrollbar"> {/* Added custom-scrollbar */}
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
                  {selectedHero.name} <span className="text-xl text-gray-400">({selectedHero.real_name})</span>
                </h2>
                <p className="text-lg text-gray-300 mb-4">
                  <span className="font-semibold text-red-400">{selectedHero.role}</span> |{' '}
                  <span className="font-semibold text-red-400">{selectedHero.attack_type}</span> |{' '}
                  <span className="font-semibold text-red-400">Difficulty: {selectedHero.difficulty}</span>
                </p>
                <p className="mt-2 text-gray-300 leading-relaxed">{selectedHero.bio}</p>
                <p className="mt-2 text-gray-400 text-sm italic">{selectedHero.lore}</p>

                {/* Transformations */}
                {selectedHero.transformations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-white border-b border-red-500/30 pb-2 mb-4">Transformations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedHero.transformations.map((t) => (
                        <div key={t.id} className="flex items-center space-x-4 bg-gray-800/50 p-3 rounded-lg">
                          {t.icon && (
                            <img
                              src={`https://marvelrivalsapi.com${t.icon}`}
                              alt={t.name}
                              className="w-16 h-16 object-contain rounded-full border border-red-600/30"
                            />
                          )}
                          <div>
                            <h4 className="font-bold text-white">{t.name}</h4>
                            <p className="text-sm text-gray-400">
                              Health: {t.health || 'N/A'}, Speed: {t.movement_speed || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Costumes */}
                {selectedHero.costumes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-white border-b border-red-500/30 pb-2 mb-4">Costumes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedHero.costumes.map((c) => (
                        <div key={c.id} className="flex flex-col items-center text-center bg-gray-800/50 p-3 rounded-lg">
                          {c.icon && (
                            <img
                              src={`https://marvelrivalsapi.com${c.icon}`}
                              alt={c.name}
                              className="w-20 h-20 object-contain rounded-lg border border-red-600/30 mb-2"
                            />
                          )}
                          <h4 className="font-bold text-white text-sm">{c.name}</h4>
                          <p className="text-xs text-gray-400">Quality: {c.quality}</p>
                          {c.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Abilities */}
                {selectedHero.abilities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-white border-b border-red-500/30 pb-2 mb-4">Abilities</h3>
                    <div className="space-y-4">
                      {selectedHero.abilities.map((ability) => (
                        <div key={ability.id} className="flex items-start space-x-4 bg-gray-800/50 p-3 rounded-lg">
                          {ability.icon && (
                            <img
                              src={`https://marvelrivalsapi.com${ability.icon}`}
                              alt={ability.name}
                              className="w-16 h-16 object-contain bg-black/30 rounded-lg p-1 border border-red-600/30 flex-shrink-0"
                            />
                          )}
                          <div>
                            <h4 className="font-bold text-white text-lg">{ability.name}</h4>
                            <p className="text-sm text-gray-400">{ability.description}</p>
                            {ability.additional_fields && Object.keys(ability.additional_fields).length > 0 && (
                              <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-x-4">
                                {Object.entries(ability.additional_fields).map(([key, value]) => (
                                  <p key={key}>
                                    <span className="font-semibold text-red-300 capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors float-right"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Rivals;