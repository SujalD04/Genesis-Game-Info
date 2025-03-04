import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BASE_URL = "http://localhost:5000";

const categories = [
  { title: "Agents", key: "characters" },
  { title: "Maps", key: "maps" },
  { title: "Skins", key: "skins" },
  { title: "Gun Buddies", key: "charms" },
  { title: "Player Cards", key: "playerCards" },
  { title: "Sprays", key: "sprays" },
  { title: "Game Modes", key: "gameModes" },
];

const Valorant = () => {
  const [content, setContent] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${BASE_URL}/api/valorant/content`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        setContent(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setSearchTerm("");
    setSelectedItem(null);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 mt-16 flex flex-col items-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent font-orbitron mb-12 tracking-wide">
        Valorant
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {categories.map(({ title, key }) => (
              <button
                key={key}
                onClick={() => handleCategoryClick(key)}
                className={`p-6 rounded-lg text-xl font-medium shadow-lg transition-all transform hover:scale-105 ${
                  activeCategory === key
                    ? "bg-gradient-to-r from-blue-500 to-blue-300"
                    : "bg-blue-600/20 hover:bg-blue-900"
                }`}
              >
                {title}
              </button>
            ))}
          </div>

          {activeCategory && content && Array.isArray(content[activeCategory]) ? (
            <div className="w-full max-w-6xl">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-4 mb-6 text-white bg-gray-800 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {content[activeCategory]
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-6 bg-blue-600/20 text-center rounded-lg shadow-xl hover:bg-blue-900 transition-all cursor-pointer transform hover:scale-105"
                      onClick={() => handleItemClick(item)}
                    >
                      {item.portrait || item.image || item.displayIcon ? (
                        <img
                          src={item.portrait || item.image || item.displayIcon}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      ) : null}
                      <p className="text-lg font-semibold">{item.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {selectedItem && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-blue-950 p-8 rounded-lg shadow-xl">
                <div className="flex flex-col items-center">
                  <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                    {selectedItem.name}
                  </h2>
                  {selectedItem.portrait || selectedItem.image || selectedItem.displayIcon ? (
                    <img
                      src={selectedItem.portrait || selectedItem.image || selectedItem.displayIcon}
                      alt={selectedItem.name}
                      className="w-64 h-64 object-cover mt-4 rounded-lg"
                    />
                  ) : null}
                  <button
                    className="mt-6 bg-gradient-to-r from-blue-500 to-blue-300 text-white px-8 py-3 rounded-lg hover:bg-red-500"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Valorant;
