import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Prop and Type Definitions ---
type Props = {};

interface Category {
  title: string;
  key: string;
  endpoint: string;
}

// A generic interface for different Valorant content items
interface ContentItem {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  fullPortrait?: string | null;
  splash?: string;
  description?: string;
  abilities?: Ability[];
  tierDisplayName?: string;
}

interface Ability {
    uuid: string;
    displayName: string;
    description: string;
    displayIcon: string | null;
}


// --- API and Category Configuration ---
const API_BASE_URL = "https://valorant-api.com/v1";

const categories: Category[] = [
  { title: "Agents", key: "agents", endpoint: "/agents?isPlayableCharacter=true" },
  { title: "Maps", key: "maps", endpoint: "/maps" },
  { title: "Skins", key: "skins", endpoint: "/weapons/skins" },
  { title: "Buddies", key: "buddies", endpoint: "/buddies" },
  { title: "Cards", key: "playerCards", endpoint: "/playercards" },
  { title: "Sprays", key: "sprays", endpoint: "/sprays" },
];

// --- Helper Components ---

const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
        <h3 className="text-2xl font-bold">An Error Occurred</h3>
        <p className="mt-2">{message}</p>
    </div>
);


// --- Main Valorant Component ---

const Valorant = (props: Props) => {
  // --- State Management ---
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const detailViewRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      if (!activeCategory) return;

      setIsLoading(true);
      setError(null);
      setItems([]); // Clear previous items

      try {
        const res = await fetch(`${API_BASE_URL}${activeCategory.endpoint}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch ${activeCategory.title}. Status: ${res.status}`);
        }
        const data = await res.json();
        
        // The API returns data under a 'data' key which is an array
        setItems(data.data);

      } catch (err) {
        console.error("Error fetching Valorant data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]);
  
  // --- Effect for closing detail view on outside click ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailViewRef.current && !detailViewRef.current.contains(event.target as Node)) {
        setSelectedItem(null);
      }
    };
    if (selectedItem) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedItem]);


  // --- Event Handlers ---
  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    setSearchTerm("");
    setSelectedItem(null);
  };

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
  };

  // --- Memoized Filtering ---
  const filteredItems = items.filter((item) =>
    item.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const backgroundUrl = selectedItem?.splash || selectedItem?.fullPortrait || activeCategory?.key === 'maps' && items[0]?.splash || '';

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
        {/* Background Image */}
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
            {/* Left Panel: Categories & Search */}
            <aside className="lg:col-span-1 bg-black/30 backdrop-blur-md rounded-2xl p-4 flex flex-col border border-blue-500/20">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-6 text-center lg:text-left">
                    VALORANT
                </h1>
                <nav className="flex flex-col space-y-2">
                    {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left p-3 rounded-lg text-lg font-medium transition-all duration-300 relative ${
                        activeCategory.key === cat.key ? "text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {activeCategory.key === cat.key && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-blue-500/20 rounded-lg z-0"
                            ></motion.div>
                        )}
                        <span className="relative z-10">{cat.title}</span>
                    </button>
                    ))}
                </nav>
            </aside>

            {/* Right Panel: Content Grid */}
            <section className="lg:col-span-3 bg-black/30 backdrop-blur-md rounded-2xl p-4 flex flex-col border border-blue-500/20 overflow-hidden">
                <input
                    type="text"
                    placeholder={`Search in ${activeCategory.title}...`}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-4 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex-grow overflow-y-auto pr-2">
                    {isLoading ? <Loader /> : null}
                    {error ? <ErrorDisplay message={error} /> : null}
                    <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <AnimatePresence>
                        {!isLoading && !error && filteredItems.map((item, index) => (
                            <motion.div
                                key={item.uuid}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                className="aspect-[3/4] bg-white/5 rounded-lg overflow-hidden cursor-pointer group relative border-2 border-transparent hover:border-blue-500 transition-all"
                                onClick={() => handleItemClick(item)}
                            >
                                <img
                                    src={item.displayIcon || 'https://placehold.co/300x400/0a101f/1e90ff?text=?'}
                                    alt={item.displayName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <h3 className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-white text-center truncate">
                                    {item.displayName}
                                </h3>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>
        </main>
        
        {/* Detail View Modal */}
        <AnimatePresence>
            {selectedItem && (
                <motion.div
                    className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        ref={detailViewRef}
                        layoutId={selectedItem.uuid}
                        className="w-full max-w-4xl max-h-[90vh] bg-gray-900/70 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-blue-400/30"
                        initial={{ scale: 0.7 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.7 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                       <img
                            src={selectedItem.fullPortrait ?? selectedItem.splash ?? selectedItem.displayIcon ?? ''}
                            alt={selectedItem.displayName}
                            className="w-full md:w-1/3 h-64 md:h-auto object-cover object-center"
                        />
                        <div className="p-6 overflow-y-auto flex-grow">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{selectedItem.displayName}</h2>
                            {selectedItem.description && <p className="mt-4 text-gray-300">{selectedItem.description}</p>}
                            
                            {selectedItem.abilities && selectedItem.abilities.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold text-white border-b border-blue-500/30 pb-2 mb-4">Abilities</h3>
                                    <div className="space-y-4">
                                        {selectedItem.abilities.map(ability => (
                                            <div key={ability.uuid} className="flex items-start space-x-4">
                                                <img src={ability.displayIcon ?? ''} alt={ability.displayName} className="w-12 h-12 bg-black/30 rounded-lg p-1" />
                                                <div>
                                                    <h4 className="font-bold text-white">{ability.displayName}</h4>
                                                    <p className="text-sm text-gray-400">{ability.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             <button
                                onClick={() => setSelectedItem(null)}
                                className="mt-6 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-colors float-right"
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
};

export default Valorant;
