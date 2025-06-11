import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// Import FixedSizeList for virtualization
import { FixedSizeList } from 'react-window';

// --- Type Definitions ---

// Common Rarity structure
interface Rarity {
  id: string;
  name: string;
  color: string;
}

// Common Collection structure (used by Agents and Skins)
interface Collection {
  id: string;
  name: string;
  image: string; // URL to collection image
}

// Team structure (specific to Agents)
interface Team {
  id: 'terrorists' | 'counter-terrorists';
  name: string;
}

// Base Item Interface - all items should have these
interface BaseItem {
  id: string;
  name: string;
  image: string; // Main image URL for the item
  type: string; // Will be assigned based on endpoint (e.g., "Agent", "Skin", "Sticker")
  market_hash_name?: string; // Common for market items
  rarity?: Rarity; // Many items have rarity
  description?: string; // Many items have descriptions
}

// Specific Item Interfaces extending BaseItem
interface AgentItem extends BaseItem {
  type: 'Agent';
  collections: Collection[];
  team: Team;
  model_player?: string;
}

interface SkinItem extends BaseItem {
  type: 'Skin';
  weapon?: { id: string; name: string; }; // e.g., { id: "bayonet", name: "Bayonet" }
  category?: string; // e.g., "Pistol", "Rifle", "Knife", "Glove"
  pattern?: string; // e.g., "Fade"
  min_float?: number;
  max_float?: number;
  souvenir?: boolean;
  stattrak?: boolean;
  crates?: { id: string; name: string; image: string; }[]; // Crates this skin drops from
  collections?: Collection[]; // Skins can also belong to collections
}

interface StickerItem extends BaseItem {
  type: 'Sticker';
  slot?: number; // Position on weapon
  capsule?: { id: string; name: string; image: string; }[]; // Capsules this sticker drops from
}

interface KeychainItem extends BaseItem {
  type: 'Keychain'; // Assuming this is a unique type based on the endpoint name
  // Add any specific properties for keychains if known
}

interface CollectionItem extends BaseItem {
  type: 'Collection';
  // Collections might have a specific image, but detailed items are within them
  // This might represent the collection itself, not items within it
  items?: CS2Item[]; // Optional: if collection details include its items
}

interface CrateItem extends BaseItem {
  type: 'Crate';
  contains?: { id: string; name: string; rarity?: Rarity; image: string; }[]; // What the crate contains
  keys?: { id: string; name: string; image: string; }[]; // Keys that open this crate
}

interface KeyItem extends BaseItem {
  type: 'Key';
  // Specific properties for keys, e.g., what crate it opens
  opens_crates?: { id: string; name: string; image: string; }[];
}

interface CollectibleItem extends BaseItem {
    type: 'Collectible'; // Assuming this is a unique type based on the endpoint name
    // Could include pins, medals, etc.
}

// Union Type for all possible CS2 items
type CS2Item = AgentItem | SkinItem | StickerItem | KeychainItem | CollectionItem | CrateItem | KeyItem | CollectibleItem;

// --- API Endpoints ---
const CS2_API_ENDPOINTS = {
  agents: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/agents.json',
  skins: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json',
  skins_not_grouped: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json', // Added back for full data
  stickers: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/stickers.json',
  keychains: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/keychains.json',
  collections: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/collections.json',
  crates: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json',
  keys: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/keys.json',
  collectibles: 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/collectibles.json',
};

// --- Helper Components ---
const Spinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] col-span-full text-center text-red-400 p-4 bg-gray-800 rounded-lg">
    <h3 className="text-2xl font-bold">Failed to Load CS2 Data</h3>
    <p className="mt-2 text-lg">{message}</p>
    <p className="mt-1 text-sm text-gray-500">Please try again later or check the API source.</p>
  </div>
);

