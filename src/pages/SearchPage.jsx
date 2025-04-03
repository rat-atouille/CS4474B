import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import rockImage from "../assets/Rocky the cat.png";
import getSearchData from "../getSearchData.js"; // Import your function

export default function SearchPage({ setMusicQueue }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const queryString = new URLSearchParams(location.search);
        const query = queryString.get("q") || "";
        setSearchParam(query);
    }, [location.search]);

    // ---------- Fetch Data Using getSearchResults ----------
    const songs = getSearchData("songs");
    const playlists = getSearchData("playlists");
    const albums = getSearchData("albums");
    const podcasts = getSearchData("podcasts");
    const artists = [{ name: "Rocky the cat", image: rockImage }, ...getSearchData("artists")];

    // ---------- Category Tabs ----------
    const categories = ["All", "Songs", "Playlists", "Artists", "Albums", "Podcasts"];
    const handleTagClick = (category) => setActiveCategory(category);

    // ---------- Navigation Handlers ----------
    const handlePlay = (type, name) => {
        if (typeof setMusicQueue === 'function') {
          if (type === "Album") {
            setMusicQueue(getStructuredData("album", name, 0));
          } else if (type === "Artist") {
            setMusicQueue(getStructuredData("playlist-artist", name, 0));
          } else if (type === "Playlist") {
            setMusicQueue(getStructuredData("playlist", name, 0));
          } else {
            setMusicQueue(getStructuredData("podcast", name, 0));
          }
        } else {
          console.error('setMusicQueue is not a function');
        }
      };
    
      const handleAlbumClick = (name, type) => {
        if (type === "Artist") {
          navigate(`/artist/?name=${name}&type=${type}`);
        } else if (type === "Podcast") {
          navigate(`/podcast/?name=${name}`);
        } else {
          navigate(`/album/?name=${name}&type=${type}`);
        }
      }

    return (
        <div className="bg-[#212121] p-6 space-y-6 text-white min-h-screen">
            <h1 className="text-2xl font-bold">Search results for "{searchParam}"</h1>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
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
                    {/* Artists */}
                    <h2 className="font-semibold text-xl mb-2 mt-6">Artists</h2>
                    <div className="grid grid-cols-6 gap-8">
                        {artists.map((artist, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(artist.name, "Artist")}
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

                    {/* Songs */}
                    <h2 className="font-semibold text-xl mb-2 mt-6">Songs</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {songs.map((song, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(song.albumName, "Album")}
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

                    {/* Playlists */}
                    <h2 className="font-semibold text-xl mb-2 mt-6">Playlists</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {playlists.map((pl, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(pl.name, "Playlist")}
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

                    {/* Albums */}
                    <h2 className="font-semibold text-xl mb-2 mt-6">Albums</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {albums.map((album, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(album.name, "Album")}
                            >
                                <img
                                    src={album.image}
                                    alt="Album Cover"
                                    className="w-24 h-24 object-cover rounded mb-2"
                                />
                                <p className="text-xs font-semibold">{album.name}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* =================================== CATEGORY PAGES =================================== */}
            {activeCategory === "Songs" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Songs</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {songs.map((song, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(song.albumName, "Album")}
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

            {activeCategory === "Playlists" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Playlists</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {playlists.map((pl, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(pl.name, "Playlist")}
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

            {activeCategory === "Artists" && (
                    <div>
                        <h2 className="font-semibold text-xl mb-2 mt-6">Artists</h2>
                        <div className="grid grid-cols-6 gap-4">
                            {artists.map((artist, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center cursor-pointer"
                                    onClick={() => handleAlbumClick(artist.name, "Artist")}
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

            {activeCategory === "Albums" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Albums</h2>
                    <div className="grid grid-cols-6 gap-4">
                        {albums.map((album, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                                onClick={() => handleAlbumClick(album.name, "Album")}
                            >
                                <img
                                    src={album.image}
                                    alt="Album Cover"
                                    className="w-24 h-24 object-cover rounded mb-2"
                                />
                                <p className="text-xs font-semibold">{album.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeCategory === "Podcasts" && (
                <div>
                     <h2 className="font-semibold text-xl mb-2 mt-6">Albums</h2>
                     <div className="grid grid-cols-6 gap-4">
                    {podcasts.map((podcast, index) => (
                        <div
                            key={index}
                            className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex flex-col items-center cursor-pointer"
                            onClick={() => handleAlbumClick(podcast.name, "Podcast")}
                        >
                            <img
                                src={podcast.image}
                                alt="Album Cover"
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