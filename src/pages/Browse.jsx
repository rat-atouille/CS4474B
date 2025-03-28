import { songData, podcastData, audiobookData } from "../assets/Browse/constants";
import SongCard from "../components/layout/SongCard";
import { useState } from "react";

const BrowsePage = () => {   
  const [activeFilter, setActiveFilter] = useState("All");

  const handleClick=(buttonName) => {
    setActiveFilter(buttonName);
  };
  
  const getData = () => {
    switch (activeFilter) {
      case 'Music':
        return songData;
      case 'Podcast':
        return podcastData;
      case 'Audiobooks':
        return audiobookData;
      default: 
      return [...songData, ...podcastData,...audiobookData];
    }
  };

  const dataToDisplay = getData();

    return (
      <div className="bg-[#212121] min-h-screen flex flex-col">
        <div className="flex items-center gap-2 mt-7 ml-4">
          <p className={`px-4 py-1 rounded-2xl font-semibold cursor-pointer ${activeFilter === "All" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={()=>handleClick("All")}>All</p>
          <p className={`px-4 py-1 rounded-2xl font-semibold cursor-pointer ${activeFilter === "Music" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={()=>handleClick("Music")}>Music</p>
          <p className={`px-4 py-1 rounded-2xl  font-semibold cursor-pointer ${activeFilter === "Podcast" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={()=>handleClick("Podcast")}>Podcast</p>
          <p className={`px-4 py-1 rounded-2xl font-semibold cursor-pointer ${activeFilter === "Audiobooks" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`} onClick={()=>handleClick("Audiobooks")}>Audiobooks</p>
        </div>
        <div className="mb-4">
          <h1 className="ml-4 my-5 font-bold text-2xl">Genres</h1>
          <div className="flex flex-wrap">
            {dataToDisplay.map((item, index) => (
              <div className="w-1/5 p-2" key={index}>
                <SongCard key={index} image={item.image} id={item.id}/>
              </div>
              ))}
          </div>
        </div>
      </div>
       
    );
};

export default BrowsePage; 