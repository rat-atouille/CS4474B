import React, { useState, useEffect } from 'react';
import { IoPlay, IoPause, IoHeart, IoHeartOutline, IoChevronDown, IoChevronUpOutline } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsSoundwave } from "react-icons/bs";
import { FaMinus, FaShuffle } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

// Import the data from the specified path
import data from "../assets/data/data.json";
import getStructuredData from "../getStructuredData.js";

// navigate(`/artist/?name=${item.artistName}`);

const Artist = ({setMusicQueue}) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playIndex, setPlayIndex] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [follow, setFollow] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [likedAlbums, setLikedAlbums] = useState([]);
  const [artistData, setArtistData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [expanded, setExpanded] = useState(['all', 'recent', 'popular']); // State to track expanded sections

  useEffect(() => {
    // Load artist data when component mounts
    loadArtistData();
  }, []);

  const loadArtistData = () => {
    try {
      // Get first artist from the data
      const artistName = new URL(window.location.href).searchParams.get("name");

      const artistKey = Object.keys(data).find(
        key => key.toLowerCase() === artistName?.toLowerCase()
      );
      const artist = data[artistKey];

      if (artist) {
        console.log("Loaded artist:", artistKey, artist);

        // Set artist info
        setArtistData({
          name: artistKey,
          verified: true,
          monthlyListeners: formatNumber(artist.followers),
          profileImage: artist.image,
          about: artist.about
        });

        // Process albums and extract songs
        const allSongs = [];
        const artistAlbums = [];

        artist.albums.forEach((album, index) => {
          // Add album to albums list
          artistAlbums.push({
            id: index + 1,
            title: album.name,
            year: new Date(album.releaseDate).getFullYear(),
            tracks: album.songs.length,
            image: album.image
          });

          // Add songs from this album
          album.songs.forEach((song, songIndex) => {
            allSongs.push({
              id: `${index}-${songIndex}`,
              title: song.name,
              plays: formatNumber(Math.floor(Math.random() * 10000000)), // Random number of plays for demo
              duration: formatDuration(song.durationMs),
              image: song.image || album.image,
              albumName: album.name
            });
          });
        });

        setSongs(allSongs);
        setAlbums(artistAlbums);
      } else {
        console.error("No artist data found");
      }
    } catch (error) {
      console.error("Error loading artist data:", error);
    }
  };

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Helper function to format duration from milliseconds to mm:ss
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleLike = (e, songId) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    if (likedSongs.includes(songId)) {
      setLikedSongs(likedSongs.filter(id => id !== songId));
    } else {
      setLikedSongs([...likedSongs, songId]);
    }
  };

  const toggleLikeAlbum = (e, albumId) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    if (likedAlbums.includes(albumId)) {
      setLikedAlbums(likedAlbums.filter(id => id !== albumId));
    } else {
      setLikedAlbums([...likedAlbums, albumId]);
    }
  };

  const togglePlay = (e, index) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    if (playIndex === index) {
      setPlayIndex(null);
    } else {
      setPlayIndex(index);
    }
  };

  const handlePlay = (name, index) => {
    if (typeof setMusicQueue === 'function') {
      setMusicQueue(getStructuredData("album", name, index));
    } else {
      console.error('setMusicQueue is not a function');
    }
  };

  // Tab content rendering
  const renderTabContent = () => {
    if (!artistData) {
      return <div className="p-4">Loading artist data...</div>;
    }

    switch(activeTab) {
      case 'Home':
        return (
          <div>
            <div>
              <div className="flex p-0 mb-4 mt-2 justify-between flex-col">
                <div
                  onClick={() => setExpanded(expanded.includes('recent') ? expanded.filter(e => e !== 'recent') : [...expanded, 'recent'])} 
                  className='hover:text-green-500 transition-all'>
                  <h2 className="select-none text-xl font-bold flex">Recently Played
                  <button className="ml-1 flex items-center justify-center p-2">
                      {expanded.includes('recent') ? <FaMinus size={10} />  : <FaPlus size={10} />} 
                    </button>
                </h2>

                </div>
                {/* Recently played contents - limited to 3 songs */}
                {expanded.includes('recent') && (
                <div className="rounded mt-5">
                    {songs.slice(0, 3).map((song, index) => (
                      <div
                        key={song.id}
                        onMouseEnter={() => setHoveredIndex(`recent-${index}`)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={(e) => {
                        togglePlay(e, `recent-${index}`);
                        handlePlay(song.albumName, index);
                      }}
                        className="rounded-lg flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353] relative"
                      >
                        <div
                          className="w-8 h-8 flex items-center justify-center text-gray-400 mr-3 hover:text-white"
                          onClick={(e) => {
                          togglePlay(e, `recent-${index}`);
                          handlePlay(song.albumName, index);
                        }}
                        >
                          {playIndex === `recent-${index}` ?
                            <BsSoundwave className="text-green-500" /> :
                            (hoveredIndex === `recent-${index}` ? <IoPlay className="text-lg" /> : index + 1)
                          }
                        </div>

                        {/* Song image */}
                        <div className="w-12 h-12 mr-3 overflow-hidden rounded">
                          <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                        </div>
  
                        {/* Song details */}
                        <div className="flex-1">
                          <p className={`${playIndex === `recent-${index}` ? 'text-green-500' : 'text-white'}`}>
                            {song.title}
                          </p>
                          <p className="text-gray-400 text-sm">{song.plays} plays</p>
                        </div>

                        {/* Liked song */}
                        <div
                          className="text-gray-400 mr-8 cursor-pointer"
                          onClick={(e) => toggleLike(e, song.id)}
                        >
                          {likedSongs.includes(song.id) ?
                            <IoHeart className="text-red-500" /> :
                            (hoveredIndex === `recent-${index}` ? <IoHeartOutline /> : null)
                          }
                        </div>

                        {/* Duration and more options */}
                        <div className="text-gray-400 mr-17">{song.duration}</div>
                        {hoveredIndex === `recent-${index}` && (
                          <div
                            className="absolute right-10 text-gray-400 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HiDotsHorizontal />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>                
                )}

              </div>

              {/* popular songs */}
              <div className="flex p-0 mb-4 mt-2 justify-between">
                <div
                    onClick={() => setExpanded(expanded.includes('popular') ? expanded.filter(e => e !== 'popular') : [...expanded, 'popular'])} 
                    className='hover:text-green-500 transition-all'
                  >
                    <h2 className="select-none text-xl font-bold flex">Popular
                    <button className="ml-1 flex items-center justify-center rounded-full p-2">
                        {expanded.includes('popular') ? <FaMinus size={10} />  : <FaPlus size={10} />} 
                      </button>
                    </h2>
                  </div>
                <button className="
                  cursor-pointer text-[#b3b3b3]
                  hover:scale-105 transition-transform duration-150 hover:border-white hover:text-white
                  pl-2 pr-2 pt-1 pb-1 text-sm font-md border-[#b3b3b3] border border-2 rounded-2xl mr-5"
                  onClick={()=>setPlayIndex(0)}
                >
                  Play All
                </button>
              </div>
              {
                expanded.includes('popular') && (
                  <div className="rounded mt-5">
                  {songs.slice(0,5).map((song, index) => (
                    <div
                      key={song.id}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={(e) => {
                      togglePlay(e, index);
                      handlePlay(song.albumName, index)
                    }}
                      className="rounded-lg flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353] relative"
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center text-gray-400 mr-3 hover:text-white"
                        onClick={(e) => {
                        togglePlay(e, index);
                        handlePlay(song.albumName, index)
                      }}
                      >
                        {playIndex === index ?
                          <BsSoundwave className="text-green-500" /> :
                          (hoveredIndex === index ? <IoPlay className="text-lg" /> : index + 1)
                        }
                      </div>
  
                      {/* Song image */}
                      <div className="w-12 h-12 mr-3 overflow-hidden rounded">
                        <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                      </div>
  
                      {/* Song details */}
                      <div className="flex-1">
                        <p className={`${playIndex === index ? 'text-green-500' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-gray-400 text-sm">{song.plays} plays</p>
                      </div>
  
                      {/* Liked song */}
                      <div
                        className="text-gray-400 mr-8 cursor-pointer"
                        onClick={(e) => toggleLike(e, song.id)}
                      >
                        {likedSongs.includes(song.id) ?
                          <IoHeart className="text-red-500" /> :
                          (hoveredIndex === index ? <IoHeartOutline /> : null)
                        }
                      </div>
  
                      {/* Duration and more options */}
                      <div className="text-gray-400 mr-17">{song.duration}</div>
                      {hoveredIndex === index && (
                        <div
                          className="absolute right-10 text-gray-400 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HiDotsHorizontal />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                )
              }

            </div>

            <div className="ml-3 mr-3">
                <h2 className="text-xl font-bold mb-4 mt-10">Recommended for You</h2>
                <div className="mx-5  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {albums.slice(0, 5).map(album => (
                    <div key={album.id} className="p-3 rounded hover:bg-gray-700 transition-all">
                      {/* Square Album Cover */}
                      <div className="w-full aspect-square mb-2 rounded overflow-hidden">
                        <img src={album.image} alt={album.title} className="w-full h-full object-cover" />
                      </div>
                      {/* Album Title */}
                      <p className="text-white truncate font-semibold">{album.title}</p>
                      {/* Album Year */}
                      <p className="text-gray-400 text-sm">{album.year}</p>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        );

      case 'Songs':
        return (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-4">Liked Songs</h2>
              <div className="bg-gray-700 rounded-md p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4 rounded overflow-hidden">
                    <img src={artistData.profileImage} alt={artistData.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white">You've liked {likedSongs.length} songs</p>
                    <p className="text-gray-400 text-sm">By {artistData.name}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className='flex p-0 justify-between'>
              <div
                  onClick={() => setExpanded(expanded.includes('all') ? expanded.filter(e => e !== 'all') : [...expanded, 'all'])} 
                  className='hover:text-green-500 transition-all'
                >
                  <h2 className="select-none text-xl font-bold flex">All Songs
                  <button className="ml-1 flex items-center justify-center rounded-full p-2">
                      {expanded.includes('all') ? <FaMinus size={10} />  : <FaPlus size={10} />} 
                    </button>
                  </h2>
              </div>
                <button className="
                    cursor-pointer text-[#b3b3b3]
                    hover:scale-105 transition-transform duration-150 hover:border-white hover:text-white
                    pl-3 pr-3 pt-1 pb-1 mr-5 text-sm font-md border-[#b3b3b3] border border-2 rounded-2xl"
                    onClick={()=>setPlayIndex(0)}
                  >
                    Play All
                  </button>
              </div>

              {/* All songs contents */}
            {expanded.includes('all') && (
              <div className='mt-5 '>
              <div className="rounded">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => {
                    togglePlay(e, index);
                    handlePlay(song.albumName, index);
                  }}
                  className="rounded-lg flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353] relative"
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center text-gray-400 mr-3 hover:text-white"
                    onClick={(e) => {
                      togglePlay(e, index);
                      handlePlay(song.albumName, index);
                    }}
                  >
                    {playIndex === index ?
                      <BsSoundwave className="text-green-500" /> :
                      (hoveredIndex === index ? <IoPlay className="text-lg" /> : index + 1)
                    }
                  </div>

                  {/* Song image */}
                  <div className="w-12 h-12 mr-3 overflow-hidden rounded">
                    <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Song details */}
                  <div className="flex-1">
                    <p className={`${playIndex === index ? 'text-green-500' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-gray-400 text-sm">{song.plays} plays</p>
                  </div>

                  {/* Liked song */}
                  <div
                    className="text-gray-400 mr-8 cursor-pointer"
                    onClick={(e) => toggleLike(e, song.id)}
                  >
                    {likedSongs.includes(song.id) ?
                      <IoHeart className="text-red-500" /> :
                      (hoveredIndex === index ? <IoHeartOutline /> : null)
                    }
                  </div>

                  {/* Duration and more options */}
                  <div className="text-gray-400 mr-17">{song.duration}</div>
                  {hoveredIndex === index && (
                    <div
                      className="absolute right-10 text-gray-400 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HiDotsHorizontal />
                    </div>
                  )}
                </div>
              ))}
              </div>
            </div>
              )}

            </div>
          </div>
        );

      case 'Albums':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Albums</h2>
              <div className="mx-5  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {albums.map(album => (
                  <div key={album.id} className="p-3 rounded hover:bg-gray-700 transition-all">
                    {/* Square Album Cover */}
                    <div className="w-full relative aspect-square mb-2 rounded overflow-hidden">
                      <img src={album.image} alt={album.title} className="w-full h-full object-cover" />
                      <button className="absolute right-4 top-3 cursor-pointer"
                      onClick={(e) => toggleLikeAlbum(e, album.id)}
                    >
                      {likedAlbums.includes(album.id) ?
                        <IoHeart size={25} className="text-white drop-shadow-md" /> :
                        <IoHeartOutline size={25} className="text-white drop-shadow-mdy" />
                      }
                    </button>
                    </div>
                    {/* Album Title, year, # of songs */}
                    <p className="text-white font-bold">{album.title}</p>
                    <p className="text-gray-400 text-sm">{album.year} • {album.tracks} tracks</p>
                  </div>
                ))}
              </div>

          </div>
        );

      case 'Singles & EPs':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Singles & EPs</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {albums.filter(album => album.songs <= 1).map(album => (
                <div key={album.id} className="bg-gray-800 p-4 rounded">
                  <div className="w-full h-48 mb-3 relative rounded overflow-hidden">
                    <img src={album.image} alt={album.title} className="w-full h-full object-cover" />
                    {/* Heart button */}
                    <button className="absolute right-4 top-3 cursor-pointer"
                      onClick={(e) => toggleLikeAlbum(e, album.id)}
                    >
                      {likedAlbums.includes(album.id) ?
                        <IoHeart size={30} className="text-white" /> :
                        <IoHeartOutline size={30} className="text-white" />
                      }
                    </button>
                  </div>
                  <p className="text-white font-bold">{album.title}</p>
                  <p className="text-gray-400 text-sm">Singles • {album.year}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'About':
        return (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-4">About {artistData.name}</h2>
            <div className="mb-6 flex">
              <div>
                <p className="text-gray-300 mb-4">
                  {artistData.about}
                </p>
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Monthly Listeners</h4>
                  <p className="text-gray-300">{artistData.monthlyListeners}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Discography</h4>
                  <p className="text-gray-300">{albums.length} albums</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="bg-[#212121] text-white w-full">
      {/* Header with artist info */}
      {artistData && (
        <div className="relative h-55 bg-purple-900 p-6 flex items-end">
          <div className="relative z-10">
            {artistData.verified && (
              <span className="text-xs px-2 py-1 rounded-sm mb-1 inline-block select-none">
                ✅ Verified Artist
              </span>
            )}
            <h1 className="text-4xl font-bold">{artistData.name}</h1>
            <p className="text-sm mt-2 text-[#b3b3b3] select-none">{artistData.monthlyListeners} monthly listeners</p>
          </div>

          {/* Follow button */}
          <button className="hover:scale-110 transition-transform duration-150 hover:border-white hover:text-white
            text-[#b3b3b3] absolute right-37 bottom-10 pl-4 pr-4 pt-1 pb-1 border-2 rounded-3xl border-solid border-[#b3b3b3] z-10 cursor-pointer"
            onClick={() => setFollow(!follow)}
          >
            {follow ? 'Following' : 'Follow'}
          </button>

          {/* Shuffle button */}
          <button className={`hover:scale-110 transition-transform duration-150 rounded-full p-4 z-10 cursor-pointer absolute right-21 bottom-7 ${shuffle ? "text-green-500" : "text-white"}`}
            onClick={() => setShuffle(!shuffle)}
          >
            <FaShuffle size={25}/>
          </button>

          {/* Play button */}
          <button 
            onClick={() => handlePlay(albums[0].title, 0)}
            className="hover:scale-110 transition-transform duration-150 
            bg-green-500 flex justify-center items-center
            rounded-full p-5 z-10 cursor-pointer absolute right-6 bottom-8">
            <span className="flex justify-center items-center text-black">
              <FaPlay />
            </span>
          </button>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"
            style={{
              backgroundImage: `url(${artistData.profileImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.4
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="px-6 border-b border-gray-800">
        <div className="flex space-x-6 ">
          {['Home', 'Songs', 'Singles & EPs', 'Albums', 'About'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 relative ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Artist;