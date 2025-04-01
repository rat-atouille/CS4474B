import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import rockImage from "../assets/Rocky the cat.png";
import jsonData from "../assets/data/data.json";

export default function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    // Helper to remove duplicates by *name* only
    function deduplicateByName(items) {
        const seen = new Set();
        return items.filter((item) => {
            // Use name in lowercase as the key to identify duplicates
            const key = item.name.toLowerCase();
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    useEffect(() => {
        const queryString = new URLSearchParams(location.search);
        const query = queryString.get("q") || "";
        setSearchParam(query);
    }, [location.search]);

    // Base single items
    const baseTopResult = {
        name: "Meow-meow",
        type: "Playlist • Spotify",
        image: rockImage,
    };

    // Base arrays
    const baseArtists = [
        { name: "Rocky the cat", image: rockImage },
    ];

    const baseSongs = [
        { name: "I'm cat and you?", image: rockImage },
    ];

    const basePlaylists = [
        { name: "Meow-meow", image: rockImage },
    ];

    // ---------- Merge Extra Data from JSON ----------
    // The JSON structure is an object keyed by artist name.
    // We'll extract extra artists, songs, and playlists.
    const extraArtists = Object.entries(jsonData).map(([artistName, details]) => ({
        name: artistName,
        image: details.image,
    }));

    const extraSongs = [];
    const extraPlaylists = [];
    Object.values(jsonData).forEach((artist) => {
        if (artist.albums) {
            artist.albums.forEach((album) => {
                // Each album is effectively a 'playlist' item
                extraPlaylists.push({
                    name: album.name,
                    image: album.image,
                });
                if (album.songs) {
                    album.songs.forEach((song) => {
                        extraSongs.push({
                            name: song.name,
                            image: song.image,
                        });
                    });
                }
            });
        }
    });

    // Merge base + extra, then deduplicate by name
    const artists = deduplicateByName([...baseArtists, ...extraArtists]);
    const songs = deduplicateByName([...baseSongs, ...extraSongs]);
    const playlists = deduplicateByName([...basePlaylists, ...extraPlaylists]);

    // Category tabs
    const categories = ["All", "Songs", "Playlists", "Artists", "Podcasts", "Audiobooks"];

    const handleTagClick = (category) => {
        setActiveCategory(category);
    };

    return (
        <div className="bg-[#212121] p-6 space-y-6 text-white min-h-screen">
            <h1 className="text-2xl font-bold">
                Search results for "{searchParam}"
            </h1>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`px-4 py-1 rounded-full text-sm ${
                            activeCategory === category ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={() => handleTagClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* ALL PAGE */}
            {activeCategory === "All" && (
                <>
                    {/* Top Result */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-xl mb-2">Top Result</h2>
                        <div className="flex items-center space-x-4">
                            <img
                                src={baseTopResult.image}
                                alt="Top Result"
                                className="w-32 h-32 object-cover rounded"
                            />
                            <div>
                                <h3 className="text-lg font-bold">{baseTopResult.name}</h3>
                                <p className="text-gray-300 text-sm">{baseTopResult.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Artists */}
                    <div>
                        <h2 className="font-semibold text-xl mb-2 mt-6">Artists</h2>
                        <div className="grid grid-cols-6 gap-8">
                            {artists.map((artist, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-24 h-24 object-cover rounded-full mb-2"
                                    />
                                    <p className="text-sm font-medium">{artist.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Songs */}
                    <div>
                        <h2 className="font-semibold text-xl mb-2 mt-6">Songs</h2>
                        <div className="grid grid-cols-6 gap-4">
                            {songs.map((song, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center"
                                >
                                    <img
                                        src={song.image}
                                        alt="Song Cover"
                                        className="w-24 h-24 object-cover rounded mb-2"
                                    />
                                    <p className="text-xs font-semibold">{song.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Playlists */}
                    <div>
                        <h2 className="font-semibold text-xl mb-2 mt-6">Playlists</h2>
                        <div className="grid grid-cols-6 gap-4">
                            {playlists.map((pl, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center"
                                >
                                    <img
                                        src={pl.image}
                                        alt="Playlist Cover"
                                        className="w-24 h-24 object-cover rounded mb-2"
                                    />
                                    <p className="text-xs font-semibold">{pl.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* SONGS PAGE */}
            {activeCategory === "Songs" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Songs Page</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {songs.map((song, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center"
                            >
                                <img
                                    src={song.image}
                                    alt="Song Cover"
                                    className="w-24 h-24 object-cover rounded mb-2"
                                />
                                <p className="text-xs font-semibold">{song.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PLAYLISTS PAGE */}
            {activeCategory === "Playlists" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Playlists Page</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {playlists.map((pl, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center"
                            >
                                <img
                                    src={pl.image}
                                    alt="Playlist Cover"
                                    className="w-24 h-24 object-cover rounded mb-2"
                                />
                                <p className="text-xs font-semibold">{pl.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ARTISTS PAGE */}
            {activeCategory === "Artists" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Artists Page</h2>
                    <div className="grid grid-cols-6 gap-8">
                        {artists.map((artist, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <img
                                    src={artist.image}
                                    alt="Artist"
                                    className="w-24 h-24 object-cover rounded-full mb-2"
                                />
                                <p className="text-sm font-medium">{artist.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PODCASTS PAGE */}
            {activeCategory === "Podcasts" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Podcasts</h2>
                    <p className="text-sm text-gray-400">No sample data for podcasts yet.</p>
                </div>
            )}

            {/* AUDIOBOOKS PAGE */}
            {activeCategory === "Audiobooks" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Audiobooks</h2>
                    <p className="text-sm text-gray-400">No sample data for audiobooks yet.</p>
                </div>
            )}
        </div>
    );
}
