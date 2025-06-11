import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Prop and Type Definitions ---
type Props = {};

interface Ability {
  type: string;
  title: string;
  desc: string;
  icon?: string;
}

interface Legend {
  _id: { $oid: string };
  nickname: string;
  class: string;
  class_ability: { type: string; title: string; desc: string }[];
  quote: string;
  type: string;
  desc: string;
  name: string;
  age: string;
  home: string;
  thumbnail: { small: string; medium: string; large: string; default: string };
  ability: Ability[];
  yt_trailer: string; // This will now be used directly as a link
}

// --- API Configuration ---
const APEX_DATA_URL = 'https://raddythebrand.github.io/apex-legends/data.json';

// --- Helper Components ---
const Loader = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-red-400 p-4">
    <h3 className="text-2xl font-bold">Failed to Load Data</h3>
    <p className="mt-2 text-lg">{message}</p>
    <p className="mt-1 text-sm text-gray-500">Please try again later or check your network connection.</p>
  </div>
);

// --- Main Apex Component ---
const Apex = (props: Props) => {
  // --- State Management ---
  const [legends, setLegends] = useState<Legend[]>([]);
  const [selectedLegend, setSelectedLegend] = useState<Legend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchLegends = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(APEX_DATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Fetched data is not in the expected format.');
        }

        setLegends(data);
        if (data.length > 0) {
          setSelectedLegend(data[0]); // Select the first legend by default
        }
      } catch (e: any) {
        console.error('Failed to fetch Apex Legends data:', e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLegends();
  }, []);

  const backgroundImageUrl = selectedLegend?.thumbnail?.default || '';

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Dynamic Background Image */}
      <AnimatePresence>
        <motion.div
          key={selectedLegend?._id.$oid || 'no-legend'}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.2, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

      {/* Main Content Layout */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
        {/* Left Panel: Legend Selection List */}
        <aside className="lg:col-span-1 bg-black/40 backdrop-blur-md rounded-2xl p-4 flex flex-col border border-blue-500/20 overflow-hidden shadow-xl">
          <h1 className="text-4xl font-black text-white mb-4 text-center lg:text-left tracking-wider uppercase">
            Legends
          </h1>
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {!isLoading && !error && (
              <div className="space-y-2">
                {legends.map((legend, index) => (
                  <button
                    key={`${legend._id.$oid}-${index}`}
                    onClick={() => setSelectedLegend(legend)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-300 relative overflow-hidden group ${
                      selectedLegend?._id.$oid === legend._id.$oid
                        ? 'bg-blue-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <img
                      src={legend.thumbnail.small}
                      alt={legend.name}
                      className="w-10 h-10 rounded-md mr-4 object-cover flex-shrink-0 bg-gray-800 border border-gray-700"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/40x40/0a101f/1e90ff?text=?';
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-200 transition-colors">{legend.name}</h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{legend.nickname}</p>
                    </div>
                    {selectedLegend?._id.$oid === legend._id.$oid && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-lg"
                        layoutId="active-legend-indicator"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Panel: Legend Details */}
        <section className="lg:col-span-2 bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-blue-500/20 overflow-hidden shadow-xl">
          <AnimatePresence mode="wait">
            {selectedLegend && (
              <motion.div
                key={selectedLegend._id.$oid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full h-full p-6 md:p-8 overflow-y-auto custom-scrollbar"
              >
                {/* Header */}
                <div className="text-center md:text-left mb-6">
                  <h2
                    className="text-5xl md:text-7xl font-black text-white uppercase tracking-wider leading-tight"
                    style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
                  >
                    {selectedLegend.name}
                  </h2>
                  <p className="text-xl md:text-2xl text-blue-300 mt-2">{selectedLegend.quote}</p>
                </div>

                {/* About Section */}
                <div
                  className="text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto md:mx-0 text-lg"
                  dangerouslySetInnerHTML={{ __html: selectedLegend.desc }}
                />

                {/* Abilities Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-blue-500/30 pb-2">
                    Abilities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedLegend.ability.map((ability, index) => (
                      <div
                        key={`${ability.title}-${index}`}
                        className="bg-white/5 p-4 rounded-lg flex items-start space-x-4 border border-white/10 hover:border-blue-400/50 transition-all duration-200"
                      >
                        {ability.icon && (
                          <img
                            src={ability.icon}
                            alt={ability.title}
                            className="w-16 h-16 rounded-md bg-gray-800 flex-shrink-0 border border-gray-700"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://placehold.co/64x64/0a101f/1e90ff?text=?';
                            }}
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-white text-lg mb-1">{ability.title}</h4>
                          <p className="text-sm text-gray-400">{ability.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* YouTube Trailer Link */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-blue-500/30 pb-2">
                    Trailer
                  </h3>
                  {selectedLegend.yt_trailer ? (
                    <a
                      href={selectedLegend.yt_trailer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                    >
                      Watch Trailer on YouTube
                    </a>
                  ) : (
                    <p className="text-gray-400">No trailer link available for this legend.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!selectedLegend && !isLoading && (
            <div className="text-center text-gray-500 p-8">
              <p className="text-2xl font-semibold">Select a Legend to see their details.</p>
              <p className="mt-2 text-lg">Choose from the list on the left.</p>
            </div>
          )}
        </section>
      </main>
      {/* Custom scrollbar styles for better aesthetics (add this to your CSS or a style block) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5); /* blue-500 with 50% opacity */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Apex;