import React, {useState} from 'react';
import {IoPlay, IoHeart, IoHeartOutline} from "react-icons/io5";
import {BsSoundwave} from "react-icons/bs";
import getStructuredData from "../getStructuredData.js";
import data from "../assets/data/data.json";

export default function Album({setMusicQueue}) {
  const albumName = new URL(window.location.href).searchParams.get("name");
  let currentAlbum;
  Object.entries(data).flatMap(([artistName, artist]) => {
    const album = artist.albums.find((album) => album.name === albumName)
    if (album) {
      currentAlbum = {...album, artist: artistName};
    }
  })
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playIndex, setPlayIndex] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);

  if (!currentAlbum) return <div
    className="flex justify-center items-center h-screen text-5xl text-red-500 font-extrabold tracking-widest">ERROR
    404</div>;

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

  const handlePlay = (name, index) => {
    if (typeof setMusicQueue === 'function') {
      setMusicQueue(getStructuredData("album", name, index));
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

  const toggleLike = (e, songId) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    if (likedSongs.includes(songId)) {
      setLikedSongs(likedSongs.filter(id => id !== songId));
    } else {
      setLikedSongs([...likedSongs, songId]);
    }
  };

  // Render tab content
  const renderTabContent = () => (
    <div>
      <div className="flex items-center p-0 mt-2 mb-8 text-2xl text-gray-300 space-x-4">
        <i
          className="fa-solid fa-circle-play text-5xl text-green-500 hover:text-green-400 hover:scale-105 transition-all duration-300 ease-in-out"
          onClick={() => {
            handlePlay(currentAlbum.name, 0)
          }}></i>
        <i className="fa-solid fa-shuffle hover:text-white transition-all duration-300 ease-in-out"></i>
        <i
          className="fa-solid fa-plus text-sm border-3 p-1 rounded-full hover:text-white transition-all duration-300 ease-in-out"></i>
        <i
          className="fa-solid fa-arrow-down text-sm border-3 py-1 px-1.5 rounded-full hover:text-white transition-all duration-300 ease-in-out"></i>
        <i className="text-sm hover:text-white transition-all duration-300 ease-in-out">•••</i>
      </div>
      <div className="rounded">
        <table className="w-full text-sm text-left text-gray-400">
          <thead>
          <tr className="p-3 mb-2 border-b border-gray-700">
            <th className="p-3 pl-6">#</th>
            <th className="p-3">Title</th>
            <th className="hidden md:table-cell p-3">Plays</th>
            <th className="p-3 text-center"><i className="fa-regular fa-clock"></i></th>
            <th className="p-3 text-center"></th>
          </tr>
          </thead>
          <tbody>
          {currentAlbum.songs && currentAlbum.songs.map((song, index) => (
            <tr
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                handlePlay(currentAlbum.name, index);
                togglePlay(e, index);
              }}
              className="hover:bg-[#535353] hover:cursor-pointer border-b border-gray-700">
              {/* Index / Play Icon / Soundwave */}
              <td className="w-8 text-center text-xs text-gray-400">
                {playIndex === index ? (
                  <BsSoundwave className="text-green-500 text-lg ml-2"/>
                ) : hoveredIndex === index ? (
                  <IoPlay className="text-lg ml-2"/>
                ) : (
                  index + 1
                )}
              </td>

              {/* Title and Artist */}
              <td className="text-white py-3 pr-3">
                <div>
                  <p className={`text-sm w-3/5 md:w-xs ${index === playIndex && "text-green-500"}`}>{song.name}</p>
                  <a href={`/artist/?name=${currentAlbum.artist}`}
                     className="text-gray-400 text-sm hover:underline transition-all duration-300 ease-in-out">
                    {currentAlbum.artist}
                  </a>
                </div>
              </td>

              {/* Plays */}
              <td className="hidden md:table-cell text-sm">1,000,000</td>

              {/* Duration */}
              <td className="text-gray-400 text-sm text-center">{convertToMMSS(song.durationMs)}</td>

              {/* Like Icon */}
              <td className="text-gray-400 text-center cursor-pointer" onClick={(e) => toggleLike(e, song.id)}>
                {likedSongs.includes(song.id) ? (
                  <IoHeart className="text-red-500"/>
                ) : (
                  hoveredIndex === `recent-${index}` ? <IoHeartOutline/> : null
                )}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>


      <div className="ml-3 mr-3">
        <h2 className="text-xl font-bold mb-4 mt-10">More by {currentAlbum.artist}</h2>
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Display more albums */}
          {currentAlbum.songs.map((song, index) => (
            <div key={index} className="p-3 rounded group hover:bg-neutral-600">
              <div className="relative">
                <img
                  src={song.image}
                  alt="Song Image"
                  className="object-cover rounded"
                />
                <button onClick={(e) => {
                  togglePlay(e, index)
                  handlePlay(currentAlbum.name, index)
                }}
                  className="absolute bottom-2 right-2 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out">
                  <i
                    className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                </button>
              </div>
              <p className="text-white mt-2 truncate font-semibold text-sm">{song.name}</p>
              <p className="text-gray-400 text-sm">{currentAlbum.releaseDate} • {currentAlbum.name}</p>
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
          src={currentAlbum == null ? "/placeHolders/placeHolderIcon.jpeg" : currentAlbum.image}
          alt="Album Image"
          className="object-cover rounded w-1/3 md:w-1/4 xl:w-1/6 z-10"
        />
        <div className="relative z-10">
          <span className="text-xs px-2 py-1 rounded-sm mb-1 inline-block select-none">Album</span>
          <h1
            className="text-xl sm:text-sm md:text-3xl lg:text-4xl xl:text-5xl w-full font-bold">{currentAlbum.name}</h1>
          <a href={`/artist/?name=${currentAlbum.artist}`}
             className="text-xs mt-2 text-[#b3b3b3] select-none hover:underline">
            {currentAlbum.artist} • {currentAlbum
            .releaseDate.substring(0, 4)} • {currentAlbum.songs.length} songs
            • {totalDuration(currentAlbum.songs)}
          </a>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
      </div>

      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}