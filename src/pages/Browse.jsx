import { songData, podcastData, audiobookData } from "../assets/Browse/constants";
import SongCard from "../components/SongCard.jsx";
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
        <div className="mb-4 bg-[#212121]">
          <h1 className="ml-4 my-5 font-bold text-2xl">Genres</h1>
          <div className="flex flex-wrap">
            {dataToDisplay.map((item, index) => (
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2 relative group" key={index}>
                <SongCard key={index} image={item.image} id={item.id} type={item.type} genre={item.genre}/>
                <button className="absolute bottom-6 right-6 z-10 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all ease-in-out">
                  <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all ease-in-out"></i>
                </button>
              </div>
              ))}
          </div>
        </div>
      </div>
       
    );
};

export default BrowsePage; 