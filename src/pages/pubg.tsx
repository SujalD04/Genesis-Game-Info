import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FixedSizeList } from 'react-window'; // For virtualization

// --- Type Definitions (Assumed structures based on common API patterns) ---

interface BasePUBGItem {
  id: string; // Unique identifier for the item
  name: string; // Display name
  image: string; // URL to the item's image
  type: 'Weapon' | 'Attachment' | 'Equipment' | 'Consumable' | 'Map' | 'Vehicle' | 'Ammo' | 'Unknown' | 'Tier';
  description?: string;
  // Add any other common properties here if applicable
}

// Example specific properties (you might need to adjust based on actual API data)
interface WeaponItem extends BasePUBGItem {
  type: 'Weapon';
  category?: string; // e.g., "Assault Rifles", "Snipers" - sometimes 'category' can be nested or in a different field
  ammoType?: string; // Often 'bullet_type' in API
  damage?: number; // From 'details.damage'
  fireRate?: number; // From 'details.fire_rate' or similar
  magazineSize?: number; // From 'without_mag', 'with_mag'
  attachments?: string[]; // Assuming the API gives a list of compatible attachment names/ids
  mode?: string; // e.g., "Single/Auto"
  short_description?: string; // Specific to weapons
  bullet_type?: string; // Specific to weapons
  without_mag?: string;
  with_mag?: string;
  fire_modes?: string;
  details?: {
    damage?: string;
    bullet_speed?: string;
    impact?: string;
    pickup_delay?: string;
    ready_delay?: string;
    normal_reload?: string;
    quick_reload?: string;
  };
}

interface AttachmentItem extends BasePUBGItem {
  type: 'Attachment';
  category?: string; // e.g., "Muzzles", "Scopes", "Grips"
  compatibleWeapons?: string[]; // IDs or names of weapons it can be used on
  effect?: string; // e.g., "Reduces recoil"
}

interface EquipmentItem extends BasePUBGItem { // Helmets, Vests, Backpacks
  type: 'Equipment';
  level?: number; // Level 1, 2, 3
  protection?: number; // Damage reduction percentage
  capacity?: number; // For backpacks
}

interface ConsumableItem extends BasePUBGItem { // First-aid, Bandages, Boosters
  type: 'Consumable';
  effect?: string; // e.g., "Restores HP", "Boosts energy"
  usageTime?: string; // e.g., "6 seconds"
}

interface MapItem extends BasePUBGItem {
  type: 'Map';
  size?: string; // e.g., "8x8 km"
  terrain?: string; // e.g., "Urban, Rural"
  maxPlayers?: number;
}

interface VehicleItem extends BasePUBGItem {
  type: 'Vehicle';
  seats?: number;
  speed?: string;
  durability?: number;
  fuelCapacity?: number;
}

interface AmmoItem extends BasePUBGItem {
  type: 'Ammo';
  caliber?: string; // e.g., "5.56mm", "7.62mm"
  compatibleWeapons?: string[]; // List of weapons using this ammo
}

interface TierInfo {
  id: string;
  name: string;
  image: string; // Tier icon
  pointsRequired?: number;
  // ... any other tier specific details
}

interface AmmoItem extends BasePUBGItem {
  type: 'Ammo';
  caliber?: string; // This will likely map to 'name' in the JSON for the ammo itself, or some specific field like 'bullet_type' if it exists.
  useon?: string; // This is the comma-separated string from the API
  compatibleWeapons?: string[]; // This will be derived from 'useon'
}

interface ConsumableItem extends BasePUBGItem { // First-aid, Bandages, Boosters
  type: 'Consumable';
  heals?: string; // e.g., "100%", "60%"
  capacity?: string; // e.g., "20", "10" (assuming string as per JSON)
  cast_time?: string; // e.g., "8sec", "6sec"
  // Keep original fields if they might appear from other sources or for consistency
  effect?: string; // You can map 'heals' to 'effect' if you prefer, or keep both
  usageTime?: string; // You can map 'cast_time' to 'usageTime' if you prefer, or keep both
}

// Union Type for all possible PUBG items to display in the list
type PUBGItem = WeaponItem | AttachmentItem | EquipmentItem | ConsumableItem | MapItem | VehicleItem | AmmoItem | { type: 'Unknown' };

// --- API Endpoints ---
const PUBG_BASE_API_URL = 'https://raw.githubusercontent.com/pubgapi/v2/main';

