import React, { useState, useEffect } from 'react';

// --- Type Definitions ---
interface Banner {
  id: string;
  name: string;
  description: string;
  category: string;
  images: {
    smallIcon: string;
    icon: string;
  };
}

interface Cosmetic {
  id: string;
  name: string;
  description: string | null;
  type: {
    value: string;
    displayValue: string | null;
    backendValue: string;
  };
  rarity: {
    value: string;
    displayValue: string;
    backendValue: string;
  };
  images: {
    smallIcon?: string;
    icon?: string;
    featured?: string;
  };
}

interface ShopEntry {
  regularPrice: number;
  finalPrice: number;
  offerId: string;
  layout: {
    name: string;
  };
  tileSize: string;
  brItems: Cosmetic[];
}

interface ShopData {
  entries: ShopEntry[];
}

interface POI {
  id: string;
  name: string;
}

interface MapData {
  images: {
    pois: string;
  };
  pois: POI[];
}

// --- API Endpoints ---
const FORTNITE_API_BASE = 'https://fortnite-api.com';
const API_ENDPOINTS = {
  banners: `${FORTNITE_API_BASE}/v1/banners`,
  cosmetics: `${FORTNITE_API_BASE}/v2/cosmetics`,
  map: `${FORTNITE_API_BASE}/v1/map`,
  shop: `${FORTNITE_API_BASE}/v2/shop`,
};

// --- Helper Components ---
const Spinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

