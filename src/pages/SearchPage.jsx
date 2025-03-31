// SearchPage.jsx
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import rockImage from "../assets/rock.png";

export default function SearchPage() {
    const location = useLocation();

    const [searchParam, setSearchParam] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const queryString = new URLSearchParams(location.search);
        const query = queryString.get("q") || "";
        setSearchParam(query);
    }, [location.search]);

    // =========== Sample data ===========
    const topResult = {
        name: "Rock",
        type: "Playlist • Spotify",
        image: rockImage,
    };

    // Artists (with rockImage + circle)
    const artists = [
        { name: "Artist A", image: rockImage },
        { name: "Artist B", image: rockImage },
        { name: "Artist C", image: rockImage },
        { name: "Artist D", image: rockImage },
        { name: "Artist E", image: rockImage },
        { name: "Artist F", image: rockImage },
    ];

    // Songs (use rock.png as the cover)
    const songs = [
        { name: "Rock Song 1", image: rockImage },
        { name: "Rock Song 2", image: rockImage },
        { name: "Rock Song 3", image: rockImage },
        { name: "Rock Song 4", image: rockImage },
        { name: "Rock Song 5", image: rockImage },
        { name: "Rock Song 6", image: rockImage },
    ];

    // Playlists (also using rockImage)
    const playlists = [
        { name: "Rocklist 1", image: rockImage },
        { name: "Rocklist 2", image: rockImage },
        { name: "Rocklist 3", image: rockImage },
        { name: "Rocklist 4", image: rockImage },
        { name: "Rocklist 5", image: rockImage },
        { name: "Rocklist 6", image: rockImage },
    ];

    // The category tabs (All, Songs, etc.)
    const categories = ["All", "Songs", "Playlists", "Artists", "Podcasts", "Audiobooks"];

    // Switch page when user clicks a category tab
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
                        className={`px-4 py-1 rounded-full text-sm
              ${activeCategory === category ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"}
            `}
                        onClick={() => handleTagClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* =================================== ALL PAGE (shows Top Result, Artists, Songs, Playlists) =================================== */}
            {activeCategory === "All" && (
                <>
                    {/* Top Result (ONLY for All) */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-xl mb-2">Top Result</h2>
                        <div className="flex items-center space-x-4">
                            <img
                                src={topResult.image}
                                alt="Top Result"
                                className="w-32 h-32 object-cover rounded"
                            />
                            <div>
                                <h3 className="text-lg font-bold">{topResult.name}</h3>
                                <p className="text-gray-300 text-sm">{topResult.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Artists */}
                    <div>
                        <h2 className="font-semibold text-xl mb-2 mt-6">Artists</h2>
                        <div className="grid grid-cols-6 gap-4">
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

            {/* =================================== SONGS PAGE =================================== */}
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

            {/* =================================== PLAYLISTS PAGE (NO top result) =================================== */}
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

            {/* =================================== ARTISTS PAGE (circle images) =================================== */}
            {activeCategory === "Artists" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Artists Page</h2>
                    <div className="grid grid-cols-6 gap-4">
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

            {/* =================================== PODCASTS PAGE =================================== */}
            {activeCategory === "Podcasts" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Podcasts</h2>
                    <p className="text-sm text-gray-400">No sample data for podcasts yet.</p>
                </div>
            )}

            {/* =================================== AUDIOBOOKS PAGE =================================== */}
            {activeCategory === "Audiobooks" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Audiobooks</h2>
                    <p className="text-sm text-gray-400">No sample data for audiobooks yet.</p>
                </div>
            )}
        </div>
    );
}
