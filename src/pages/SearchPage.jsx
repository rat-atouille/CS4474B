import {useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import getSearchData from "../getSearchData.js";
import getStructuredData from "../getStructuredData";
import {FaMinus, FaPlus} from "react-icons/fa6";

// Utility function to shuffle an array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function SearchPage({setMusicQueue}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState(['all', 'songs', 'artist', 'albums', 'podcasts']); // State to track expanded

  // Update searchParam whenever the URL query changes.
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
  const artists = getSearchData("artists");

  // ---------- Category Tabs ----------
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

  // ---------- Filtering: Only show items that match the search query ----------
  const lowerSearch = searchParam.trim().toLowerCase();
  const filteredArtists = lowerSearch
    ? artists.filter((item) => item.name.toLowerCase().includes(lowerSearch))
    : shuffleArray(artists);
  const filteredSongs = lowerSearch
    ? songs.filter((item) => item.name.toLowerCase().includes(lowerSearch))
    : shuffleArray(songs);
  const filteredPlaylists = lowerSearch
    ? playlists.filter((item) => item.name.toLowerCase().includes(lowerSearch))
    : shuffleArray(playlists);
  const filteredAlbums = lowerSearch
    ? albums.filter((item) => item.name.toLowerCase().includes(lowerSearch))
    : shuffleArray(albums);
  const filteredPodcasts = lowerSearch
    ? podcasts.filter((item) => item.name.toLowerCase().includes(lowerSearch))
    : shuffleArray(podcasts);

  // ---------- Build available categories based on filtered data ----------
  const availableCategories = ["All"];
  if (filteredSongs.length > 0) availableCategories.push("Songs");
  if (filteredPlaylists.length > 0) availableCategories.push("Playlists");
  if (filteredArtists.length > 0) availableCategories.push("Artists");
  if (filteredAlbums.length > 0) availableCategories.push("Albums");
  if (filteredPodcasts.length > 0) availableCategories.push("Podcasts");

  // Check if no results
  const noResults =
    filteredSongs.length === 0 &&
    filteredPlaylists.length === 0 &&
    filteredArtists.length === 0 &&
    filteredAlbums.length === 0 &&
    filteredPodcasts.length === 0;

  // If current active category is no longer available, switch to All.
  useEffect(() => {
    if (activeCategory !== "All" && !availableCategories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [availableCategories, activeCategory]);

  return (
    <div className="bg-[#212121] p-6 space-y-6 text-white min-h-screen">
      <h1 className="text-2xl font-bold">Search results for "{searchParam}"</h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2">
        {!noResults && (
          availableCategories.map((category) => (
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
          ))
        )}

      </div>

      {/* =================================== ALL PAGE =================================== */}
      {(activeCategory === "All" && !noResults) && (
        <div>
          {filteredArtists.length > 0 && (
            <>
              <div
                className="select-none flex p-0 mb-4  flex-rows hover:text-green-500 transition-all duration-150 ease-in-out"
                onClick={() => setExpanded(expanded.includes('all') ? expanded.filter(e => e !== 'all') : [...expanded, 'all'])}>
                <h2
                  className="font-semibold text-xl">Artists</h2>
                <button className="ml-1 flex items-center justify-center p-2">
                  {expanded.includes('all') ? <FaMinus size={10}/> : <FaPlus size={10}/>}
                </button>
              </div>
              {expanded.includes('all') && (
                <div className="grid grid-cols-6 gap-4">
                  {filteredArtists.map((artist, index) => (
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
                          <i
                            className="fa-solid fa-circle-play text-4xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                        </button>
                      </div>
                      <p className="mt-2 text-sm font-medium">{artist.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {filteredSongs.length > 0 && (
            <div>
              <div
                className="select-none flex p-0 mb-4  flex-rows hover:text-green-500 transition-all duration-150 ease-in-out"
                onClick={() => setExpanded(expanded.includes('songs') ? expanded.filter(e => e !== 'songs') : [...expanded, 'songs'])}>
                <h2
                  className="font-semibold text-xl">Songs</h2>
                <button className="ml-1 flex items-center justify-center p-2">
                  {expanded.includes('songs') ? <FaMinus size={10}/> : <FaPlus size={10}/>}
                </button>
              </div>
              {expanded.includes('songs') && (
                <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

                  {filteredSongs.map((song, index) => (
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
                          <i
                            className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                        </button>
                      </div>
                      {/* Song Title */}
                      <p className="text-white truncate font-semibold">{song.name}</p>
                      {/* Song Album */}
                      <p className="text-gray-400 text-sm">{song.albumName}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {filteredAlbums.length > 0 && (
            <div>
              <div
                className="select-none flex p-0 mb-4  flex-rows hover:text-green-500 transition-all duration-150 ease-in-out"
                onClick={() => setExpanded(expanded.includes('albums') ? expanded.filter(e => e !== 'albums') : [...expanded, 'albums'])}>
                <h2
                  className="font-semibold text-xl">Albums</h2>
                <button className="ml-1 flex items-center justify-center p-2">
                  {expanded.includes('albums') ? <FaMinus size={10}/> : <FaPlus size={10}/>}
                </button>
              </div>
              {expanded.includes('albums') && (
                <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredAlbums.map((album, index) => (
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
                          <i
                            className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                        </button>
                      </div>
                      {/* Album Name */}
                      <p className="text-white truncate font-semibold">{album.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {filteredPodcasts.length > 0 && (
            <div>
              <div
                className="select-none flex p-0 mb-4  flex-rows hover:text-green-500 transition-all duration-150 ease-in-out"
                onClick={() => setExpanded(expanded.includes('podcasts') ? expanded.filter(e => e !== 'podcasts') : [...expanded, 'podcasts'])}>
                <h2
                  className="font-semibold text-xl">Podcasts</h2>
                <button className="ml-1 flex items-center justify-center p-2">
                  {expanded.includes('podcasts') ? <FaMinus size={10}/> : <FaPlus size={10}/>}
                </button>
              </div>
              {expanded.includes('podcasts') && (
                <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredPodcasts.map((podcast, index) => (
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
                          <i
                            className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                        </button>
                      </div>
                      {/* Podcast Name */}
                      <p className="text-white truncate font-semibold">{podcast.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {activeCategory === "All" && noResults &&
        <div className="text-center mt-10 text-gray-400">
          <p className="text-lg">No results found matching your search.</p>
        </div>
      }


      {/* =================================== CATEGORY PAGES =================================== */}
      {activeCategory === "Songs" && filteredSongs.length > 0 && (
        <div>
          <h2 className="font-semibold text-xl mb-2 mt-6">Songs</h2>
          <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredSongs.map((song, index) => (
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
                    <i
                      className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
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

      {activeCategory === "Playlists" && filteredPlaylists.length > 0 && (
        <div>
          <h2 className="font-semibold text-xl mb-2 mt-6">Playlists</h2>
          <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredPlaylists.map((pl, index) => (
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
                    <i
                      className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                  </button>
                </div>
                {/* Playlist Name */}
                <p className="text-white truncate font-semibold">{pl.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategory === "Artists" && filteredArtists.length > 0 && (
        <div>
          <h2 className="font-semibold text-xl mb-2 mt-6">Artists</h2>
          <div className="grid grid-cols-6 gap-4">
            {filteredArtists.map((artist, index) => (
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
                    <i
                      className="fa-solid fa-circle-play text-4xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                  </button>
                </div>
                <p className="mt-2 text-sm font-medium">{artist.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategory === "Albums" && filteredAlbums.length > 0 && (
        <div>
          <h2 className="font-semibold text-xl mb-2 mt-6">Albums</h2>
          <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredAlbums.map((album, index) => (
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
                    <i
                      className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                  </button>
                </div>
                {/* Album Name */}
                <p className="text-white truncate font-semibold">{album.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategory === "Podcasts" && filteredPodcasts.length > 0 && (
        <div>
          <h2 className="font-semibold text-xl mb-2 mt-6">Podcasts</h2>
          <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredPodcasts.map((podcast, index) => (
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
                    <i
                      className="fa-solid fa-circle-play text-6xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
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
