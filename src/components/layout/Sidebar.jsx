import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaHeart, FaSearch, FaList, FaPlus } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import spotifyData from "../../assets/data/data.json";
import { useAlbum } from "../../context/AlbumContext";

function Sidebar({ collapsed, setCollapsed, setMusicQueue }) {
  const [albums, setAlbums] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [, setCurrentAlbum] = useAlbum();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Sidebar collapsed state changed:", collapsed);
  }, [collapsed]);

  const handleCategory = (category) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  useEffect(() => {
    if (spotifyData) {
      if (typeof setMusicQueue === 'function') {
        // Flatten and create an album list
        const albumList = Object.entries(spotifyData).flatMap(([artistName, artist]) => {
          return artist.albums.map((album) => ({
            artist: artistName,
            album: album
          }));
        });
  
        // Set the albums list to the state
        setAlbums(albumList);
      }
    }
  }, [spotifyData, setMusicQueue]);
  
  const handlePlay = (album, e) => {
    e.stopPropagation();
    if (typeof setMusicQueue === 'function') {
      setMusicQueue(album);
    } else {
      console.error('setMusicQueue is not a function');
    }
  };

  const handleAlbumClick = (album) => {
    setCurrentAlbum(album);
    navigate("/album");
  };

  // Demo playlists to match the reference images
  const playlists = [
    { id: 1, name: "Liked Songs", type: "Playlist", owner: "4 songs", image: null, isLiked: true },
    { id: 2, name: "My Playlist #4", type: "Playlist", owner: "HP", image: albums[0]?.album.image },
    { id: 3, name: "DAY6 Mix", type: "Playlist", owner: "Spotify", image: albums[1]?.album.image },
    { id: 4, name: "Study", type: "Playlist", owner: "HP", image: albums[2]?.album.image },
    { id: 5, name: "Workout", type: "Playlist", owner: "HP", image: albums[3]?.album.image },
    { id: 6, name: "Before You Exit", type: "Artist", owner: "", image: albums[4]?.album.image },
  ];

  return (
    <div className={`fixed h-screen overflow-y-auto bg-black z-10 overflow-hidden transition-all duration-300 ${!collapsed ? 'w-64' : 'w-16'}`}>
      <div className={`bg-black h-full flex flex-col ${!collapsed ? 'px-4' : 'px-2'}`}>
        {/* Library Header with Library Icon and Add Button */}
        <div className="flex items-center space-x-3 py-4">
          <div 
            className={`flex items-center justify-center cursor-pointer group ${collapsed? 'm-auto':'ml-1'}`}
            onClick={handleCollapse}
          >
            <BsFillGridFill className="text-gray-400 text-xl group-hover:text-white transition-colors" />
          </div>
          
          {!collapsed && (
            <span className="text-white font-bold">Your Library</span>
          )}

          {!collapsed && (
            <div className="ml-auto">
              <div className="bg-gray-900 hover:bg-gray-800 transition-colors rounded-full p-2 cursor-pointer">
                <FaPlus className="text-white text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs - Only show when expanded */}
        {!collapsed && (
          <div className="flex gap-2 mt-4 mb-4 overflow-x-auto scrollbar-none">
            {["Playlists", "Artists", "Albums", "Podcasts"].map((category) => (
              <button
                onClick={() => handleCategory(category)}
                key={category}
                className={`truncate px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                  ${selectedCategory === category
                    ? 'bg-green-500 text-white hover:text-gray-500' 
                    : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Search and Recents - Only show when expanded */}
        {!collapsed && (
          <div className="flex justify-between items-center mb-4">
            <div className="cursor-pointer hover:bg-gray-800 rounded-full p-1.5">
              <FaSearch className="text-gray-400 text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Recents</span>
              <div className="cursor-pointer hover:bg-gray-800 rounded-full p-1">
                <FaList className="text-gray-400 text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Playlist Items */}
        <div className="flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="bg-green-200 m-auto space-y-2">
            {collapsed && (
                <button className="bg-gray-900 hover:bg-gray-800 transition-colors rounded-full p-2 cursor-pointer">
                <FaPlus className="text-white text-sm" />
              </button>
            )}
              {playlists.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-3 p-2 ${!collapsed ? 'hover:bg-gray-800/50' : 'm-auto hover:bg-gray-800'} rounded-md cursor-pointer transition-colors`}
                  onClick={() => handleAlbumClick(item)}
                >
                  {/* Images or Icon */}
                  {item.isLiked ? (
                    <div className={`flex-shrink-0 ${collapsed ? 'w-10 h-10' : 'm-auto w-12 h-12'} bg-gradient-to-br from-purple-600 to-blue-400 flex items-center justify-center rounded-sm`}>
                      <FaHeart className="text-white text-lg" />
                    </div>
                  ) : (
                    <div className={`flex-shrink-0 ${collapsed ? 'w-10 h-10' : 'm-auto w-12 h-12'}`}>
                      <img 
                        src={item.image || "/placeHolders/placeHolderIcon.jpeg"} 
                        alt={item.name} 
                        className={`object-cover ${item.type === "Artist" ? "rounded-full" : "rounded-sm"} w-full h-full`}
                      />
                    </div>
                  )}
                  
                  {/* Text Info - Only show when expanded */}
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">{item.name}</div>
                      <div className="text-gray-400 text-xs flex items-center">
                        <span>{item.type}</span>
                        {item.owner && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{item.owner}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;