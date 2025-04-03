import React, {useEffect, useState} from 'react';
import {IoPlay, IoHeart, IoHeartOutline} from 'react-icons/io5';
import {FaHeart} from "react-icons/fa";
import {BsSoundwave} from 'react-icons/bs';
import getStructuredData from '../getStructuredData.js';
import {Link, useLocation} from "react-router-dom";


export default function Album({setMusicQueue, currentSong}) {
  const location = useLocation();
  const albumName = new URL(window.location.href).searchParams.get('name');
  const albumType = new URL(window.location.href).searchParams.get('type');

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playIndex, setPlayIndex] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);

  useEffect(() => {
    if (albumName && albumType) {
      if (albumType === 'Playlist') {
        if (albumName === 'Liked Songs') {
          setCurrentAlbum(getStructuredData('playlist-liked', albumName, 0));
        } else {
          setCurrentAlbum(getStructuredData('playlist', albumName, 0));
        }
      } else {
        setCurrentAlbum(getStructuredData('album', albumName, 0));
      }
    }

    console.log(currentAlbum);
  }, [location]);

  if (!currentAlbum) return <div></div>;

  const convertToMMSS = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  function totalDuration(tracks) {
    let totalSeconds = tracks.reduce((sum, track) => {
      let [minutes, seconds] = track.trackDuration.split(':').map(Number);
      return sum + minutes * 60 + seconds;
    }, 0);

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return hours > 0
      ? `${hours}:${convertToMMSS(minutes * 60 + seconds)}`
      : convertToMMSS(totalSeconds);
  }


  const handlePlay = (name, index) => {
    if (typeof setMusicQueue === 'function') {
      setMusicQueue(getStructuredData('album', name, index));
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
      setLikedSongs(likedSongs.filter((id) => id !== songId));
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
            handlePlay(currentAlbum.structuredData[0].tracks[0].name, 0);
          }}
        ></i>
        <i className="fa-solid fa-shuffle hover:text-white transition-all duration-300 ease-in-out"></i>
        <i
          className="fa-solid fa-plus text-sm border-3 p-1 rounded-full hover:text-white transition-all duration-300 ease-in-out"
        ></i>
        <i
          className="fa-solid fa-arrow-down text-sm border-3 py-1 px-1.5 rounded-full hover:text-white transition-all duration-300 ease-in-out"
        ></i>
        <i className="text-sm hover:text-white transition-all duration-300 ease-in-out">•••</i>
      </div>
      <div className="rounded">
        <table className="w-full text-sm text-left text-gray-400">
          <thead>
          <tr className="p-3 mb-2 border-b border-gray-700">
            <th className="p-3 pl-6">#</th>
            <th className="p-3">Title</th>
            <th className="hidden md:table-cell p-3">Plays</th>
            <th className="p-3 text-center">
              <i className="fa-regular fa-clock"></i>
            </th>
            <th className="p-3 text-center"></th>
          </tr>
          </thead>
          <tbody>
          {currentAlbum.structuredData[0].tracks.map((song, index) => (
            <tr
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                handlePlay(currentAlbum.structuredData[0].tracks[0].name, index);
                togglePlay(e, index);
              }}
              className="hover:bg-[#535353] hover:cursor-pointer border-b border-gray-700"
            >
              {/* Index / Play Icon / Soundwave */}
              <td className="w-8 text-center text-xs text-gray-400">
                {(currentSong.index === index && currentSong.albumName === currentAlbum.structuredData[0].tracks[0].name) ? (
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
                  <p
                    className={`text-sm w-3/5 md:w-xs ${(currentSong.index === index && currentSong.albumName === currentAlbum.structuredData[0].tracks[0].name) && 'text-green-500'}`}>
                    {song.trackTitle}
                  </p>
                  <Link to={`/artist/?name=${currentAlbum.artist}`}
                        href={`/artist/?name=${currentAlbum.artist}`}
                        className="text-gray-400 text-sm hover:underline transition-all duration-300 ease-in-out"
                  >
                    {currentAlbum.artist}
                  </Link>
                </div>
              </td>

              {/* Plays */}
              <td className="hidden md:table-cell text-sm">1,000,000</td>

              {/* Duration */}
              <td className="text-gray-400 text-sm text-center">{song.trackDuration}</td>

              {/* Like Icon */}
              <td className="text-gray-400 text-center cursor-pointer" onClick={(e) => toggleLike(e, song.trackTitle)}>
                {likedSongs.includes(song.trackTitle) ? (
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
          {currentAlbum.structuredData[0].tracks.map((song, index) => (
            <div key={index} className="p-3 rounded group hover:bg-neutral-600">
              <div className="relative">
                <img src={song.image} alt="Song Image" className="object-cover rounded"/>
                <button
                  onClick={(e) => {
                    togglePlay(e, index);
                    handlePlay(currentAlbum.structuredData[0].tracks[0].name, index);
                  }}
                  className="absolute bottom-2 right-2 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                >
                  <i
                    className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                </button>
              </div>
              <p className="text-white mt-2 truncate font-semibold text-sm">{song.trackTitle}</p>
              <p className="text-gray-400 text-sm">
                {currentAlbum.releaseDate} • {currentAlbum.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#212121] text-white w-full">
      <div className="relative h-64 bg-red-900 p-6 flex items-end space-x-4">
        {albumName === "Liked Songs" ? (
          <div
            className={`flex-shrink-0 w-1/3 md:w-1/4 xl:w-1/6 aspect-[1/1] z-10 bg-gradient-to-br from-purple-600 to-blue-400 flex items-center justify-center rounded-sm`}
          >
            <FaHeart className="text-white text-6xl"/>
          </div>
        ) : (
          <img
            src={currentAlbum == null ? '/placeHolders/placeHolderIcon.jpeg' : currentAlbum.structuredData[0].tracks[0].image}
            alt="Album Image"
            className="object-cover w-1/3 md:w-1/4 xl:w-1/6 aspect-[1/1] rounded z-10"
          />
        )}
        <div className="relative z-10">
          <span className="text-xs px-2 py-1 rounded-sm mb-1 inline-block select-none">{albumType}</span>
          <h1 className="text-xl sm:text-sm md:text-3xl lg:text-4xl xl:text-5xl w-full font-bold">{albumName}</h1>
          <div className="text-xs mt-2 text-[#b3b3b3]">
            {albumType === "Playlist" ? (
              <>
                <span>You</span>
                &nbsp;• 2024 • {totalDuration(currentAlbum.structuredData[0].tracks)}
              </>
            ) : (
              <>
                <Link
                  to={`/artist/?name=${currentAlbum.structuredData[0].tracks[0].author}`}
                  href={`/artist/?name=${currentAlbum.structuredData[0].tracks[0].author}`}
                  className="select-none hover:underline"
                >
                  {currentAlbum.structuredData[0].tracks[0].author}
                </Link>
                &nbsp;• 2024 • {currentAlbum.structuredData[0].tracks.length} songs
                • {totalDuration(currentAlbum.structuredData[0].tracks)}
              </>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
      </div>

      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}
