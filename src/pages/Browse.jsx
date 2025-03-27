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
      <div>
        <div className="flex items-center gap-2 mt-25 ml-4">
          <p className="bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center">K</p>
          <p className={`px-4 py-1 rounded-2xl cursor-pointer ${activeFilter === "All" ? "bg-white text-black" : "bg-black text-white"}`} onClick={()=>handleClick("All")}>All</p>
          <p className={`px-4 py-1 rounded-2xl cursor-pointer ${activeFilter === "Music" ? "bg-white text-black" : "bg-black text-white"}`} onClick={()=>handleClick("Music")}>Music</p>
          <p className={`px-4 py-1 rounded-2xl cursor-pointer ${activeFilter === "Podcast" ? "bg-white text-black" : "bg-black text-white"}`} onClick={()=>handleClick("Podcast")}>Podcast</p>
          <p className={`px-4 py-1 rounded-2xl cursor-pointer ${activeFilter === "Audiobooks" ? "bg-white text-black" : "bg-black text-white"}`} onClick={()=>handleClick("Audiobooks")}>Audiobooks</p>
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