// --- Main 'CS2' Component ---
const CS2 = () => {
  // --- State Management ---
  const [allItems, setAllItems] = useState<CS2Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<CS2Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Ref for the item list container to calculate its dynamic height
  const itemListRef = useRef<HTMLDivElement>(null);
  const [itemListHeight, setItemListHeight] = useState(0);

  // Fallback image in case the CDN image fails to load
  const NO_IMAGE_PLACEHOLDER = 'https://placehold.co/400x400/1a1a1a/666666?text=No+Image';

  // Fetch data on component mount
  useEffect(() => {
    const fetchAllCS2Data = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchPromises = Object.entries(CS2_API_ENDPOINTS).map(async ([key, url]) => {
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`Failed to fetch ${key}: Status ${response.status}`);
            return [];
          }
          const data = await response.json();
          const itemsArray = Array.isArray(data) ? data : Object.values(data);

          let itemType = key.replace(/s_not_grouped|s$/, ''); // Adjusted to handle 'skins_not_grouped'
          if (itemType === 'agent') itemType = 'Agent';
          else if (itemType === 'skin') itemType = 'Skin';
          else if (itemType === 'sticker') itemType = 'Sticker';
          else if (itemType === 'keychain') itemType = 'Keychain';
          else if (itemType === 'collection') itemType = 'Collection';
          else if (itemType === 'crate') itemType = 'Crate';
          else if (itemType === 'key') itemType = 'Key';
          else if (itemType === 'collectible') itemType = 'Collectible';
          else itemType = 'Unknown';

          return itemsArray.map((item: any) => ({
            ...item,
            type: itemType,
            image: item.image ? (item.image.startsWith('http') ? item.image : `https://community.akamai.steamstatic.com/economy/image/${item.image}`) : NO_IMAGE_PLACEHOLDER,
          }));
        });

        const results = await Promise.all(fetchPromises);
        const combinedItems: CS2Item[] = results.flat().filter(item => item.id && item.name && item.image);

        // Remove duplicates by ID
        const uniqueItemsMap = new Map<string, CS2Item>();
        combinedItems.forEach(item => {
          // Prioritize 'skins_not_grouped' if you wish, or the first one found.
          // Current logic keeps the first one found.
          if (!uniqueItemsMap.has(item.id)) {
            uniqueItemsMap.set(item.id, item);
          }
        });

        const uniqueCombinedItems = Array.from(uniqueItemsMap.values());
        const sortedItems = uniqueCombinedItems.sort((a, b) => a.name.localeCompare(b.name));
        
        setAllItems(sortedItems);
        if (sortedItems.length > 0) {
          setSelectedItem(sortedItems[0]);
        }
      } catch (e: any) {
        console.error('Failed to fetch all CS2 data:', e);
        setError(e.message || 'An unknown error occurred while fetching CS2 data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCS2Data();
  }, []);

  // Effect to measure the height of the item list container for FixedSizeList
  useEffect(() => {
    const updateHeight = () => {
      if (itemListRef.current) {
        // Calculate the height of the flex-grow container
        // This is important because FixedSizeList requires a fixed height.
        // We ensure the parent `aside` is `h-full` and `flex flex-col`
        // and the `itemListRef` div is `flex-grow`.
        // A simple way to get its height is through `getBoundingClientRect`.
        setItemListHeight(itemListRef.current.getBoundingClientRect().height);
      }
    };

    // Set initial height
    updateHeight();
    // Add event listener for window resize
    window.addEventListener('resize', updateHeight);
    // Cleanup
    return () => window.removeEventListener('resize', updateHeight);
  }, [isLoading]); // Recalculate if loading state changes (i.e., content appears)

  // Extract unique categories from the fetched data
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    allItems.forEach(item => uniqueCategories.add(item.type));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [allItems]);

  // --- Memoized Filtering ---
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.type === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allItems, searchQuery, selectedCategory]);

  // Helper for team text color (for Agent type)
  const getTeamColorClass = useCallback((teamId: Team['id']) => {
    return teamId === 'terrorists' ? 'text-orange-400' : 'text-blue-400';
  }, []);

  // --- Item Row Component for FixedSizeList ---
  // This component renders a single item in the virtualized list.
  // `index` is the index of the item in `filteredItems`.
  // `style` MUST be applied to the root element for virtualization to work correctly.
  const ItemRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = filteredItems[index];

      if (!item) return null; // Should not happen with correct data/itemCount

      return (
        // Apply the style prop provided by react-window to the outer div
        // This style includes positioning (top, left, width, height)
        <div style={style} className="p-1"> {/* p-1 adds a small gap between items */}
          <button
            // No need for key here as react-window handles it internally for rows
            onClick={() => setSelectedItem(item)}
            className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 ${selectedItem?.id === item.id ? 'ring-4 ring-yellow-500' : 'ring-2 ring-transparent'}`}
            title={item.name}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            {/* Rarity indicator if available */}
            {item.rarity && (
              <div
                className="absolute top-1 right-1 w-3 h-3 rounded-full border border-white/50"
                style={{ backgroundColor: item.rarity.color }}
                title={item.rarity.name}
              ></div>
            )}

            {/* Team indicator for Agents */}
            {(item as AgentItem).team && (
              <div className={`absolute top-1 left-1 text-xs font-bold px-1 py-0.5 rounded ${
                (item as AgentItem).team.id === 'terrorists' ? 'bg-orange-500/80' : 'bg-blue-500/80'
              }`}>
                {(item as AgentItem).team.id === 'terrorists' ? 'T' : 'CT'}
              </div>
            )}

            <p className="absolute bottom-1 left-0 right-0 text-center text-xs font-semibold text-white truncate px-1">
              {item.name.split(' | ')[0]}
            </p>
          </button>
        </div>
      );
    },
    [filteredItems, selectedItem, setSelectedItem, NO_IMAGE_PLACEHOLDER, getTeamColorClass] // Dependencies
  );

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center text-red-500">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  const splashImageUrl = selectedItem
    ? selectedItem.image
    : 'https://placehold.co/1280x720/1a1a1a/2e2e2e?text=Select+a+CS2+Item';

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-gray-200">
      {/* Background with selected item */}
      <div className="fixed inset-0 z-0">
        <div
          key={selectedItem ? selectedItem.id : 'none'}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-all duration-1000"
          style={{ 
            backgroundImage: splashImageUrl 
              ? `url(${splashImageUrl})` 
              : 'linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 100%)'
          }}
          onError={(e: React.SyntheticEvent<HTMLDivElement, Event>) => {
            (e.target as HTMLDivElement).style.backgroundImage = `url(${NO_IMAGE_PLACEHOLDER})`;
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
      </div>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 h-screen">

        {/* --- Item List and Search (Left Panel) --- */}
        <aside className="lg:col-span-1 xl:col-span-1 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 flex flex-col h-full overflow-hidden border border-yellow-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">CS2 Items ({filteredItems.length})</h2>

          {/* Category Menu */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4 max-h-[120px] overflow-y-auto custom-scrollbar pr-2"> {/* Added overflow and max-height back */}
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery('');
                    const firstItemInCategory = category === 'All' 
                      ? allItems[0] 
                      : allItems.find(item => item.type === category);
                    setSelectedItem(firstItemInCategory || null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition relative z-10 ${
                    selectedCategory === category
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={`Search ${selectedCategory !== 'All' ? selectedCategory : ''} Item...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            />
          </div>

          {/* Items Grid - Virtualized with FixedSizeList */}
          {/* Ref to get the actual height for FixedSizeList */}
          <div ref={itemListRef} className="flex-grow overflow-hidden"> 
            {itemListHeight > 0 && filteredItems.length > 0 ? (
              <FixedSizeList
                height={itemListHeight} // Use dynamically calculated height
                itemCount={filteredItems.length}
                // Calculate itemSize based on your grid-cols and gap:
                // For 'grid-cols-2' in a full-width container: (containerWidth / 2) + gap
                // Approximate item size with p-1 (2px on each side for padding) and gap-3 (12px)
                // This is an approximation. For pixel-perfect, you might need a more complex calculation.
                // A typical item size for a 2-column grid will be roughly half the container width.
                // Since the grid also has `gap-3` (12px), we need to account for that.
                // If the item itself has an aspect-square, its height will be its width.
                // Let's assume a typical item width (including its own padding/border) is about 120-150px.
                // Since `react-window` uses a single `itemSize` for height, we need to pick a representative value.
                // Let's go with a safe estimate that includes the vertical space.
                itemSize={150} // Approximate height of one item (including its vertical margin/padding)
                width="100%"
                className="custom-scrollbar" // Apply scrollbar to the list itself
              >
                {ItemRow}
              </FixedSizeList>
            ) : filteredItems.length === 0 && !isLoading ? (
              <p className="text-center text-gray-500 py-4">No items found matching your filters.</p>
            ) : null}
          </div>
        </aside>

        {/* --- Item Details (Right Panel) --- */}
        <section className="lg:col-span-2 xl:col-span-3 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 md:p-8 flex flex-col h-full overflow-y-auto border border-yellow-500/20 custom-scrollbar">
          {selectedItem ? (
            <div key={selectedItem.id} className="animate-fade-in-up">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white mb-2" style={{ textShadow: '0 0 10px rgba(253, 224, 71, 0.5)' }}>
                  {selectedItem.name}
                </h1>
                {selectedItem.rarity && (
                  <p className="text-xl md:text-2xl font-light capitalize" style={{ color: selectedItem.rarity.color }}>
                    {selectedItem.rarity.name} {selectedItem.type}
                  </p>
                )}
                {!selectedItem.rarity && (
                  <p className="text-xl md:text-2xl font-light capitalize text-gray-400">
                    {selectedItem.type}
                  </p>
                )}
              </div>

              {/* Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {selectedItem.description && (
                    <>
                      <h3 className="font-bold text-white mb-2">Description</h3>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
                        {selectedItem.description.replace(/\\n/g, '\n')}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4">
                  {selectedItem.market_hash_name && (
                    <div>
                      <h3 className="font-bold text-white mb-1">Market Name</h3>
                      <p className="text-sm text-gray-400">{selectedItem.market_hash_name}</p>
                    </div>
                  )}

                  {/* Type-specific details */}
                  {selectedItem.type === 'Agent' && (
                    <>
                      {(selectedItem as AgentItem).team && (
                        <div>
                          <h3 className="font-bold text-white mb-1">Team</h3>
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getTeamColorClass((selectedItem as AgentItem).team.id)}`} 
                                 style={{ backgroundColor: (selectedItem as AgentItem).team.id === 'terrorists' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0, 191, 255, 0.2)' }}>
                            {(selectedItem as AgentItem).team.name}
                          </span>
                        </div>
                      )}
                      {(selectedItem as AgentItem).collections && (selectedItem as AgentItem).collections.length > 0 && (
                        <div>
                          <h3 className="font-bold text-white mb-1">Collections</h3>
                          <div className="flex flex-wrap gap-2">
                            {(selectedItem as AgentItem).collections.map(collection => (
                              <div key={collection.id} className="bg-gray-800/50 flex items-center p-1 rounded-full text-gray-300 text-xs font-semibold">
                                {collection.image && <img src={collection.image} alt={collection.name} className="w-5 h-5 rounded-full mr-2 object-cover" />}
                                {collection.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem.type === 'Skin' && (
                    <>
                      {(selectedItem as SkinItem).weapon && (
                        <div>
                          <h3 className="font-bold text-white mb-1">Weapon</h3>
                          <span className="bg-gray-700/50 text-gray-300 text-sm font-semibold px-3 py-1 rounded-full">
                            {(selectedItem as SkinItem).weapon?.name}
                          </span>
                        </div>
                      )}
                      {(selectedItem as SkinItem).category && (
                        <div>
                          <h3 className="font-bold text-white mb-1">Category</h3>
                          <span className="bg-gray-700/50 text-gray-300 text-sm font-semibold px-3 py-1 rounded-full">
                            {(selectedItem as SkinItem).category}
                          </span>
                        </div>
                      )}
                      {(selectedItem as SkinItem).min_float !== undefined && (selectedItem as SkinItem).max_float !== undefined && (
                        <div>
                          <h3 className="font-bold text-white mb-1">Float Range</h3>
                          <p className="text-gray-300 text-sm">
                            {(selectedItem as SkinItem).min_float?.toFixed(3)} - {(selectedItem as SkinItem).max_float?.toFixed(3)}
                          </p>
                        </div>
                      )}
                      {(selectedItem as SkinItem).stattrak !== undefined && (
                        <div>
                          <h3 className="font-bold text-white mb-1">StatTrak™</h3>
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${(selectedItem as SkinItem).stattrak ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {(selectedItem as SkinItem).stattrak ? 'Yes' : 'No'}
                          </span>
                        </div>
                      )}
                       {((selectedItem as SkinItem).collections ?? []).length > 0 && (
                        <div>
                          <h3 className="font-bold text-white mb-1 mt-4">Collections</h3>
                          <div className="flex flex-wrap gap-2">
                            {(selectedItem as SkinItem).collections?.map(collection => (
                              <div key={collection.id} className="bg-gray-800/50 flex items-center p-1 rounded-full text-gray-300 text-xs font-semibold">
                                {collection.image && <img src={collection.image} alt={collection.name} className="w-5 h-5 rounded-full mr-2 object-cover" />}
                                {collection.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                       {((selectedItem as SkinItem).crates ?? []).length > 0 && (
                        <div>
                          <h3 className="font-bold text-white mb-1 mt-4">Available In Crates</h3>
                          <div className="flex flex-wrap gap-2">
                            {(selectedItem as SkinItem).crates?.map(crate => (
                              <div key={crate.id} className="bg-gray-800/50 flex items-center p-1 rounded-full text-gray-300 text-xs font-semibold">
                                {crate.image && <img src={crate.image} alt={crate.name} className="w-5 h-5 rounded-full mr-2 object-cover" />}
                                {crate.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem.type === 'Sticker' && (
                    <>
                      {(selectedItem as StickerItem).slot !== undefined && (
                        <div>
                          <h3 className="font-bold text-white mb-1">Slot</h3>
                          <span className="bg-gray-700/50 text-gray-300 text-sm font-semibold px-3 py-1 rounded-full">
                            {(selectedItem as StickerItem).slot}
                          </span>
                        </div>
                      )}
                      {((selectedItem as StickerItem).capsule ?? []).length > 0 && (
                        <div>
                          <h3 className="font-bold text-white mb-1 mt-4">Available In Capsules</h3>
                          <div className="flex flex-wrap gap-2">
                            {(selectedItem as StickerItem).capsule?.map(capsule => (
                              <div key={capsule.id} className="bg-gray-800/50 flex items-center p-1 rounded-full text-gray-300 text-xs font-semibold">
                                {capsule.image && <img src={capsule.image} alt={capsule.name} className="w-5 h-5 rounded-full mr-2 object-cover" />}
                                {capsule.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem.type === 'Crate' && (
                    <>
                      {((selectedItem as CrateItem).contains ?? []).length > 0 && (
                        <div>
                          <h3 className="font-bold text-white mb-1 mt-4">Contains</h3>
                          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {(selectedItem as CrateItem).contains?.map(item => (
                              <div key={item.id} className="bg-gray-800/50 flex items-center p-1 rounded-full text-gray-300 text-xs font-semibold">
                                {item.image && <img src={item.image} alt={item.name} className="w-5 h-5 rounded-full mr-2 object-cover" />}
                                {item.name}
                                {item.rarity && <span className="ml-1 text-xs" style={{ color: item.rarity.color }}>({item.rarity.name})</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {((selectedItem as CrateItem).keys ?? []).length > 0 && (
                        <div>
                          <h3 className="font-bold text-white mb-1 mt-4">Required Key</h3>
                          <div className="flex flex-wrap gap-2">
                            {(selectedItem as CrateItem).keys?.map(keyItem => (
                              <div key={keyItem.id} className="bg-gray-800/50 flex items-center p-1 rounded-full text-gray-300 text-xs font-semibold">
                                {keyItem.image && <img src={keyItem.image} alt={keyItem.name} className="w-5 h-5 rounded-full mr-2 object-cover" />}
                                {keyItem.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem.type === 'Key' && (
                    <>
                      {((selectedItem as KeyItem).opens_crates ?? []).length > 0 && (
                        <div>
                          <h3 className="font-bold text-white mb-1 mt-4">Opens Crates</h3>
                          <div className="flex flex-wrap gap-2">
                            {(selectedItem as KeyItem).opens_crates?.map(crate => (
                              <div key={crate.id} className="bg-gray-800/50 flex items-center p-1 rounded-full text-gray-300 text-xs font-semibold">
                                {crate.image && <img src={crate.image} alt={crate.name} className="w-5 h-5 rounded-full mr-2 object-cover" />}
                                {crate.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem.type === 'Collection' && (selectedItem as CollectionItem).items && (selectedItem as CollectionItem).items!.length > 0 ? (
                    <div>
                      <h3 className="font-bold text-white mb-1 mt-4">Items in Collection</h3>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {(selectedItem as CollectionItem).items!.map(item => (
                          <div key={item.id} className="bg-gray-800/50 flex items-center p-1 rounded-full text-gray-300 text-xs font-semibold">
                            {item.image && <img src={item.image} alt={item.name} className="w-5 h-5 rounded-full mr-2 object-cover" />}
                            {item.name}
                            {item.rarity && <span className="ml-1 text-xs" style={{ color: item.rarity.color }}>({item.rarity.name})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-2xl text-gray-500">Select an item to view details</p>
            </div>
          )}
        </section>
      </main>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(253, 224, 71, 0.6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(253, 224, 71, 0.8);
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CS2;