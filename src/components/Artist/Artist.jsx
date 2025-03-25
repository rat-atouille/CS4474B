import React, { useEffect, useState } from 'react';

const Artist = () => {
  const [activeTab, setActiveTab] = useState('Home');
  

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
  
  const likedSongs = songs.slice(0, 3);
  
  // Tab content rendering
  const renderTabContent = () => {
    switch(activeTab) {
      case 'Home':
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Recent Plays</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {songs.slice(0, 4).map(song => (
                  <div key={song.id} className="bg-gray-800 p-3 rounded">
                    <div className="w-full h-32 bg-blue-500 mb-2 rounded"></div>
                    <p className="text-white truncate">{song.title}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {albums.map(album => (
                  <div key={album.id} className="bg-gray-800 p-3 rounded">
                    <div className="w-full h-32 bg-purple-500 mb-2 rounded"></div>
                    <p className="text-white truncate">{album.title}</p>
                    <p className="text-gray-400 text-sm">{album.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'Popular':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Popular</h2>
            <div className="rounded">
              {songs.map((song, index) => (
                <div key={song.id} className="rounded-lg flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353]">
                  <div className="w-8 text-center text-gray-400 mr-3">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-blue-500 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-white">{song.title}</p>
                    <p className="text-gray-400 text-sm">{song.plays} plays</p>
                  </div>
                  <div className="text-gray-400 mr-7">{song.duration}</div>
                  <div className="text-gray-400 mr-3">▪▪▪</div>
                </div>
              ))}
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
                    <p className="text-gray-400 text-sm">By Bobby Bobblehead</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">All Songs</h2>
              <div className="bg-gray-800 rounded">
                {songs.map(song => (
                  <div key={song.id} className="flex items-center p-3 border-b border-gray-700">
                    <div className="w-12 h-12 bg-blue-500 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-white">{song.title}</p>
                      <p className="text-gray-400 text-sm">{song.plays} plays</p>
                    </div>
                    <div className="text-gray-400">{song.duration}</div>
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
    <div className="bg-[#212121] text-white h-full">
      {/* Header with artist info */}
      <div className="relative h-48 bg-purple-900 p-6 flex items-end">
        <div className="relative z-10">
          {artistData.verified && (
            <span className="text-xs px-2 py-1 rounded-sm mb-1 inline-block">
              ✅ Verified Artist
            </span>
          )}
          <h1 className="text-4xl font-bold">{artistData.name}</h1>
          <p className="text-sm mt-2 text-[#b3b3b3]">{artistData.monthlyListeners} monthly listeners</p>
        </div>
        
        <button className="absolute right-25 bottom-8 rounded-400 pl-6 pr-6 pt-1 pb-1 border-2 rounded-3xl border-solid border-[#b3b3b3] z-10 cursor-pointer">
          <div className="w-6 h-6 flex items-center justify-center text-[#b3b3b3]">Follow</div>
        </button>

        {/* Play button */}
        <button className="absolute right-6 bottom-6 bg-green-500 rounded-full p-3 z-10 cursor-pointer">
          <div className="w-6 h-6 flex items-center justify-center">▸</div>
        </button>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="px-6 border-b border-gray-800">
        <div className="flex space-x-6">
          {['Home', 'Popular', 'Songs', 'Albums'].map(tab => (
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