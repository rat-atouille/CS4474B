import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import rockImage from "../assets/Rock.png";

export default function SearchPage() {
    const location = useLocation();
    const [searchParam, setSearchParam] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const queryString = new URLSearchParams(location.search);
        const query = queryString.get("q") || "";
        setSearchParam(query);
    }, [location.search]);

    // 3) Some sample data
    const topResult = {
        name: "Rock",
        type: "Playlist • Spotify",
        image: rockImage,
    };

    const artists = [
        { name: "Artist 1" },
        { name: "Artist 2" },
        { name: "Artist 3" },
    ];

    const songs = [
        { name: "Rock", image: rockImage },
        { name: "Rock", image: rockImage },
        { name: "Rock", image: rockImage },
        { name: "Rock", image: rockImage },
        { name: "Rock", image: rockImage },
        { name: "Rock", image: rockImage },
    ];

    const playlists = [
        { name: "Rock", image: rockImage },
        { name: "Rock", image: rockImage },
        { name: "Rock", image: rockImage },
        { name: "Rock", image: rockImage },
    ];

    const categories = ["Songs", "Playlists", "Artists", "Podcasts", "Audiobooks"];

    const handleTagClick = (category) => {
        navigate(`/search/${category.toLowerCase()}`);
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
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm hover:bg-gray-600"
                        onClick={() => handleTagClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Top Result */}
            <div className="mt-4">
                <h2 className="font-semibold text-xl mb-2">Top Result</h2>
                <div className="flex items-center space-x-4">
                    {/* Cover Image */}
                    <img
                        src={topResult.image}
                        alt="Top Result"
                        className="w-32 h-32 object-cover rounded"
                    />
                    {/* Title / Type */}
                    <div>
                        <h3 className="text-lg font-bold">{topResult.name}</h3>
                        <p className="text-gray-300 text-sm">{topResult.type}</p>
                    </div>
                </div>
            </div>

            {/* Artists Section */}
            <div className="mt-4">
                <h2 className="font-semibold text-xl mb-2">Artists</h2>
                <div className="grid grid-cols-5 gap-4">
                    {artists.map((artist, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {/* Circular placeholder */}
                            <div className="w-24 h-24 rounded-full bg-gray-500 mb-2"></div>
                            <p className="text-sm font-medium">{artist.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Songs Section */}
            <div className="mt-4">
                <h2 className="font-semibold text-xl mb-2">Songs</h2>
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

            {/* Playlists Section */}
            <div className="mt-4">
                <h2 className="font-semibold text-xl mb-2">Playlists</h2>
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
        </div>
    );
}
