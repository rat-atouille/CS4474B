import React, { useEffect, useState } from 'react';
import { IoPlay, IoPause, IoHeart, IoHeartOutline } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsSoundwave } from "react-icons/bs";

const Artist = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playIndex, setPlayIndex] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [follow, SetFollow] = useState(false);

  // Sample data
  const artistData = {
    name: "Artist name",
    verified: true,
    monthlyListeners: "1,234,567",
    profileImage: "/api/placeholder/300/300"
  };
  
  const songs = [
    { id: 1, title: "Floating", plays: "3,256,387", duration: "3:22" },
    { id: 2, title: "Floating", plays: "3,256,387", duration: "3:22" },
    { id: 3, title: "Floating", plays: "3,256,387", duration: "3:22" },
    { id: 4, title: "Dreaming", plays: "2,845,210", duration: "4:15" },
    { id: 5, title: "Neon Nights", plays: "1,953,421", duration: "3:47" }
  ];
  
  const albums = [
    { id: 1, title: "Summer Vibes", year: "2024", tracks: 12 },
    { id: 2, title: "Midnight Drive", year: "2022", tracks: 10 },
    { id: 3, title: "Electric Dreams", year: "2020", tracks: 8 }
  ];
  
  const toggleLike = (e, songId) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    if (likedSongs.includes(songId)) {
      setLikedSongs(likedSongs.filter(id => id !== songId));
    } else {
      setLikedSongs([...likedSongs, songId]);
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
  
  // Tab content rendering
  const renderTabContent = () => {
    switch(activeTab) {
      case 'Home':
        return (
          <div>
            <div>
              <div className="flex p-0 mb-4 mt-2 justify-between flex-col">
                <h2 className="text-xl font-bold">Recently Played</h2>
                {/* Recently played contents - limited to 3 songs */}
                <div className="rounded mt-5">
                  {songs.slice(0, 3).map((song, index) => (
                    <div
                      key={song.id}
                      onMouseEnter={() => setHoveredIndex(`recent-${index}`)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => setPlayIndex(`recent-${index}`)}
                      className="rounded-lg flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353] relative"
                    >
                      <div 
                        className="w-8 h-8 flex items-center justify-center text-gray-400 mr-3 hover:text-white"
                        onClick={(e) => togglePlay(e, `recent-${index}`)}
                      >
                        {playIndex === `recent-${index}` ? 
                          <BsSoundwave className="text-green-500" /> : 
                          (hoveredIndex === `recent-${index}` ? <IoPlay className="text-lg" /> : index + 1)
                        }                        
                      </div>
                      <div className="w-12 h-12 bg-blue-500 mr-3"></div>
                      <div className="flex-1">
                        <p className={`${playIndex === `recent-${index}` ? 'text-green-500' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-gray-400 text-sm">{song.plays} plays</p>
                      </div>
                      <div 
                        className="text-gray-400 mr-8 cursor-pointer"
                        onClick={(e) => toggleLike(e, song.id)}
                      >
                        {likedSongs.includes(song.id) ? 
                          <IoHeart className="text-red-500" /> : 
                          (hoveredIndex === `recent-${index}` ? <IoHeartOutline /> : null)
                        }
                      </div>
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
              </div>
              <div className="flex p-0 mb-4 mt-2 justify-between">
                <h2 className="text-xl font-bold">Popular</h2>
                <button className="
                  cursor-pointer text-[#b3b3b3]
                  hover:scale-105 transition-transform duration-150 hover:border-white hover:text-white
                  pl-3 pr-3 pt-1 pb-1 text-sm font-md border-[#b3b3b3] border border-2 rounded-2xl"
                  onClick={()=>setPlayIndex(0)}
                  >Play All</button>
              </div>
              <div className="rounded">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setPlayIndex(index)}
                    className="rounded-lg flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353] relative"
                  >
                    <div 
                      className="w-8 h-8 flex items-center justify-center text-gray-400 mr-3 hover:text-white"
                      onClick={(e) => togglePlay(e, index)}
                    >
                      {playIndex === index ? 
                        <BsSoundwave className="text-green-500" /> : 
                        (hoveredIndex === index ? <IoPlay className="text-lg" /> : index + 1)
                      }                        
                    </div>
                    <div className="w-12 h-12 bg-blue-500 mr-3"></div>
                    <div className="flex-1">
                      <p className={`${playIndex === index ? 'text-green-500' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <p className="text-gray-400 text-sm">{song.plays} plays</p>
                    </div>
                    <div 
                      className="text-gray-400 mr-8 cursor-pointer"
                      onClick={(e) => toggleLike(e, song.id)}
                    >
                      {likedSongs.includes(song.id) ? 
                        <IoHeart className="text-red-500" /> : 
                        (hoveredIndex === index ? <IoHeartOutline /> : null)
                      }
                    </div>
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
            <div className='ml-3 mr-3'>
              <h2 className="text-xl font-bold mb-4 mt-10">Recommended for You</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {albums.map(album => (
                  <div key={album.id} className="p-3 rounded">
                    <div className="w-full h-38 bg-purple-500 mb-2 rounded"></div>
                    <p className="text-white truncate font-semibold">{album.title}</p>
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
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Liked Songs</h2>
              <div className="bg-gray-800 rounded p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-500 mr-4"></div>
                  <div>
                    <p className="text-white">You've liked {likedSongs.length} songs</p>
                    <p className="text-gray-400 text-sm">By {artistData.name}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">All Songs</h2>
              <div className="bg-gray-800 rounded">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    onMouseEnter={() => setHoveredIndex(`song-${index}`)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setPlayIndex(`song-${index}`)}
                    className="flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353] relative"
                  >
                    <div 
                      className="w-8 h-8 flex items-center justify-center text-gray-400 mr-3 hover:text-white"
                      onClick={(e) => togglePlay(e, `song-${index}`)}
                    >
                      {playIndex === `song-${index}` ? 
                        <BsSoundwave className="text-green-500" /> : 
                        (hoveredIndex === `song-${index}` ? <IoPlay className="text-lg" /> : index + 1)
                      }                        
                    </div>
                    <div className="w-12 h-12 bg-blue-500 mr-3"></div>
                    <div className="flex-1">
                      <p className={`${playIndex === `song-${index}` ? 'text-green-500' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <p className="text-gray-400 text-sm">{song.plays} plays</p>
                    </div>
                    <div className="text-gray-400 mr-3">{song.duration}</div>
                    <div 
                      className="text-gray-400 mr-8 cursor-pointer"
                      onClick={(e) => toggleLike(e, song.id)}
                    >
                      {likedSongs.includes(song.id) ? 
                        <IoHeart className="text-red-500" /> : 
                        (hoveredIndex === `song-${index}` ? <IoHeartOutline /> : null)
                      }
                    </div>
                    {hoveredIndex === `song-${index}` && (
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
          </div>
        );
      
      case 'Albums':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {albums.map(album => (
                <div key={album.id} className="bg-gray-800 p-4 rounded">
                  <div className="w-full h-48 bg-purple-500 mb-3 rounded"></div>
                  <p className="text-white font-bold">{album.title}</p>
                  <p className="text-gray-400 text-sm">{album.year} • {album.tracks} tracks</p>
                </div>
              ))}
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
      <div className="relative h-48 bg-purple-900 p-6 flex items-end">
        <div className="relative z-10">
          {artistData.verified && (
            <span className="text-xs px-2 py-1 rounded-sm mb-1 inline-block select-none">
              ✅ Verified Artist
            </span>
          )}
          <h1 className="text-4xl font-bold">{artistData.name}</h1>
          <p className="text-sm mt-2 text-[#b3b3b3] select-none">{artistData.monthlyListeners} monthly listeners</p>
        </div>
        
        <button className="hover:scale-110 transition-transform duration-150 hover:border-white hover:text-white
          text-[#b3b3b3] absolute right-25 bottom-10 pl-4 pr-4 pt-1 pb-1 border-2 rounded-3xl border-solid border-[#b3b3b3] z-10 cursor-pointer"
          onClick={()=> SetFollow(!follow)}
          >
            {follow? 'Following' : 
            'Follow'}
              
        </button>

        {/* Play button */}
        <button className="rounded-full p-4 z-10 cursor-pointer absolute right-4 bottom-5 group-hover">
            <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:text-green-400 hover:scale-105 transition-all duration-300 ease-in-out"></i>
        </button>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="px-6 border-b border-gray-800">
        <div className="flex space-x-6">
          {['Home', 'Songs', 'Singles & EPs', 'Albums'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 relative hover:text-white transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}
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