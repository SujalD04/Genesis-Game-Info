import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ContentData {
  version: string;
  characters?: { id?: string; name: string }[];
  maps?: { id?: string; name: string }[];
  chromas?: { id?: string; name: string }[];
  skins?: { id?: string; name: string }[];
  skinLevels?: { id?: string; name: string }[];
  equips?: { id?: string; name: string }[];
  gameModes?: { id?: string; name: string }[];
  sprays?: { id?: string; name: string }[];
  sprayLevels?: { id?: string; name: string }[];
  charms?: { id?: string; name: string }[];
  charmLevels?: { id?: string; name: string }[];
  playerCards?: { id?: string; name: string }[];
  playerTitles?: { id?: string; name: string }[];
  acts?: { id?: string; name: string }[];
}

const categories = [
  { title: "Agents", key: "characters" },
  { title: "Maps", key: "maps" },
  { title: "Chromas", key: "chromas" },
  { title: "Skins", key: "skins" },
  { title: "Skin Levels", key: "skinLevels" },
  { title: "Melee Weapons", key: "equips" },
  { title: "Game Modes", key: "gameModes" },
  { title: "Sprays", key: "sprays" },
  { title: "Spray Levels", key: "sprayLevels" },
  { title: "Gun Buddies", key: "charms" },
  { title: "Gun Buddy Levels", key: "charmLevels" },
  { title: "Player Cards", key: "playerCards" },
  { title: "Player Titles", key: "playerTitles" },
  { title: "Acts", key: "acts" },
];

const BASE_URL = "http://localhost:5000"; // Update this to match your backend URL if different

const Valorant: React.FC = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // New loading state

  useEffect(() => {
    setIsLoading(true); // Set loading to true when the API request starts
    fetch(`${BASE_URL}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        setContent(data);
        setIsLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false if there's an error
      });
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
    setSearchTerm("");
    setSelectedItem(null);
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  const closeItemCard = () => {
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 mt-16 flex flex-col items-center justify-center relative">
        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex justify-center items-center absolute inset-0 z-10 top-0 bottom-0"
        >
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid"></div>
        </motion.div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-black text-white p-8 mt-16 flex flex-col items-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent font-orbitron mb-12 tracking-wide">
        Valorant
      </h1>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {categories.map(({ title, key }) => (
          <button
            key={key}
            onClick={() => handleCategoryClick(key)}
            className={`p-6 rounded-lg text-xl font-medium shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 
              ${activeCategory === key ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white" : "bg-blue-600/20 hover:bg-blue-900 text-gray-300"}`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Category content */}
      {activeCategory && content && Array.isArray(content[activeCategory as keyof ContentData]) ? (
        <div className="w-full max-w-4xl">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-4 mb-6 text-white bg-blue-600/20 rounded-xl focus:ring-2 focus:ring-white focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Items */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {content[activeCategory as keyof ContentData]
              .filter((item) => item?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-6 bg-blue-600/20 text-center rounded-lg shadow-xl hover:bg-blue-900 transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105"
                  onClick={() => handleItemClick(item)}
                >
                  <p className="text-lg font-semibold text-gray-100">{item.name}</p>
                </div>
              ))}
          </div>
        </div>
      ) : activeCategory ? (
        <p className="text-center text-gray-400">No data available</p>
      ) : null}

      {/* Item Card Modal */}
      {selectedItem && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-blue-950 p-8 rounded-lg shadow-xl transform scale-110 transition-transform duration-300 ease-in-out">
            <div className="flex flex-col items-center">
              <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                {selectedItem.name}
              </h2>
              <p className="text-lg text-gray-300 mt-4">{selectedItem.name}</p>
              <button
                className="mt-6 bg-gradient-to-r from-blue-500 to-blue-300 text-white px-8 py-3 rounded-lg hover:bg-red-500 transition-all duration-200"
                onClick={closeItemCard}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Valorant;
