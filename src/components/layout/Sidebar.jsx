import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import spotifyData from "../../assets/data/data.json";
import { useAlbum } from "../../context/AlbumContext";

function Sidebar({ collapsed, setCollapsed, setMusicQueue }) {
  const [albums, setAlbums] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [, setCurrentAlbum] = useAlbum();
  const navigate = useNavigate();

  // Sample data
  const data = [
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2020" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2021" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2022" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2023" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2024" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2020" },
  ];

  useEffect(() => {
    console.log("Sidebar collapsed state changed:", collapsed);
  }, [collapsed]);

  const handleCategory = (category) => {
    // Toggle category selection
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  }

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
  
        // Shuffle the album list
        const shuffledAlbumList = [...albumList]; // Create a copy of the album list
        for (let i = shuffledAlbumList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledAlbumList[i], shuffledAlbumList[j]] = [shuffledAlbumList[j], shuffledAlbumList[i]]; // Swap elements
        }
  
        // Set the shuffled albums list to the state
        setAlbums(shuffledAlbumList);
      }
    }
  }, [spotifyData]);
  
  const handlePlay = (album) => {
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

  return (
      <div className={`fixed h-screen overflow-y-auto mt-[10vh] md:mt-[5vw] bg-black z-10 overflow-hidden ${!collapsed ? 'w-1/4' : '1/6'}`}>
      <div className={`bg-black h-full flex flex-col ${!collapsed ? 'mx-6' : 'mx-2 justify-center items-center'} justify-center items-center`}>
        {/* Collapse Toggle */}
        <div
          onClick={handleCollapse} 
          className={` size-5 mb-3  flex justify-center items-center
            cursor-pointer text-white ${!collapsed ? 'self-end' : 'self-center'}`}
        >
          {collapsed ? 
            <LuChevronsRight  color="white" size={20} />
            : 
            <LuChevronsLeft  color="white" size={20} />
            }
        </div>
        

        {/* Header */}
        {!collapsed && (
          <div className="flex justify-between items-center mb-6 w-full">
            <div className="flex items-center space-x-4">
              <i className="fas fa-book text-white"></i>
              <span className="hidden md:block text-white font-bold">Your Library</span>
            </div>
            <div className="flex space-x-4">
              <i className="fas fa-plus text-white cursor-pointer"></i>
              <i className="fas fa-arrow-right text-white cursor-pointer"></i>
            </div>
          </div>
        )}

        {/* Collapsed Header */}
        {collapsed && (
          <div className="flex flex-col items-center space-y-4">
            <i className="fas fa-plus text-white cursor-pointer"></i>
          </div>
        )}

        {/* Category Buttons */}
        {!collapsed && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6 w-full">
            {["Playlists", "Artists", "Albums", "Podcasts"].map((category) => (
              <button
                onClick={() => handleCategory(category)}
                key={category}
                className={`
                  text-2 md:text-3 lg:text-xs font-semibold
                  py-1 md:py-2 rounded cursor-pointer 
                  transition-all duration-300 ease-in-out 
                  ${selectedCategory === category 
                    ? 'bg-green-500 text-gray-700 hover:text-gray-500' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Search and Recents */}
        {!collapsed && (
          <div className="flex justify-between items-center w-full mb-4">
            <i className="fas fa-search text-white cursor-pointer"></i>
            <div className="flex items-center space-x-2">
              <span className="hidden md:block text-white">Recents</span>
              <i className="fas fa-list text-white cursor-pointer"></i>
            </div>
          </div>
        )}

        {/* Item Container with Scrolling */}
        <div className={`flex-grow overflow-hidden w-full`}>
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-black">
            <div className={`
              space-y-4 bg-black flex flex-col justify-center md:justify-normal
              ${!collapsed ? 'mt-2' : 'mt-8'}
            `}>
              {albums
                // .filter(item => 
                //   !selectedCategory || 
                //   // You can add more filtering logic here if needed
                //   item.year === selectedCategory
                // )
                .map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 hover:bg-gray-800 p-2 rounded-md transition-colors group"
                    onClick={() => handleAlbumClick(item)}
                  >
                  <div 
                    className={`relative ${collapsed ? 'w-10 h-10' : 'w-14 h-14 2xl:w-20 2xl:h-20'}`} 
                    onClick={() => (collapsed ? handleAlbumClick(item) : handlePlay(item))}>
                      {/* Square Image */}
                      <img 
                        src={item.album.image} 
                        alt={item.name} 
                        className="object-cover rounded-sm"
                      />
                      {/* Play Button with opacity effect on hover */}
                      <div className={`${!collapsed ? "block" : "hidden"} absolute inset-0 flex justify-center items-center bg-black opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                      <div className={`${!collapsed ? "block" : "hidden"} absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <i className="fa-solid fa-play z-10 text-3xl text-gray-100 hover:scale-105 hover:text-white transition-all duration-150 ease-in-out"></i>
                      </div>
                      
                    </div>

                    {/* Text Info */}
                    {!collapsed && (
                      <div className={`flex-1 ${!collapsed ? 'hidden md:block' : ''} select-none`}>
                        <span className="text-white font-semibold 2xl:text-lg text-xs break-words">{item.album.name}</span>
                        <div className="text-gray-400 2xl:text-lg text-xs">{item.artist}</div>
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