const PUBG_API_ENDPOINTS = {
  weapons: `${PUBG_BASE_API_URL}/all`, // Confirmed: This is 'all guns'
  ammo: `${PUBG_BASE_API_URL}/ammo`,
  attachments: `${PUBG_BASE_API_URL}/attachs`,
  equipment: `${PUBG_BASE_API_URL}/body`, // "All Equiments (helmet,bag,vest)"
  consumables: `${PUBG_BASE_API_URL}/health`, // "All Consumables (First-ad, Bandages etc)"
  maps: `${PUBG_BASE_API_URL}/maps`,
  vehicles: `${PUBG_BASE_API_URL}/vehicles`,
  tiers: `${PUBG_BASE_API_URL}/tier`, // Not for main browse, but for completeness
};

// --- Helper Components ---
const Spinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] col-span-full text-center text-red-400 p-4 bg-gray-800 rounded-lg">
    <h3 className="text-2xl font-bold">Failed to Load PUBG Data</h3>
    <p className="mt-2 text-lg">{message}</p>
    <p className="mt-1 text-sm text-gray-500">Please try again later or check the API source.</p>
  </div>
);

// --- Main 'PUBG' Component ---
const PUBGPage = () => {
  // --- State Management ---
  const [allItems, setAllItems] = useState<PUBGItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PUBGItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PUBGItem['type'] | 'All'>('Weapon'); // Default to 'Weapon' as it's the 'all' endpoint

  // Ref for the item list container to calculate its dynamic height
  const itemListRef = useRef<HTMLDivElement>(null);
  const [itemListHeight, setItemListHeight] = useState(0);

  // Fallback image in case the actual image URL is missing or fails
  const NO_IMAGE_PLACEHOLDER = 'https://placehold.co/400x400/3a3a3a/666666?text=PUBG+Item';
  const SPLASH_PLACEHOLDER = 'https://cdn.wccftech.com/wp-content/uploads/2018/06/pubg-erangel.jpg';

  // --- Data Fetching Effect ---
    useEffect(() => {
    const fetchAllPUBGData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchPromises = Object.entries(PUBG_API_ENDPOINTS).map(async ([key, url]) => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              console.warn(`Failed to fetch ${key} from ${url}: Status ${response.status}`);
              return []; // Return empty array if fetch fails for this endpoint
            }
            const data = await response.json();
            
             let itemsArray: any[] = [];
             let itemType: PUBGItem['type'];

             switch (key) {
               case 'weapons': 
                 itemsArray = Array.isArray(data) ? data : Object.values(data);
                 itemType = 'Weapon'; 
                 break;
               case 'ammo': 
                 // Special handling for ammo endpoint: it's an array of objects, each containing 'ammo' and 'guns'
                 itemsArray = data.map((entry: any) => ({
                   ...entry.ammo, // Spread the ammo object directly
                   guns: entry.guns // Keep the guns array for later processing if needed, though for compatibleWeapons we'll use 'useon'
                 }));
                 itemType = 'Ammo'; 
                 break;
               case 'attachments': 
                 itemsArray = Array.isArray(data) ? data : Object.values(data);
                 itemType = 'Attachment'; 
                 break;
               case 'equipment': 
                 itemsArray = Array.isArray(data) ? data : Object.values(data);
                 itemType = 'Equipment'; 
                 break;
               case 'consumables': 
                 itemsArray = Array.isArray(data) ? data : Object.values(data);
                 itemType = 'Consumable'; 
                 break; 
               case 'maps': 
                 itemsArray = Array.isArray(data) ? data : Object.values(data);
                 itemType = 'Map'; 
                 break;
               case 'vehicles': 
                 itemsArray = Array.isArray(data) ? data : Object.values(data);
                 itemType = 'Vehicle'; 
                 break;
               // case 'tiers': itemType = 'Tier'; break; // Explicitly mark tiers
               default: 
                 itemsArray = Array.isArray(data) ? data : Object.values(data); // Default fallback
                 itemType = 'Unknown';
             }

            // Map and normalize item data, assigning explicit 'type'
                        return itemsArray.map((item: any) => ({
              id: item.id || item.name || item.Key || item.Name || `unknown-${itemType}-${Math.random()}`,
              name: item.name || item.Key || item.Name || 'Unknown Item',
              image: item.image || item.imageUrl || item.Icon || NO_IMAGE_PLACEHOLDER,
              type: itemType, // Explicitly assigned
              description: item.description || item.Desc || item.short_des || undefined, 
              // Spread all original properties, specific interfaces will pick them up
              ...item,
              // Special handling for Weapon details if applicable based on the example JSON
              damage: item.details?.damage ? parseFloat(item.details.damage) : undefined,
              bullet_type: item.bullet_type || item.caliber, 
              magazineSize: item.with_mag || item.without_mag,
              fireRate: item.details?.fire_rate || undefined, 
              mode: item.fire_modes || undefined,
              caliber: itemType === 'Ammo' ? item.name : undefined,
              compatibleWeapons: itemType === 'Ammo' && item.useon ? item.useon.split(',').map((w: string) => w.trim()) : undefined,
              // --- Consumable specific handling ---
              heals: itemType === 'Consumable' ? item.heals : undefined,
              capacity: itemType === 'Consumable' ? item.capacity : undefined,
              cast_time: itemType === 'Consumable' ? item.cast_time : undefined,
              // Optionally map to your existing 'effect' and 'usageTime' if you want a single consistent field
              effect: itemType === 'Consumable' ? (item.heals ? `Restores ${item.heals} Health` : item.effect) : undefined,
              usageTime: itemType === 'Consumable' ? (item.cast_time || item.usageTime) : undefined,
            })).filter(item => item.id && item.name);
          } catch (e: any) {
            console.error(`Error fetching ${key} from ${url}:`, e);
            return [];
          }
        });

        const results = await Promise.all(fetchPromises);
        const combinedItems: PUBGItem[] = results.flat();

        // De-duplication by ID, filter out 'Tier' items from the main browsable list
        const uniqueItemsMap = new Map<string, PUBGItem>();
        combinedItems.forEach(item => {
          if ('id' in item && !uniqueItemsMap.has(item.id) && (item.type as string) !== 'Tier') {
            uniqueItemsMap.set(item.id, item);
          }
        });

        const uniqueCombinedItems = Array.from(uniqueItemsMap.values());
        const sortedItems = uniqueCombinedItems
          .filter((item): item is PUBGItem & { name: string } => item.type !== 'Unknown' && !!item.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setAllItems(sortedItems);
        
        // After fetching all items, set initial category and potentially select the first item
        if (sortedItems.length > 0) {
          const firstAvailableCategory = (Array.from(new Set(sortedItems.map(item => item.type))).sort())[0] || 'Weapon';
          setSelectedCategory(firstAvailableCategory as PUBGItem['type']);
          // Select the first item of the initial selected category
          setSelectedItem(sortedItems.find(item => item.type === firstAvailableCategory) || null);
        } else {
          setSelectedCategory('All'); // Fallback if no items
        }

      } catch (e: any) {
        console.error('Failed to fetch all PUBG data:', e);
        setError(e.message || 'An unknown error occurred while fetching PUBG data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPUBGData();
  }, []);

  // Effect to measure the height of the item list container for FixedSizeList
  useEffect(() => {
    const updateHeight = () => {
      if (itemListRef.current) {
        setItemListHeight(itemListRef.current.clientHeight); // Use clientHeight for visible height
      }
    };

    updateHeight(); // Set initial height
    window.addEventListener('resize', updateHeight); // Add event listener for window resize
    return () => window.removeEventListener('resize', updateHeight); // Cleanup
  }, [isLoading, selectedCategory, selectedItem]); // Recalculate if loading, category, or selected item changes

  // Extract unique categories from the fetched data
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    allItems.forEach(item => uniqueCategories.add(item.type));
    // Filter out 'Unknown' if no items matched it
    const finalCategories = Array.from(uniqueCategories).filter(cat => cat !== 'Unknown' || allItems.some(item => item.type === 'Unknown'));
    return ['All', ...finalCategories.sort()];
  }, [allItems]);

  // --- Memoized Filtering for the Right Panel's List View ---
  const currentCategoryItems = useMemo(() => {
      return allItems.filter(item => selectedCategory === 'All' || item.type === selectedCategory);
  }, [allItems, selectedCategory]);

  const filteredItems = useMemo(() => {
    return currentCategoryItems.filter(item => {
      const matchesSearch = 'name' in item && item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [currentCategoryItems, searchQuery]);

  // --- Item Row Component for FixedSizeList ---
  const PUBGItemRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = filteredItems[index];

      if (!item) return null;

      // Determine background color based on item type for visual distinction
      let itemBgColor = 'bg-gray-800';
      switch (item.type) {
        case 'Weapon': itemBgColor = 'bg-red-900/40'; break;
        case 'Attachment': itemBgColor = 'bg-blue-900/40'; break;
        case 'Equipment': itemBgColor = 'bg-green-900/40'; break;
        case 'Consumable': itemBgColor = 'bg-purple-900/40'; break;
        case 'Map': itemBgColor = 'bg-yellow-900/40'; break;
        case 'Vehicle': itemBgColor = 'bg-teal-900/40'; break;
        case 'Ammo': itemBgColor = 'bg-orange-900/40'; break;
        default: itemBgColor = 'bg-gray-800/40'; // For 'Unknown' or 'Tier' if they somehow make it in
      }

      return (
        <div style={style} className="p-1">
          <button
            onClick={() => setSelectedItem(item)}
            className={`relative flex flex-col items-center justify-center p-2 rounded-lg overflow-hidden transition-all duration-300 transform 
            hover:scale-105 hover:shadow-lg hover:shadow-blue-700/30
            focus:outline-none focus:ring-4 focus:ring-blue-500 w-full h-full
            ${selectedItem && 'id' in selectedItem && 'id' in item && selectedItem.id === item.id ? 'ring-4 ring-blue-500 shadow-xl shadow-blue-700/50' : 'ring-2 ring-transparent'}
            ${itemBgColor} border border-transparent hover:border-blue-700`}
            title={'name' in item ? item.name : 'Unknown Item'}
          >
            <img
              src={'image' in item ? item.image : NO_IMAGE_PLACEHOLDER}
              alt={'name' in item ? item.name : 'Unknown Item'}
              className="w-16 h-16 object-contain mb-1 drop-shadow-md" // Smaller image for list view
              onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
              loading="lazy"
            />
            <p className="text-center text-xs font-semibold text-white truncate w-full px-1 pt-1">
              {'name' in item ? item.name : 'Unknown Item'}
            </p>
            <span className="absolute top-1 right-1 text-[0.65rem] px-2 py-0.5 rounded-full bg-blue-800/70 text-blue-200 font-semibold tracking-wide">
              {item.type}
            </span>
          </button>
        </div>
      );
    },
    [filteredItems, selectedItem, setSelectedItem, NO_IMAGE_PLACEHOLDER] // Dependencies for useCallback
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

  // Choose splash image dynamically
  const splashImageUrl = selectedItem && 'image' in selectedItem ? selectedItem.image : SPLASH_PLACEHOLDER;

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-gray-200">
      {/* Background with selected item or placeholder */}
      <div className="fixed inset-0 z-0">
        <div
          key={selectedItem && 'id' in selectedItem ? selectedItem.id : 'none'}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${splashImageUrl})`,
            // If it's a small icon, maybe blur it more or make it a pattern
            backgroundSize: selectedItem?.type === 'Ammo' || selectedItem?.type === 'Attachment' ? '200px' : 'cover',
            filter: selectedItem?.type === 'Ammo' || selectedItem?.type === 'Attachment' ? 'blur(10px) brightness(0.7)' : 'blur(2px) brightness(0.7)',
            transition: 'filter 1s ease-in-out, background-size 1s ease-in-out'
          }}
          onError={(e: React.SyntheticEvent<HTMLDivElement, Event>) => {
            (e.target as HTMLDivElement).style.backgroundImage = `url(${SPLASH_PLACEHOLDER})`;
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
      </div>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 h-screen">

        {/* --- Category Menu (Left Panel) --- */}
        <aside className="lg:col-span-1 xl:col-span-1 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-6 flex flex-col h-full overflow-hidden border border-blue-500/20 shadow-xl">
          <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-wide">CATEGORIES</h2>

          {/* Category List */}
          <nav className="flex-grow overflow-y-auto custom-scrollbar pr-2">
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category as PUBGItem['type'] | 'All'); // Cast for type safety
                      setSearchQuery(''); // Reset search when category changes
                      setSelectedItem(null); // Reset selected item to show list
                    }}
                    className={`block w-full text-left px-5 py-3 rounded-xl text-xl font-semibold transition-all duration-250 transform hover:scale-105 hover:bg-blue-700 hover:text-white
                      ${selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-transparent'
                      }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* --- Content (Right Panel: Item List or Item Details) --- */}
        <section className="lg:col-span-2 xl:col-span-3 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col h-full overflow-y-auto border border-blue-500/20 shadow-xl custom-scrollbar">
          {selectedItem ? (
            // --- Item Details View ---
            <div key={'id' in selectedItem ? selectedItem.id : 'unknown'} className="animate-fade-in-up flex flex-col h-full">
              <button
                onClick={() => setSelectedItem(null)} // Go back to list
                className="mb-6 self-start px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold flex items-center transition-all duration-200 hover:shadow-md hover:translate-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to {selectedCategory !== 'All' ? selectedCategory : 'All Items'}
              </button>

              {/* Header */}
              <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
                {selectedItem && 'image' in selectedItem && (
                  <img src={selectedItem.image} alt={'name' in selectedItem ? selectedItem.name : 'Unknown Item'} className="w-32 h-32 object-contain drop-shadow-lg" onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }} />
                )}
                <div className="text-center md:text-left">
                  <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-white mb-2" style={{ textShadow: '0 0 15px rgba(66, 153, 225, 0.7)' }}>
                    {'name' in selectedItem ? selectedItem.name : 'Unknown Item'}
                  </h1>
                  <p className="text-2xl md:text-3xl font-light capitalize text-blue-400">
                    {selectedItem.type}
                  </p>
                </div>
              </div>

              {/* Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  {'description' in selectedItem && selectedItem.description && (
                    <>
                      <h3 className="font-bold text-white text-2xl mb-3 border-b border-gray-700 pb-2">Description</h3>
                      <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap mb-6">
                        {selectedItem.description.replace(/\\n/g, '\n')}
                      </p>
                    </>
                  )}
                  
                  {/* Dynamic properties based on item type */}
                  <h3 className="font-bold text-white text-2xl mb-3 border-b border-gray-700 pb-2">Details</h3>
                  <div className="space-y-2">
                    {selectedItem.type === 'Weapon' && (
                      <>
                        {(selectedItem as WeaponItem).category && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Category:</span> {(selectedItem as WeaponItem).category}</p>}
                        {(selectedItem as WeaponItem).bullet_type && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Bullet Type:</span> {(selectedItem as WeaponItem).bullet_type}</p>}
                        {(selectedItem as WeaponItem).damage !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Damage:</span> {(selectedItem as WeaponItem).damage}</p>}
                        {(selectedItem as WeaponItem).fireRate !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Fire Rate:</span> {(selectedItem as WeaponItem).fireRate}</p>}
                        {(selectedItem as WeaponItem).magazineSize !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Magazine Size:</span> {(selectedItem as WeaponItem).magazineSize}</p>}
                        {(selectedItem as WeaponItem).mode && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Fire Modes:</span> {(selectedItem as WeaponItem).mode}</p>}
                      </>
                    )}

                    {selectedItem.type === 'Attachment' && (
                      <>
                        {(selectedItem as AttachmentItem).category && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Category:</span> {(selectedItem as AttachmentItem).category}</p>}
                        {(selectedItem as AttachmentItem).effect && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Effect:</span> {(selectedItem as AttachmentItem).effect}</p>}
                      </>
                    )}

                    {selectedItem.type === 'Equipment' && (
                      <>
                        {(selectedItem as EquipmentItem).level !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Level:</span> {(selectedItem as EquipmentItem).level}</p>}
                        {(selectedItem as EquipmentItem).protection !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Protection:</span> {(selectedItem as EquipmentItem).protection}%</p>}
                        {(selectedItem as EquipmentItem).capacity !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Capacity:</span> {(selectedItem as EquipmentItem).capacity} units</p>}
                      </>
                    )}

                    {selectedItem.type === 'Consumable' && (
                    <>
                      {(selectedItem as ConsumableItem).heals && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Heals:</span> {(selectedItem as ConsumableItem).heals}</p>}
                      {(selectedItem as ConsumableItem).capacity && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Capacity:</span> {(selectedItem as ConsumableItem).capacity}</p>}
                      {(selectedItem as ConsumableItem).cast_time && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Cast Time:</span> {(selectedItem as ConsumableItem).cast_time}</p>}
                      {/* If you still want to use 'effect' and 'usageTime' as fallback/derived fields */}
                      {!(selectedItem as ConsumableItem).heals && (selectedItem as ConsumableItem).effect && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Effect:</span> {(selectedItem as ConsumableItem).effect}</p>}
                      {!(selectedItem as ConsumableItem).cast_time && (selectedItem as ConsumableItem).usageTime && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Usage Time:</span> {(selectedItem as ConsumableItem).usageTime}</p>}
                    </>
                  )}

                    {selectedItem.type === 'Map' && (
                      <>
                        {(selectedItem as MapItem).size && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Size:</span> {(selectedItem as MapItem).size}</p>}
                        {(selectedItem as MapItem).terrain && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Terrain:</span> {(selectedItem as MapItem).terrain}</p>}
                        {(selectedItem as MapItem).maxPlayers !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Max Players:</span> {(selectedItem as MapItem).maxPlayers}</p>}
                      </>
                    )}

                    {selectedItem.type === 'Vehicle' && (
                      <>
                        {(selectedItem as VehicleItem).seats !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Seats:</span> {(selectedItem as VehicleItem).seats}</p>}
                        {(selectedItem as VehicleItem).speed && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Speed:</span> {(selectedItem as VehicleItem).speed}</p>}
                        {(selectedItem as VehicleItem).durability !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Durability:</span> {(selectedItem as VehicleItem).durability}</p>}
                        {(selectedItem as VehicleItem).fuelCapacity !== undefined && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Fuel Capacity:</span> {(selectedItem as VehicleItem).fuelCapacity}</p>}
                      </>
                    )}

                    {selectedItem.type === 'Ammo' && (
                      <>
                        {(selectedItem as AmmoItem).caliber && <p className="text-gray-400 text-lg"><span className="font-bold text-white">Caliber:</span> {(selectedItem as AmmoItem).caliber}</p>}
                      </>
                    )}
                  </div>

                  {/* Compatible Lists */}
                  {(selectedItem as WeaponItem).attachments && (selectedItem as WeaponItem).attachments!.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-white text-2xl mb-3 border-b border-gray-700 pb-2">Compatible Attachments:</h3>
                      <div className="flex flex-wrap gap-3">
                        {(selectedItem as WeaponItem).attachments!.map(attach => (
                          <span key={attach} className="bg-gray-700/50 text-gray-300 text-sm font-semibold px-4 py-2 rounded-full border border-gray-600 shadow-md transition-transform duration-200 hover:scale-105">{attach}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedItem as AttachmentItem).compatibleWeapons && (selectedItem as AttachmentItem).compatibleWeapons!.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-white text-2xl mb-3 border-b border-gray-700 pb-2">Compatible Weapons:</h3>
                      <div className="flex flex-wrap gap-3">
                        {(selectedItem as AttachmentItem).compatibleWeapons!.map(weapon => (
                          <span key={weapon} className="bg-gray-700/50 text-gray-300 text-sm font-semibold px-4 py-2 rounded-full border border-gray-600 shadow-md transition-transform duration-200 hover:scale-105">{weapon}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedItem as AmmoItem).compatibleWeapons && (selectedItem as AmmoItem).compatibleWeapons!.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-white text-2xl mb-3 border-b border-gray-700 pb-2">Used By Weapons:</h3>
                      <div className="flex flex-wrap gap-3">
                        {(selectedItem as AmmoItem).compatibleWeapons!.map(weapon => (
                          <span key={weapon} className="bg-gray-700/50 text-gray-300 text-sm font-semibold px-4 py-2 rounded-full border border-gray-600 shadow-md transition-transform duration-200 hover:scale-105">{weapon}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // --- Item List View for Selected Category ---
            <div className="flex flex-col h-full animate-fade-in">
              <h2 className="text-4xl font-extrabold text-white mb-6 capitalize text-center" style={{ textShadow: '0 0 10px rgba(66, 153, 225, 0.5)' }}>
                {selectedCategory === 'All' ? 'All PUBG Items' : `${selectedCategory}s`} <span className="text-blue-400">({filteredItems.length})</span>
              </h2>

              {/* Search Bar for the current category */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder={`Search ${selectedCategory === 'All' ? '' : selectedCategory.toLowerCase()} items...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg shadow-inner shadow-gray-900"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Items Grid - Virtualized with FixedSizeList */}
              <div ref={itemListRef} className="flex-grow overflow-hidden">
                {itemListHeight > 0 && filteredItems.length > 0 ? (
                  <FixedSizeList
                    height={itemListHeight}
                    itemCount={filteredItems.length}
                    itemSize={100} // Approximate height of one item card
                    width="100%"
                    className="custom-scrollbar grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" // Tailwind grid classes here won't directly apply due to FixedSizeList rendering
                  >
                    {PUBGItemRow}
                  </FixedSizeList>
                ) : filteredItems.length === 0 && !isLoading ? (
                  <p className="text-center text-gray-500 py-4 text-xl mt-10">No {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'items'} found matching your search.</p>
                ) : null}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Custom scrollbar styles (reused from CS2) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(66, 153, 225, 0.6); /* Blue for PUBG */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(66, 153, 225, 0.8);
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

export default PUBGPage;