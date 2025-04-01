import React, { useEffect, useState } from 'react';
import { useAlbum } from '../context/AlbumContext';
import { IoPlay } from "react-icons/io5";
import { BsSoundwave } from "react-icons/bs";

export default function Album({ setMusicQueue }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playIndex, setPlayIndex] = useState(null);
  const [currentAlbum] = useAlbum();

  if (!currentAlbum) return <div className="flex justify-center items-center h-screen text-5xl text-red-500 font-extrabold tracking-widest">ERROR 404</div>;

  // Helper function to convert milliseconds to MM:SS format
  const convertToMMSS = (durationMs) => {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper function to calculate total album duration
  const totalDuration = (songs) => {
    return convertToMMSS(songs.reduce((total, song) => total + song.durationMs, 0));
  };

  const handlePlay = (album, index) => {
    if (typeof setMusicQueue === 'function') {
      setMusicQueue({ ...album, index });
    } else {
      console.error('setMusicQueue is not a function');
    }
  };  

  const togglePlay = (e, index) => {
    e.stopPropagation();
    if (playIndex === index) {
      setPlayIndex(null);
    } else {
      setPlayIndex(index);
    }
  };
  

  // Render tab content
  const renderTabContent = () => (
    <div>
      <div className="flex items-center p-0 mb-4 mt-2 text-2xl text-gray-300 space-x-4">
        <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:text-green-400 hover:scale-105 transition-all duration-300 ease-in-out"
        onClick={() => handlePlay(currentAlbum)}></i>
        <i className="fa-solid fa-shuffle hover:text-white transition-all duration-300 ease-in-out"></i>
        <i className="fa-solid fa-plus text-sm border-3 p-1 rounded-full hover:text-white transition-all duration-300 ease-in-out"></i>
        <i className="fa-solid fa-arrow-down text-sm border-3 py-1 px-1.5 rounded-full hover:text-white transition-all duration-300 ease-in-out"></i>
        <i className="text-sm hover:text-white transition-all duration-300 ease-in-out">•••</i>
      </div>
      <div className="rounded">
        <div className="rounded-lg p-3 mb-2 border-b border-gray-700">
          <div className="flex justify-between ml-3 text-gray-400">
            <div className="flex space-x-5">
              <p>#</p>
              <p>Title</p>
            </div>
            <div className="hidden md:block ml-66">Plays</div>
            <div className="mr-8"><i className="fa-regular fa-clock"></i></div>
          </div>
        </div>

        {/* Map over songs */}
        {currentAlbum.album.songs && currentAlbum.album.songs.map((song, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={(e) => togglePlay(e, index)}
            className="rounded-lg flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353] relative"
          >
            <div
              className="w-8 text-center text-gray-400 text-xs mr-3"
              onClick={() => {handlePlay(currentAlbum, index);
                (e) => togglePlay(e, index);}}
            >
              {playIndex === index ? 
                <BsSoundwave className="text-green-500 text-lg ml-2" /> : 
                (hoveredIndex === index ? <IoPlay className="text-lg ml-2" /> : index + 1)
              }
            </div>

            <div className="relative flex justify-between items-center w-full">
              <div>
                <p className="text-white text-sm w-3/5 md:w-xs">{song.name}</p>
                <p className="text-gray-400 text-sm hover:underline transition-all duration-300 ease-in-out">{currentAlbum.artist}</p>
              </div>
              <p className="hidden md:block text-sm">1,000,000</p>
              <div className="text-gray-400 mr-7 text-sm">{convertToMMSS(song.durationMs)}</div>

              {hoveredIndex === index && (
                <>
                  <div className="absolute right-18 md:right-16 lg:right-20 top-1/2 transform -translate-y-3/5 text-gray-400 cursor-pointer">
                    <i className="fa-solid fa-plus text-[6px] border-1 p-1 rounded-full hover:text-white transition-all duration-300 ease-in-out"></i>
                  </div>
                  <div className="absolute right-0 text-gray-400 text-xs cursor-pointer">•••</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="ml-3 mr-3">
        <h2 className="text-xl font-bold mb-4 mt-10">More by {currentAlbum.artist}</h2>
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Display more albums */}
          {currentAlbum.album.songs.map((album, index) => (
            <div key={index} className="p-3 rounded group">
              <div className="relative">
                <img 
                  src={album.image} 
                  alt="Song Image" 
                  className="object-cover rounded"
                />
                <button className="absolute bottom-2 right-2 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out">
                  <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                </button>
              </div>
              <p className="text-white mt-2 truncate font-semibold text-sm">{album.name}</p>
              <p className="text-gray-400 text-sm">{currentAlbum.album.releaseDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#212121] text-white w-full">
      <div className="relative h-64 bg-red-900 p-6 flex items-end space-x-4">
        <img 
          src={currentAlbum == null ? "/placeHolders/placeHolderIcon.jpeg" : currentAlbum.album.image}
          alt="Album Image" 
          className="object-cover rounded w-1/3 md:w-1/4 xl:w-1/6 z-10"
        />
        <div className="relative z-10">
          <span className="text-xs px-2 py-1 rounded-sm mb-1 inline-block select-none">Album</span>
          <h1 className="text-xl sm:text-sm md:text-3xl lg:text-4xl xl:text-5xl w-full font-bold">{currentAlbum.album.name}</h1>
          <p className="text-xs mt-2 text-[#b3b3b3] select-none">
            {currentAlbum.artist} • {currentAlbum.album.releaseDate.substring(0, 4)} • {currentAlbum.album.songs.length} songs • {totalDuration(currentAlbum.album.songs)}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
      </div>

      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}