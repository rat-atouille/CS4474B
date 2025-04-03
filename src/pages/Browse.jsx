import { songData, podcastData, audiobookData } from "../assets/Browse/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BrowsePage = () => {   
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const handleClick = (buttonName) => {
    setActiveFilter(buttonName);
  };

  const handleGenreClick = (genre) => {
    navigate(`/genre/${genre}`);
  };
  
  // Function to pick what is displayed
  const getData = () => {
    switch (activeFilter) {
      case 'Music':
        return songData;
      case 'Podcast':
        return podcastData;
      case 'Audiobooks':
        return audiobookData;
      default: 
        return [...songData, ...podcastData, ...audiobookData];
    }
  };

  const dataToDisplay = getData();

  return (
    <div className="bg-[#212121] min-h-screen flex flex-col">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mt-7 ml-4">
        <button className={`px-4 py-1 rounded-2xl font-semibold cursor-pointer ${activeFilter === "All" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={()=>handleClick("All")}>
          All
        </button>
        <button className={`px-4 py-1 rounded-2xl font-semibold cursor-pointer ${activeFilter === "Music" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={()=>handleClick("Music")}>
          Music
        </button>
        <button className={`px-4 py-1 rounded-2xl font-semibold cursor-pointer ${activeFilter === "Podcast" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={()=>handleClick("Podcast")}>
          Podcast
        </button>
        <button className={`px-4 py-1 rounded-2xl font-semibold cursor-pointer ${activeFilter === "Audiobooks" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={()=>handleClick("Audiobooks")}>
          Audiobooks
        </button>
      </div>
      
      {/* Content Grid */}
      <div className="mb-4 bg-[#212121]">
        <h1 className="ml-4 my-5 font-bold text-2xl">Genres</h1>
        <div className="flex flex-wrap mx-5 px-6 py-2">
          {dataToDisplay.map((item, index) => (
            <div 
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 group" 
              key={index}
              onClick={() => handleGenreClick(item.genre)}
            >
              <div className="rounded-lg overflow-hidden cursor-pointer h-full flex flex-col items-center relative hover:bg-[#535353] transition-all duration-300">
                {/* Square Image Container with left crop and zoom */}
                <div className="relative w-full pb-[100%] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={`${item.name || item.title} cover`} 
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-md group-hover:opacity-60 transition-opacity duration-300"
                    style={{ 
                      objectPosition: 'left center',
                      transform: 'scale(1.1)',
                      transformOrigin: 'left center'
                    }}
                  />
                  <button
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all ease-in-out"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add play functionality here
                    }}
                  >
                    <div className="bg-black rounded-full p-2">
                      <i className="fa-solid fa-circle-play text-4xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                    </div>
                  </button>
                </div>
                <div className="p-2 text-center w-full">
                  <p className="font-medium truncate text-white">{item.name || item.title}</p>
                  <p className="text-sm text-gray-400 truncate">{item.artist || item.host || item.author}</p>
                  {(item.album || item.genre) && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {item.album || item.genre}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;