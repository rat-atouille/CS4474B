import React, { useState, useEffect } from 'react';
import isPodcast from '../../isPodcast.js';

export default function MusicPlayer({ musicQueue }) {
  const [rangeValue, setRangeValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Get current song from musicQueue (use album tracks for non-podcast items)
  let currentSong = musicQueue?.structuredData[0]?.tracks[currentSongIndex];

  // Convert trackDuration (e.g., "2:06") to total seconds
  const convertDurationToSeconds = (duration) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // When a new musicQueue is set (i.e. a new song is clicked), reset tracker and auto-play
  useEffect(() => {
    setCurrentSongIndex(musicQueue?.index || 0);
    console.log(musicQueue)
    setRangeValue(0);
    setIsPlaying(true);
  }, [musicQueue]);

  // Update the progress bar when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setRangeValue(prev => {
          const maxDuration = currentSong?.trackDuration ? convertDurationToSeconds(currentSong.trackDuration) : 0;
          if (prev >= maxDuration) {
            setRangeValue(0);
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong?.trackDuration]);

  const albumLength = musicQueue?.structuredData[0]?.tracks.length;

  const handleNext = () => {
    setCurrentSongIndex(prevIndex => (prevIndex + 1) % albumLength);
    setRangeValue(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex(prevIndex => (prevIndex - 1 + albumLength) % albumLength);
    setRangeValue(0);
    setIsPlaying(true);
  };

  const toggleShuffle = () => {
    setIsShuffling((prev) => !prev);
  }

  const toggleLoop = () => {
    setIsRepeating((prev) => !prev);
  }

  const totalDuration = currentSong ? convertDurationToSeconds(currentSong.trackDuration) : 195;
  const minutes = Math.floor(rangeValue / 60);
  const seconds = Math.floor(rangeValue % 60);
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

  const handleRangeClick = (e) => {
    const clickPosition = e.nativeEvent.offsetX;
    const rangeWidth = e.target.offsetWidth;
    const newRangeValue = (clickPosition / rangeWidth) * totalDuration;
    setRangeValue(newRangeValue);
  };

  return (
      <>
        {musicQueue && (
            <div className="fixed bottom-0 bg-black w-full h-[10vh] md:h-[5vw] overflow-x-hidden z-10 px-4 py-2 flex items-center justify-between transition-all">
              {/* Left Section: Song Info */}
              <div className="flex items-center space-x-4 md:w-1/5 h-full">
                <img
                    src={currentSong?.image || "/placeHolders/placeHolderIcon.jpeg"}
                    alt="Song Cover"
                    className="object-cover rounded h-3/4"
                />
                <div>
                <span className="text-white font-medium text-[10px]" title={currentSong?.trackTitle}>
                  {currentSong?.trackTitle.length > 30 
                    ? `${currentSong.trackTitle.substring(0, 30)}...` 
                    : currentSong?.trackTitle}
                </span>

                  <div className="text-gray-400 text-[8px] md:text-[10px]">
                    {currentSong?.author}
                  </div>
                </div>
                <i className="fa-solid fa-plus text-[8px] md:text-xs border p-1 rounded-full text-gray-300 hover:text-white transition-all duration-300 ease-in-out"></i>
              </div>

              {/* Center Section: Playback Controls */}
              <div className="flex flex-col text-gray-300">
                <div className="flex justify-center items-center text-lg space-x-4">
                  <i className={`fa-solid fa-shuffle transition-all duration-300 ease-in-out 
                  ${isShuffling ? "text-green-500 hover:text-green-300" : "text=gray-300 hover:text-white"}`}
                  onClick={toggleShuffle}></i>
                  <i
                      className="fa-solid fa-backward-step hover:text-white transition-all duration-300 ease-in-out"
                      onClick={handlePrev}
                  ></i>
                  <i
                      className={`fa-solid text-white text-2xl  transition-all duration-300 ease-in-out hover:text-green-500 ${
                          !isPlaying ? "fa-circle-play" : "fa-circle-pause"
                      }`}
                      onClick={() => setIsPlaying(!isPlaying)}
                  ></i>
                  <i
                      className="fa-solid fa-forward-step hover:text-white transition-all duration-300 ease-in-out"
                      onClick={handleNext}
                  ></i>
                  <i className={`fa-solid fa-repeat transition-all duration-300 ease-in-out 
                  ${isRepeating ? "text-green-500 hover:text-green-300" : "text=gray-300 hover:text-white"}`}
                  onClick={toggleLoop}></i>
                </div>
                <div className="flex mt-2 items-center md:w-sm text-xs gap-2">
                  <span className="font-thin">{timeFormatted}</span>
                  <div className="flex w-full items-center gap-2">
                    <input
                        type="range"
                        min="0"
                        max={totalDuration}
                        value={rangeValue}
                        step="1"
                        className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-gray-300"
                        style={{
                          background: `linear-gradient(to right, white ${(rangeValue / totalDuration) *
                          100}%, gray ${(rangeValue / totalDuration) * 100}%)`
                        }}
                        onChange={(e) => setRangeValue(e.target.value)}
                        onClick={handleRangeClick}
                    />
                    <style>
                      {`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 0;
                      height: 0;
                    }
                    input[type="range"]::-moz-range-thumb {
                      appearance: none;
                      width: 0;
                      height: 0;
                    }
                  `}
                    </style>
                  </div>
                  <span className="font-thin">
                {`${Math.floor(totalDuration / 60)}:${Math.floor(totalDuration % 60)
                    .toString()
                    .padStart(2, '0')}`}
              </span>
                </div>
              </div>

              {/* Right Section: Additional Controls */}
              <div className="flex justify-center items-center space-x-2 text-xs text-gray-300">
                <i className="fa-solid fa-music hover:text-white transition-all duration-300 ease-in-out"></i>
                <i className="fa-solid fa-bars hover:text-white transition-all duration-300 ease-in-out"></i>
                <span
                    className="material-symbols-outlined hover:text-white transition-all duration-300 ease-in-out"
                    style={{ fontSize: '18px', color: '#e3e3e3' }}
                >
              google_home_devices
            </span>
                <div className="flex space-x-2 hover:text-white transition-all duration-300 ease-in-out">
                  <i className="fa-solid fa-volume-low"></i>
                  <div className="flex w-[5vw] items-center gap-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="50"
                        step="1"
                        className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-gray-300"
                        style={{
                          background: "linear-gradient(to right, white 50%, gray 50%)"
                        }}
                        onInput={(e) => {
                          const value = e.target.value;
                          e.target.style.background = `linear-gradient(to right, white ${value}%, gray ${value}%)`;
                        }}
                    />
                    <style>
                      {`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 0;
                      height: 0;
                    }
                    input[type="range"]::-moz-range-thumb {
                      appearance: none;
                      width: 0;
                      height: 0;
                    }
                  `}
                    </style>
                  </div>
                </div>
                <span
                    className="material-symbols-outlined hover:text-white transition-all duration-300 ease-in-out"
                    style={{ fontSize: '18px', color: '#e3e3e3' }}
                >
              picture_in_picture_alt
            </span>
                <i className="fa-solid fa-up-right-and-down-left-from-center hover:text-white transition-all duration-300 ease-in-out"></i>
              </div>
            </div>
        )}
      </>
  );
}