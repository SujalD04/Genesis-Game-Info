import React, { useState, useEffect, useMemo } from 'react';

// --- Prop Types ---
type Props = {};

// --- Helper Components ---

// Simple loading spinner
const Spinner = () => (
    <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
);

// Stat bar component for visualizing champion stats
const StatBar = ({ label, value, max, colorClass }: { label: string; value: number; max: number; colorClass: string }) => (
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

// --- Main 'lol' Component ---

const Lol = (props: Props) => {
    // --- State Management ---
    interface Champion {
        id: string;
        name: string;
        title: string;
        blurb: string;
        tags: string[];
        stats: {
            hp: number;
            mp: number;
            armor: number;
            spellblock: number;
            attackdamage: number;
            attackspeed: number;
            crit: number;
            movespeed: number;
        };
        image: {
            full: string;
        };
    }

    const [champions, setChampions] = useState<Champion[]>([]);
    const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [version, setVersion] = useState('13.1.1'); // Keep track of the data version

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchChampions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // First, get the latest version info
                const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
                if (!versionRes.ok) throw new Error('Could not fetch LoL versions.');
                const versions = await versionRes.json();
                const latestVersion = versions[0];
                setVersion(latestVersion);

                // Then, fetch champion data for the latest version
                const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
                if (!res.ok) throw new Error('Could not fetch champion data.');
                const json = await res.json();
                
                // Convert the champion data object into a sorted array
                const championArray = Object.values(json.data) as Champion[];
                championArray.sort((a, b) => a.name.localeCompare(b.name));
                setChampions(championArray);

                // Set the first champion in the list as the default selected one
                if (championArray.length > 0) {
                    setSelectedChampion(championArray[0]);
                }

            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchChampions();
    }, []); // Empty dependency array means this runs once on mount

    // --- Memoized Filtering ---
    const filteredChampions = useMemo(() => {
        return champions.filter(champion =>
            champion.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [champions, searchQuery]);
    
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

    const splashUrl = selectedChampion 
        ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${selectedChampion.id}_0.jpg` 
        : 'https://placehold.co/1280x720/0a101f/1e293b?text=Select+a+Champion';

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-gray-200">
            <div className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out">
                <div 
                    key={selectedChampion ? selectedChampion.id : 'none'}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 animate-fade-in"
                    style={{ backgroundImage: `url(${splashUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
            </div>

            <main className="relative z-10 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 h-screen">
                
                {/* --- Champion List and Search (Left Panel) --- */}
                <aside className="lg:col-span-1 xl:col-span-1 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 flex flex-col h-full overflow-hidden border border-blue-500/20">
                    <h2 className="text-2xl font-bold text-white mb-4">Champions</h2>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search Champion..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="flex-grow overflow-y-auto pr-2">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {filteredChampions.map(champion => (
                                <button
                                    key={champion.id}
                                    onClick={() => setSelectedChampion(champion)}
                                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 ${selectedChampion?.id === champion.id ? 'ring-4 ring-blue-500' : 'ring-2 ring-transparent'}`}
                                    title={champion.name}
                                >
                                    <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`}
                                        alt={champion.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <p className="absolute bottom-1 left-0 right-0 text-center text-xs font-semibold text-white truncate px-1">
                                        {champion.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* --- Champion Details (Right Panel) --- */}
                <section className="lg:col-span-2 xl:col-span-3 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 md:p-8 flex flex-col h-full overflow-y-auto border border-blue-500/20">
                    {selectedChampion ? (
                        <div key={selectedChampion.id} className="animate-fade-in-up">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>{selectedChampion.name}</h1>
                                <p className="text-xl md:text-2xl font-light text-blue-300 capitalize">{selectedChampion.title}</p>
                            </div>

                            {/* Lore and Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="md:col-span-2">
                                    <p className="text-gray-300 leading-relaxed">{selectedChampion.blurb}</p>
                                </div>
                                <div className="flex flex-col items-start md:items-end space-y-2">
                                    <h3 className="font-bold text-white mb-1">Roles</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedChampion.tags.map(tag => (
                                            <span key={tag} className="bg-blue-500/20 text-blue-300 text-sm font-semibold px-3 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats */}
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4 border-b-2 border-blue-500/30 pb-2">Base Stats</h3>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                                    <StatBar label="HP" value={selectedChampion.stats.hp} max={1200} colorClass="bg-green-500" />
                                    <StatBar label="Mana" value={selectedChampion.stats.mp} max={1000} colorClass="bg-blue-500" />
                                    <StatBar label="Armor" value={selectedChampion.stats.armor} max={150} colorClass="bg-yellow-500" />
                                    <StatBar label="Magic Resist" value={selectedChampion.stats.spellblock} max={100} colorClass="bg-purple-500" />
                                    <StatBar label="Attack Damage" value={selectedChampion.stats.attackdamage} max={150} colorClass="bg-red-500" />
                                    <StatBar label="Attack Speed" value={selectedChampion.stats.attackspeed} max={1.5} colorClass="bg-orange-500" />
                                    <StatBar label="Crit" value={selectedChampion.stats.crit} max={100} colorClass="bg-pink-500" />
                                    <StatBar label="Move Speed" value={selectedChampion.stats.movespeed} max={400} colorClass="bg-teal-500" />
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center justify-center h-full">
                            <p className="text-2xl text-gray-500">Select a champion to view details</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Lol;
