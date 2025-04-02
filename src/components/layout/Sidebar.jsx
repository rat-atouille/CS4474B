import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaHeart, FaSearch, FaList, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import { HiViewGrid, HiMenu } from "react-icons/hi";
import { useAlbum } from "../../context/AlbumContext";
import getStructuredData from "../../../src/getStructuredData.js";

// Import the data from the specified path
import playlistData from "../../assets/data/playlistData.json";

function Sidebar({ collapsed, setCollapsed, setMusicQueue }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [, setCurrentAlbum] = useAlbum();
  const navigate = useNavigate();
  
  // State for sort option and view mode
  const [sortOption, setSortOption] = useState("Recents");
  const [viewMode, setViewMode] = useState("List");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  
  // Search functionality
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  
  // Ref for clicking outside dropdowns
  const sortDropdownRef = useRef(null);
  const viewDropdownRef = useRef(null);

  // useEffect(() => {
  //   console.log("Sidebar collapsed state changed:", collapsed);
  // }, [collapsed]);
  
  // Handle clicking outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target)) {
        setShowViewDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Focus search input when search is activated
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const handleCategory = (category) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };
  
  const handlePlay = (type, name) => {
    if (typeof setMusicQueue === 'function') {
      if (type === "Album") {
        setMusicQueue(getStructuredData("playlist-album", name, 0));
      } else if (type === "Artist") {
        setMusicQueue(getStructuredData("playlist-artist", name, 0));
      } else if (type === "Playlist") {
        if (name === "Liked Songs") {
          setMusicQueue(getStructuredData("playlist-liked", name, 0));
        } else {
          setMusicQueue(getStructuredData("playlist", name, 0));
        }
      } else {
        console.log("Error with content type.");
      }
    } else {
      console.error('setMusicQueue is not a function');
    }
  };

  const handleAlbumClick = (item) => {
    setCurrentAlbum(item);
    navigate("/album");
  };
  
  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowViewDropdown(false);
  };
  
  const toggleViewDropdown = () => {
    setShowViewDropdown(!showViewDropdown);
    setShowSortDropdown(false);
  };
  
  const handleSortOptionClick = (option) => {
    setSortOption(option);
    setShowSortDropdown(false);
  };
  
  const handleViewModeClick = (mode) => {
    setViewMode(mode);
    setShowViewDropdown(false);
  };
  
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setSearchQuery("");
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current.focus();
  };

  // Create sidebar items from the JSON data
  const generateSidebarItems = () => {
    const items = [];

    // Add Liked Songs
    if (playlistData["Liked Songs"] && playlistData["Liked Songs"].length > 0) {
      items.push({
        id: "liked-songs",
        name: "Liked Songs",
        type: "Playlist",
        owner: `${playlistData["Liked Songs"].length} songs`,
        image: null,
        isLiked: true,
        data: playlistData["Liked Songs"]
      });
    }

    // Add Playlists
    if (playlistData["Playlist"]) {
      Object.entries(playlistData["Playlist"]).forEach(([name, songs], index) => {
        items.push({
          id: `playlist-${index}`,
          name: name,
          type: "Playlist",
          owner: "You",
          image: songs[0]?.image || "/placeHolders/placeHolderIcon.jpeg",
          data: songs
        });
      });
    }

    // Add Albums
    if (playlistData["Albums"]) {
      Object.entries(playlistData["Albums"]).forEach(([name, album], index) => {
        items.push({
          id: `album-${index}`,
          name: name,
          type: "Album",
          owner: "Album",
          image: album.image || "/placeHolders/placeHolderIcon.jpeg",
          data: album
        });
      });
    }

    // Add Artists
    if (playlistData["Artist"]) {
      Object.entries(playlistData["Artist"]).forEach(([name, artist], index) => {
        items.push({
          id: `artist-${index}`,
          name: name,
          type: "Artist",
          owner: "",
          image: artist.image || "/placeHolders/placeHolderIcon.jpeg",
          data: artist
        });
      });
    }

    // Add Podcasts
    if (playlistData["Podcasts"]) {
      Object.entries(playlistData["Podcasts"]).forEach(([podcastName, podcastDetails], index) => {
        items.push({
          id: `podcast-${index}`,
          name: podcastName,
          type: "Podcast",
          owner: "Podcast",
          image: podcastDetails.image || "/placeHolders/placeHolderIcon.jpeg",
          data: { 
            name: podcastName,
            ...podcastDetails 
          }
        });
      });
    }
    
    // // Add Audiobooks (new category)
    // if (playlistData["Audiobooks"]) {
    //   Object.entries(playlistData["Audiobooks"]).forEach(([bookName, bookDetails], index) => {
    //     items.push({
    //       id: `audiobook-${index}`,
    //       name: bookName,
    //       type: "Audiobook",
    //       owner: bookDetails.author || "Unknown Author",
    //       image: bookDetails.image || "/placeHolders/placeHolderIcon.jpeg",
    //       data: { 
    //         name: bookName,
    //         ...bookDetails 
    //       }
    //     });
    //   });
    // } else {
    //   // Add sample audiobooks if none in data
    //   const sampleAudiobooks = [
    //     {
    //       id: "audiobook-sample-1",
    //       name: "The Great Gatsby",
    //       type: "Audiobook",
    //       owner: "F. Scott Fitzgerald",
    //       image: "/placeHolders/placeHolderIcon.jpeg",
    //       data: { 
    //         name: "The Great Gatsby",
    //         author: "F. Scott Fitzgerald",
    //         duration: "6h 42m"
    //       }
    //     },
    //     {
    //       id: "audiobook-sample-2",
    //       name: "To Kill a Mockingbird",
    //       type: "Audiobook",
    //       owner: "Harper Lee",
    //       image: "/placeHolders/placeHolderIcon.jpeg",
    //       data: { 
    //         name: "To Kill a Mockingbird",
    //         author: "Harper Lee",
    //         duration: "12h 17m"
    //       }
    //     }
    //   ];
      
    //   items.push(...sampleAudiobooks);
    // }

    // Filter items based on search query if search is active
    let filteredItems = items;
    if (isSearchActive && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.type.toLowerCase().includes(query) ||
        (item.owner && item.owner.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected category if one is selected
    if (selectedCategory) {
      // Convert singular category to plural for matching
      const categoryMap = {
        "Playlist": "Playlists",
        "Artist": "Artists",
        "Album": "Albums",
        "Podcast": "Podcasts",
      };
      
      // Get plural form for matching
      const categoryPlural = categoryMap[selectedCategory] || selectedCategory;
      
      filteredItems = filteredItems.filter(item => {
        // Match either plural or singular form
        return item.type === selectedCategory || 
               item.type === categoryPlural ||
               categoryMap[item.type] === selectedCategory;
      });
    }

    // Sort the items based on the selected sort option
    if (sortOption === "Alphabetical") {
      filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Recently Added") {
      // For demo purposes, just reverse the current order
      // In a real app, you'd sort by date added
      filteredItems.reverse();
    }
    // For "Recents" we'll keep the current order assuming it's already sorted by recency

    return filteredItems;
  };

  // Generate sidebar items from the JSON data
  const sidebarItems = generateSidebarItems();

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

        {/* Search Input - Only show when expanded and search is active */}
        {!collapsed && isSearchActive && (
          <div className="mb-3 relative">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search in Your Library"
                className="w-full py-1 pl-10 pr-10 bg-gray-800 text-sm truncate text-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={clearSearch}
                >
                  <FaTimes className="text-gray-400 text-sm hover:text-white" />
                </button>
              )}
            </div>
          </div>
        )}

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

        {/* Sort and View Options - Only show when expanded */}
        {!collapsed && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              
              {/* Search toggle button */}
              <div 
                className={`cursor-pointer hover:bg-gray-800 rounded-full py-1.5 px-2 ${isSearchActive ? 'bg-gray-800 text-white' : 'text-gray-400'}`} 
                onClick={toggleSearch}
              >
                <FaSearch className="text-sm" />
              </div>
            </div>
            
            <div ref={viewDropdownRef} className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={toggleViewDropdown}>
                <span className="text-gray-400 text-sm">{sortOption}</span>
                {viewMode === "List" && <FaList className="text-gray-400 text-sm" />}
                {viewMode === "Compact" && <HiMenu className="text-gray-400 text-sm" />}
                {viewMode === "Grid" && <HiViewGrid className="text-gray-400 text-sm" />}
              </div>
              
              {showViewDropdown && (
                <div className="absolute select-none right-0 top-8 w-40 bg-gray-900 rounded-md shadow-lg z-10">
                  <div className="p-1">          
                        <div className="z-30 absolute left-0 top-0 w-48 bg-gray-900 rounded-md shadow-lg">
                          <div className="p-2">
                            <div className="text-gray-400 text-xs mb-1 px-3 pt-1">Sort by</div>
                            {["Recents", "Recently Added", "Alphabetical", "Creator"].map((option) => (
                              <div 
                                key={option}
                                className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded cursor-pointer"
                                onClick={() => handleSortOptionClick(option)}
                              >
                                <span className={option === sortOption ? "text-green-500" : "text-white"}>
                                  {option}
                                </span>
                                {option === sortOption && <FaCheck className="text-green-500 text-sm" />}
                              </div>
                            ))}
                            
                            <div className="border-t border-gray-800 my-1"></div>
                            <div className="text-gray-400 text-xs mb-1 px-3 pt-1">View as</div>
                            
                            <div 
                              className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded cursor-pointer"
                              onClick={() => handleViewModeClick("Compact")}
                            >
                              <div className="flex items-center">
                                <HiMenu className="text-white mr-3" />
                                <span className={viewMode === "Compact" ? "text-green-500" : "text-white"}>
                                  Compact
                                </span>
                              </div>
                              {viewMode === "Compact" && <FaCheck className="text-green-500 text-sm" />}
                            </div>
                            
                            <div 
                              className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded cursor-pointer"
                              onClick={() => handleViewModeClick("List")}
                            >
                              <div className="flex items-center">
                                <FaList className="text-white mr-3" />
                                <span className={viewMode === "List" ? "text-green-500" : "text-white"}>
                                  List
                                </span>
                              </div>
                              {viewMode === "List" && <FaCheck className="text-green-500 text-sm" />}
                            </div>
                            
                            <div 
                              className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded cursor-pointer"
                              onClick={() => handleViewModeClick("Grid")}
                            >
                              <div className="flex items-center">
                                <HiViewGrid className="text-white mr-3" />
                                <span className={viewMode === "Grid" ? "text-green-500" : "text-white"}>
                                  Grid
                                </span>
                              </div>
                              {viewMode === "Grid" && <FaCheck className="text-green-500 text-sm" />}
                            </div>
                          </div>
                        </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No results message when search has no matches */}
        {sidebarItems.length === 0 && isSearchActive && searchQuery && !collapsed && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No results found for "{searchQuery}"</p>
            <p className="text-gray-500 text-xs mt-1">Try different keywords or check for typos</p>
          </div>
        )}

        {/* Sidebar Items */}
        <div className="flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {collapsed && (
              <div className="flex justify-center mb-2">
                <button className="bg-gray-900 hover:bg-gray-800 transition-colors rounded-full p-2 cursor-pointer">
                  <FaPlus className="text-white text-sm" />
                </button>
              </div>
            )}
            
            {viewMode === "Grid" && !collapsed ? (
              <div className="grid grid-cols-2 gap-4">
                {sidebarItems.map((item) => (
                  <div 
                  key={item.id} 
                  className="cursor-pointer ${!collapsed ? 'hover:bg-gray-800/50' : 'hover:bg-gray-800'} rounded-lg relative group"
                  onClick={() => handleAlbumClick(item)}
                >
                  {/* Play button container, appears on hover */}
                  <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
                    <button className="mt-7 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents click from bubbling up
                        handlePlay(item.type, item.name);
                      }}>
                      <i className="fa-solid fa-play text-5xl text-white transform transition-transform duration-150 ease-in-out hover:scale-110"></i>
                    </button>
                  </div>
                    {/* Grid View Item */}
                    <div className="rounded-md overflow-hidden bg-gray-800/30 hover:bg-gray-800/70 transition-colors">
                      {item.isLiked ? (
                        <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-400 flex items-center justify-center">
                          <FaHeart className="text-white text-3xl" />
                        </div>
                      ) : (
                        <img 
                          src={item.image || "/placeHolders/placeHolderIcon.jpeg"} 
                          alt={item.name} 
                          className={`w-full aspect-square object-cover ${item.type === "Artist" ? "rounded-full" : ""}`}
                        />
                      )}
                      <div className="p-2">
                        <div className="text-white font-medium text-sm truncate">{item.name}</div>
                        <div className="text-gray-400 text-xs">{item.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === "Compact" && !collapsed ? (
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="px-2 py-1.5 hover:bg-gray-800/50 rounded-md cursor-pointer transition-colors"
                    onClick={() => handleAlbumClick(item.name)}
                  >
                    {/* Compact View Item (no images) */}
                    <div className="text-white text-sm truncate">{item.name}</div>
                    <div className="text-gray-400 text-xs">{item.type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* Regular List View */}
                {sidebarItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-3 p-2 relative group ${!collapsed ? 'hover:bg-gray-800/50' : 'hover:bg-gray-800'} rounded-md cursor-pointer transition-colors`}
                    onClick={() => handleAlbumClick(item)}
                  >
                  {/* Play button container, appears on hover */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    <button className="mt-1 ml-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents click from bubbling up
                        handlePlay(item.type, item.name);
                      }}>
                      <i className="fa-solid fa-play text-3xl text-white transform transition-transform duration-150 ease-in-out hover:scale-110"></i>
                    </button>
                  </div>
                    {/* Images or Icon */}
                    {item.isLiked ? (
                      <div className={`flex-shrink-0 ${collapsed ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-purple-600 to-blue-400 flex items-center justify-center rounded-sm`}>
                        <FaHeart className="text-white text-lg" />
                      </div>
                    ) : (
                      <div className={`flex-shrink-0 ${collapsed ? 'w-10 h-10' : 'w-12 h-12'}`}>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;