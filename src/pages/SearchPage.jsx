import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import rockImage from "../assets/Rocky the cat.png";
import jsonData from "../assets/data/data.json";
import podcastData from "../assets/data/podcastData.json";

// Utility function to shuffle an array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export default function SearchPage({ setMusicQueue }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    // Update searchParam whenever the URL query changes.
    useEffect(() => {
        const queryString = new URLSearchParams(location.search);
        const query = queryString.get("q") || "";
        setSearchParam(query);
    }, [location.search]);

    // ---------- Base Data ----------
    const baseTopResult = {
        name: "Meow-meow",
        type: "Playlist • Spotify",
        image: rockImage,
    };

    const baseArtists = [{ name: "Rocky the cat", image: rockImage }];
    const baseSongs = [{ name: "I'm cat and you?", image: rockImage }];
    const basePlaylists = [{ name: "Meow-meow", image: rockImage }];

    // ---------- Extract Extra Data from JSON ----------
    const extraArtists = Object.entries(jsonData).map(([artistName, details]) => ({
        name: artistName,
        image: details.image,
    }));

    const extraSongs = [];
    const extraPlaylists = [];
    const extraAlbums = []; // For independent album section
    Object.values(jsonData).forEach((artist) => {
        if (artist.albums) {
            artist.albums.forEach((album) => {
                // Build album object (with artist info)
                extraAlbums.push({
                    artist: artist.name,
                    album: album,
                });
                // Also treat each album as a playlist item.
                extraPlaylists.push({
                    name: album.name,
                    image: album.image,
                });
                if (album.songs) {
                    album.songs.forEach((song) => {
                        extraSongs.push({
                            name: song.name,
                            image: song.image,
                            durationMs: song.durationMs,
                            albumName: album.name, // for navigation reference
                        });
                    });
                }
            });
        }
    });

    // Extract podcasts data from podcastData JSON.
    const extraPodcasts = Object.entries(podcastData).map(
        ([podcastName, details]) => ({
            name: podcastName,
            image: details.image,
            // add other fields as needed
        })
    );

    // ---------- Merge Data (no deduplication for simplicity) ----------
    const artists = [...baseArtists, ...extraArtists];
    const songs = [...baseSongs, ...extraSongs];
    const playlists = [...basePlaylists, ...extraPlaylists];
    const albums = extraAlbums;
    const podcasts = extraPodcasts;

    // ---------- Filtering: Only show items that match the search query ----------
    const lowerSearch = searchParam.trim().toLowerCase();
    const filteredArtists = lowerSearch
        ? artists.filter((item) =>
            item.name.toLowerCase().includes(lowerSearch)
        )
        : shuffleArray(artists);
    const filteredSongs = lowerSearch
        ? songs.filter((item) => item.name.toLowerCase().includes(lowerSearch))
        : shuffleArray(songs);
    const filteredPlaylists = lowerSearch
        ? playlists.filter((item) =>
            item.name.toLowerCase().includes(lowerSearch)
        )
        : shuffleArray(playlists);
    const filteredAlbums = lowerSearch
        ? albums.filter((item) =>
            item.album.name.toLowerCase().includes(lowerSearch)
        )
        : shuffleArray(albums);
    const filteredPodcasts = lowerSearch
        ? podcasts.filter((item) =>
            item.name.toLowerCase().includes(lowerSearch)
        )
        : shuffleArray(podcasts);

    // ---------- Determine available categories based on filtered data ----------
    const availableCategories = ["All"].concat(
        [
            { name: "Songs", data: filteredSongs },
            { name: "Playlists", data: filteredPlaylists },
            { name: "Artists", data: filteredArtists },
            { name: "Albums", data: filteredAlbums },
            { name: "Podcasts", data: filteredPodcasts },
        ].filter((cat) => cat.data.length > 0).map((cat) => cat.name)
    );

    // Update activeCategory if the current one is no longer available.
    useEffect(() => {
        if (activeCategory !== "All" && !availableCategories.includes(activeCategory)) {
            setActiveCategory("All");
        }
    }, [availableCategories, activeCategory]);

    // ---------- Category Tabs ----------
    const handleTagClick = (category) => setActiveCategory(category);

    // ---------- Navigation Handlers ----------
    const handleArtistClick = (artist) => {
        navigate(`/artist?name=${encodeURIComponent(artist.name)}`);
    };

    const handleSongClick = (song) => {
        setMusicQueue({ album: { songs: [song] } });
    };

    const handlePlaylistClick = (pl) => {
        navigate(`/playlist?name=${encodeURIComponent(pl.name)}`);
    };

    const handleAlbumClick = (name, type) => {
        navigate(`/album?name=${encodeURIComponent(name)}&type=${type}`);
    };

    return (
        <div className="bg-[#212121] p-6 space-y-6 text-white min-h-screen">
            <h1 className="text-2xl font-bold">
                Search results for "{searchParam}"
            </h1>

            {/* Category Buttons - only render if there is at least one item */}
            <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => (
                    <button
                        key={category}
                        className={`px-4 py-1 rounded-full text-sm ${
                            activeCategory === category
                                ? "bg-green-500"
                                : "bg-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={() => handleTagClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* =================================== ALL PAGE =================================== */}
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
                    {filteredArtists.length > 0 && (
                        <div>
                            <h2 className="font-semibold text-xl mb-2 mt-6">Artists</h2>
                            <div className="grid grid-cols-6 gap-8">
                                {filteredArtists.map((artist, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center cursor-pointer"
                                        onClick={() => handleArtistClick(artist)}
                                    >
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
                    )}

                    {/* Songs */}
                    {filteredSongs.length > 0 && (
                        <div>
                            <h2 className="font-semibold text-xl mb-2 mt-6">Songs</h2>
                            <div className="grid grid-cols-6 gap-4">
                                {filteredSongs.map((song, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                        onClick={() => handleSongClick(song)}
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

                    {/* Playlists */}
                    {filteredPlaylists.length > 0 && (
                        <div>
                            <h2 className="font-semibold text-xl mb-2 mt-6">Playlists</h2>
                            <div className="grid grid-cols-6 gap-4">
                                {filteredPlaylists.map((pl, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                        onClick={() => handlePlaylistClick(pl)}
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

                    {/* Albums */}
                    {filteredAlbums.length > 0 && (
                        <div>
                            <h2 className="font-semibold text-xl mb-2 mt-6">Albums</h2>
                            <div className="grid grid-cols-6 gap-4">
                                {filteredAlbums.map((album, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                        onClick={() =>
                                            handleAlbumClick(album.album.name, "Album")
                                        }
                                    >
                                        <img
                                            src={album.album.image}
                                            alt="Album Cover"
                                            className="w-24 h-24 object-cover rounded mb-2"
                                        />
                                        <p className="text-xs font-semibold">{album.album.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Podcasts */}
                    {filteredPodcasts.length > 0 && (
                        <div>
                            <h2 className="font-semibold text-xl mb-2 mt-6">Podcasts</h2>
                            <div className="grid grid-cols-6 gap-4">
                                {filteredPodcasts.map((podcast, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                        onClick={() => handleAlbumClick(podcast.name, "Podcast")}
                                    >
                                        <img
                                            src={podcast.image}
                                            alt="Podcast Cover"
                                            className="w-24 h-24 object-cover rounded mb-2"
                                        />
                                        <p className="text-xs font-semibold">{podcast.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* =================================== CATEGORY PAGES =================================== */}
            {activeCategory === "Songs" && filteredSongs.length > 0 && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Songs</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {filteredSongs.map((song, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleSongClick(song)}
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

            {activeCategory === "Playlists" && filteredPlaylists.length > 0 && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Playlists</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {filteredPlaylists.map((pl, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handlePlaylistClick(pl)}
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

            {activeCategory === "Artists" && filteredArtists.length > 0 && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Artists</h2>
                    <div className="grid grid-cols-6 gap-8">
                        {filteredArtists.map((artist, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => handleArtistClick(artist)}
                            >
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
            )}

            {activeCategory === "Albums" && filteredAlbums.length > 0 && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Albums</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {filteredAlbums.map((album, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(album.album.name, "Album")}
                            >
                                <img
                                    src={album.album.image}
                                    alt="Album Cover"
                                    className="w-24 h-24 object-cover rounded mb-2"
                                />
                                <p className="text-xs font-semibold">{album.album.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeCategory === "Podcasts" && filteredPodcasts.length > 0 && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Podcasts</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {filteredPodcasts.map((podcast, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(podcast.name, "Podcast")}
                            >
                                <img
                                    src={podcast.image}
                                    alt="Podcast Cover"
                                    className="w-24 h-24 object-cover rounded mb-2"
                                />
                                <p className="text-xs font-semibold">{podcast.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