// --- Main Component ---
const Fortnite = () => {
  // --- State Management ---
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [activeTab, setActiveTab] = useState<'shop' | 'map' | 'cosmetics' | 'banners'>('shop');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const NO_IMAGE_PLACEHOLDER = 'https://placehold.co/200x200/1e293b/64748b?text=No+Image';

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchFortniteData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [bannersRes, cosmeticsRes, mapRes, shopRes] = await Promise.all([
          fetch(API_ENDPOINTS.banners),
          fetch(API_ENDPOINTS.cosmetics),
          fetch(API_ENDPOINTS.map),
          fetch(API_ENDPOINTS.shop),
        ]);

        if (!bannersRes.ok || !cosmeticsRes.ok || !mapRes.ok || !shopRes.ok) {
          throw new Error('Failed to fetch data from Fortnite API');
        }

        const [bannersJson, cosmeticsJson, mapJson, shopJson] = await Promise.all([
          bannersRes.json(),
          cosmeticsRes.json(),
          mapRes.json(),
          shopRes.json(),
        ]);

        if (bannersJson.status === 200 && Array.isArray(bannersJson.data)) {
          setBanners(bannersJson.data.slice(0, 50));
        }

        if (cosmeticsJson.status === 200 && cosmeticsJson.data?.br) {
          setCosmetics(cosmeticsJson.data.br.slice(0, 50));
        }

        if (mapJson.status === 200 && mapJson.data) {
          setMapData(mapJson.data);
        }

        if (shopJson.status === 200 && shopJson.data?.entries) {
          setShopData(shopJson.data);
        }

      } catch (err) {
        console.error('Failed to fetch Fortnite data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFortniteData();
  }, []);

  // Helper function to categorize shop items
  const getCategorizedShopItems = () => {
    if (!shopData) return { featured: [], daily: [] };
    
    const featured: ShopEntry[] = [];
    const daily: ShopEntry[] = [];

    shopData.entries.forEach(entry => {
      const isDaily = entry.layout.name?.includes("Daily") || entry.tileSize === "Size_1_x_1";
      const isFeatured = entry.layout.name?.includes("Featured") || entry.tileSize === "Size_1_x_2" || entry.tileSize === "Size_2_x_2";

      if (isDaily && !isFeatured) {
        daily.push(entry);
      } else {
        featured.push(entry);
      }
    });

    return { featured, daily };
  };

  const { featured, daily } = getCategorizedShopItems();

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

  // Background image logic
  const getBackgroundImage = () => {
    if (activeTab === 'map' && mapData) {
      return mapData.images.pois;
    }
    if (activeTab === 'shop' && featured.length > 0 && featured[0].brItems?.[0]?.images?.featured) {
      return featured[0].brItems[0].images.featured;
    }
    return 'https://placehold.co/1920x1080/0a101f/1e293b?text=Fortnite';
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200">
      <div className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${getBackgroundImage()})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 h-screen">
        
        {/* --- Navigation Menu (Left Panel) --- */}
        <aside className="lg:col-span-1 xl:col-span-1 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 flex flex-col h-full overflow-hidden border border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Fortnite Data</h2>
          
          <nav className="space-y-3">
            <button
              onClick={() => setActiveTab('shop')}
              className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                activeTab === 'shop' 
                  ? 'bg-blue-500/20 text-blue-300 ring-2 ring-blue-500' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="font-semibold">Item Shop</div>
              <div className="text-sm opacity-75">Today's featured items</div>
            </button>
            
            <button
              onClick={() => setActiveTab('map')}
              className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                activeTab === 'map' 
                  ? 'bg-blue-500/20 text-blue-300 ring-2 ring-blue-500' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="font-semibold">Current Map</div>
              <div className="text-sm opacity-75">Points of interest</div>
            </button>
            
            <button
              onClick={() => setActiveTab('cosmetics')}
              className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                activeTab === 'cosmetics' 
                  ? 'bg-blue-500/20 text-blue-300 ring-2 ring-blue-500' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="font-semibold">Cosmetics</div>
              <div className="text-sm opacity-75">Latest items</div>
            </button>
            
            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                activeTab === 'banners' 
                  ? 'bg-blue-500/20 text-blue-300 ring-2 ring-blue-500' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="font-semibold">Banners</div>
              <div className="text-sm opacity-75">Available banners</div>
            </button>
          </nav>
        </aside>

        {/* --- Content Area (Right Panel) --- */}
        <section className="lg:col-span-2 xl:col-span-3 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 md:p-8 flex flex-col h-full overflow-y-auto border border-blue-500/20">
          
          {activeTab === 'shop' && (
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white mb-2" 
                  style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
                Item Shop
              </h1>
              <p className="text-xl md:text-2xl font-light text-blue-300 mb-8">Today's Featured Items</p>
              
              {featured.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-blue-500/30 pb-2">Featured</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {featured.slice(0, 8).map((item, index) => (
                      <div key={item.offerId || index} 
                           className="bg-gray-800/50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-900/30 hover:scale-105">
                        <img
                          src={item.brItems?.[0]?.images?.icon || NO_IMAGE_PLACEHOLDER}
                          alt={item.brItems?.[0]?.name || 'Shop Item'}
                          className="w-full h-32 object-contain rounded-md bg-gray-700 mb-3"
                          onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
                        />
                        <p className="font-bold text-white text-sm">{item.brItems?.[0]?.name || 'Unknown Item'}</p>
                        <p className="text-green-300 text-sm">{item.finalPrice} V-Bucks</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {daily.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-blue-500/30 pb-2">Daily</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {daily.slice(0, 8).map((item, index) => (
                      <div key={item.offerId || index} 
                           className="bg-gray-800/50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-900/30 hover:scale-105">
                        <img
                          src={item.brItems?.[0]?.images?.icon || NO_IMAGE_PLACEHOLDER}
                          alt={item.brItems?.[0]?.name || 'Shop Item'}
                          className="w-full h-32 object-contain rounded-md bg-gray-700 mb-3"
                          onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
                        />
                        <p className="font-bold text-white text-sm">{item.brItems?.[0]?.name || 'Unknown Item'}</p>
                        <p className="text-green-300 text-sm">{item.finalPrice} V-Bucks</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'map' && mapData && (
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white mb-2" 
                  style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
                Current Map
              </h1>
              <p className="text-xl md:text-2xl font-light text-blue-300 mb-8">Points of Interest</p>
              
              <div className="text-center mb-6">
                <img
                  src={mapData.images.pois}
                  alt="Fortnite Map"
                  className="max-w-full h-auto rounded-lg shadow-xl border border-gray-700 mx-auto"
                  onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
                />
              </div>
              
              {mapData.pois.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-blue-500/30 pb-2">
                    Key Locations ({mapData.pois.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                    {mapData.pois.slice(0, 40).map((poi) => (
                      <div key={poi.id} className="bg-gray-800/50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-200">{poi.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cosmetics' && (
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white mb-2" 
                  style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
                Cosmetics
              </h1>
              <p className="text-xl md:text-2xl font-light text-blue-300 mb-8">Latest Items ({cosmetics.length})</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {cosmetics.map((cosmetic) => (
                  <div key={cosmetic.id} 
                       className="bg-gray-800/50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-900/30 hover:scale-105">
                    <img
                      src={cosmetic.images.smallIcon || cosmetic.images.icon || NO_IMAGE_PLACEHOLDER}
                      alt={cosmetic.name}
                      className="w-full h-32 object-contain rounded-md bg-gray-700 mb-3"
                      onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
                    />
                    <p className="font-bold text-white text-sm">{cosmetic.name}</p>
                    {cosmetic.rarity?.displayValue && (
                      <p className={`text-xs ${
                        cosmetic.rarity.value === 'legendary' ? 'text-orange-400' :
                        cosmetic.rarity.value === 'epic' ? 'text-purple-400' :
                        cosmetic.rarity.value === 'rare' ? 'text-blue-400' :
                        'text-gray-400'
                      }`}>
                        {cosmetic.rarity.displayValue}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white mb-2" 
                  style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
                Banners
              </h1>
              <p className="text-xl md:text-2xl font-light text-blue-300 mb-8">Available Banners ({banners.length})</p>
              
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} 
                       className="bg-gray-800/50 p-3 rounded-lg transition-all duration-300 hover:bg-blue-900/30 hover:scale-105 text-center">
                    <img
                      src={banner.images.icon || banner.images.smallIcon || NO_IMAGE_PLACEHOLDER}
                      alt={banner.name}
                      className="w-full h-16 object-contain rounded-md bg-gray-700 mb-2"
                      onError={(e) => { e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
                    />
                    <p className="font-bold text-white text-xs">{banner.name}</p>
                    <p className="text-xs text-gray-400">{banner.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Fortnite;