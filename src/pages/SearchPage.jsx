import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import rockImage from "../assets/Rocky the cat.png";
import getSearchData from "../getSearchData.js"; // Import your function
import getStructuredData from "../getStructuredData.js";

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
    const handlePlay = (type, name, index) => {
        if (typeof setMusicQueue === 'function') {
          if (type === "Album") {
            setMusicQueue(getStructuredData("album", name, index));
          } else if (type === "Artist") {
            setMusicQueue(getStructuredData("playlist-artist", name, index));
          } else if (type === "Playlist") {
            setMusicQueue(getStructuredData("playlist", name, index));
          } else {
            setMusicQueue(getStructuredData("podcast", name, index));
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
                        <div className="grid grid-cols-6 gap-4">
                            {artists.map((artist, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center px-2 py-8 cursor-pointer group hover:bg-gray-800 transition-colors"
                                    onClick={() => handleAlbumClick(artist.name, "Artist")}
                                >
                                    <div className="relative w-36 h-36">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover rounded-full mb-2"
                                    />
                                    
                                    <button
                                        className="absolute bottom-0 right-0 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents click from bubbling up
                                            handlePlay("Artist", artist.name, 0);
                                          }}
                                    >
                                        <i className="fa-solid fa-circle-play text-4xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                    </button>
                                    </div>
                                    <p className="mt-2 text-sm font-medium">{artist.name}</p>
                                </div>
                            ))}
                        </div>

                    {/* Songs */}
                    <h2 className="font-semibold text-xl mb-2 mt-6">Songs</h2>
                        <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {songs.map((song, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded hover:bg-gray-700 transition-all group"
                                    onClick={() => handleAlbumClick(song.albumName, "Album")}
                                >
                                    {/* Square Song Cover */}
                                    <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                                        <img
                                            src={song.image}
                                            alt="Song Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button */}
                                        <button
                                            className="absolute bottom-1 right-1 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents click from bubbling up
                                                handlePlay("Album", song.albumName, song.index);
                                              }}
                                        >
                                            <i className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                        </button>
                                    </div>
                                    {/* Song Title */}
                                    <p className="text-white truncate font-semibold">{song.name}</p>
                                    {/* Song Album */}
                                    <p className="text-gray-400 text-sm">{song.albumName}</p>
                                </div>
                            ))}
                        </div>


                    {/* Playlists */}
                    <h2 className="font-semibold text-xl mb-2 mt-6">Playlists</h2>
                        <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {playlists.map((pl, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded hover:bg-gray-700 transition-all group"
                                    onClick={() => handleAlbumClick(pl.name, "Playlist")}
                                >
                                    {/* Square Playlist Cover */}
                                    <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                                        <img
                                            src={pl.image}
                                            alt="Playlist Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button */}
                                        <button
                                            className="absolute bottom-1 right-1 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents click from bubbling up
                                                handlePlay("Playlist", pl.name, 0);
                                              }}
                                        >
                                            <i className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                        </button>
                                    </div>
                                    {/* Playlist Name */}
                                    <p className="text-white truncate font-semibold">{pl.name}</p>
                                </div>
                            ))}
                        </div>


                    {/* Albums */}
                    <h2 className="font-semibold text-xl mb-2 mt-6">Albums</h2>
                        <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {albums.map((album, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded hover:bg-gray-700 transition-all group"
                                    onClick={() => handleAlbumClick(album.name, "Album")}
                                >
                                    {/* Square Album Cover */}
                                    <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                                        <img
                                            src={album.image}
                                            alt="Album Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button */}
                                        <button
                                            className="absolute bottom-1 right-1 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents click from bubbling up
                                                handlePlay("Album", album.name, 0);
                                              }}
                                        >
                                            <i className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                        </button>
                                    </div>
                                    {/* Album Name */}
                                    <p className="text-white truncate font-semibold">{album.name}</p>
                                </div>
                            ))}
                        </div>

                    {/* Podcasts */}
                    <h2 className="font-semibold text-xl mb-2 mt-6">Podcasts</h2>
                        <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {podcasts.map((podcast, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded hover:bg-gray-700 transition-all group"
                                    onClick={() => handleAlbumClick(podcast.name, "Podcast")}
                                >
                                    {/* Square Podcast Cover */}
                                    <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                                        <img
                                            src={podcast.image}
                                            alt="Podcast Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button */}
                                        <button
                                            className="absolute bottom-1 right-1 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents click from bubbling up
                                                handlePlay("Podcast", podcast.name, 0);
                                              }}
                                        >
                                            <i className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                        </button>
                                    </div>
                                    {/* Podcast Name */}
                                    <p className="text-white truncate font-semibold">{podcast.name}</p>
                                </div>
                            ))}
                        </div>
                </>
            )}

            {/* =================================== CATEGORY PAGES =================================== */}
            {activeCategory === "Songs" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Songs</h2>
                        <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {songs.map((song, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded hover:bg-gray-700 transition-all group"
                                    onClick={() => handleAlbumClick(song.albumName, "Album")}
                                >
                                    {/* Square Song Cover */}
                                    <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                                        <img
                                            src={song.image}
                                            alt="Song Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button */}
                                        <button
                                            className="absolute bottom-1 right-1 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents click from bubbling up
                                                handlePlay("Album", song.albumName, song.index);
                                              }}
                                        >
                                            <i className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                        </button>
                                    </div>
                                    {/* Song Title */}
                                    <p className="text-white truncate font-semibold">{song.name}</p>
                                    {/* Song Album */}
                                    <p className="text-gray-400 text-sm">{song.albumName}</p>
                                </div>
                            ))}
                        </div>
                </div>
            )}

            {activeCategory === "Playlists" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Playlists</h2>
                        <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {playlists.map((pl, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded hover:bg-gray-700 transition-all group"
                                    onClick={() => handleAlbumClick(pl.name, "Playlist")}
                                >
                                    {/* Square Playlist Cover */}
                                    <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                                        <img
                                            src={pl.image}
                                            alt="Playlist Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button */}
                                        <button
                                            className="absolute bottom-1 right-1 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents click from bubbling up
                                                handlePlay("Playlist", pl.name, 0);
                                              }}
                                        >
                                            <i className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                        </button>
                                    </div>
                                    {/* Playlist Name */}
                                    <p className="text-white truncate font-semibold">{pl.name}</p>
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
                                    className="flex flex-col items-center px-2 py-8 cursor-pointer group hover:bg-gray-800 transition-colors"
                                    onClick={() => handleAlbumClick(artist.name, "Artist")}
                                >
                                    <div className="relative w-36 h-36">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover rounded-full mb-2"
                                    />
                                    
                                    <button
                                        className="absolute bottom-0 right-0 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents click from bubbling up
                                            handlePlay("Artist", artist.name, 0);
                                          }}
                                    >
                                        <i className="fa-solid fa-circle-play text-4xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                    </button>
                                    </div>
                                    <p className="mt-2 text-sm font-medium">{artist.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            {activeCategory === "Albums" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Albums</h2>
                        <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {albums.map((album, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded hover:bg-gray-700 transition-all group"
                                    onClick={() => handleAlbumClick(album.name, "Album")}
                                >
                                    {/* Square Album Cover */}
                                    <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                                        <img
                                            src={album.image}
                                            alt="Album Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button */}
                                        <button
                                            className="absolute bottom-1 right-1 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents click from bubbling up
                                                handlePlay("Album", album.name, 0);
                                              }}
                                        >
                                            <i className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                        </button>
                                    </div>
                                    {/* Album Name */}
                                    <p className="text-white truncate font-semibold">{album.name}</p>
                                </div>
                            ))}
                        </div>
                </div>
            )}

            {activeCategory === "Podcasts" && (
                <div>
                    <h2 className="font-semibold text-xl mb-2 mt-6">Podcasts</h2>
                        <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {podcasts.map((podcast, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded hover:bg-gray-700 transition-all group"
                                    onClick={() => handleAlbumClick(podcast.name, "Podcast")}
                                >
                                    {/* Square Podcast Cover */}
                                    <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
                                        <img
                                            src={podcast.image}
                                            alt="Podcast Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play Button */}
                                        <button
                                            className="absolute bottom-1 right-1 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents click from bubbling up
                                                handlePlay("Podcast", podcast.name, 0);
                                              }}
                                        >
                                            <i className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                                        </button>
                                    </div>
                                    {/* Podcast Name */}
                                    <p className="text-white truncate font-semibold">{podcast.name}</p>
                                </div>
                            ))}
                        </div>
                </div>
            )}
        </div>
    );
}