import React, { useState, useEffect } from 'react';

export default function MusicPlayer({ musicQueue }) {
  const [rangeValue, setRangeValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Get current song from musicQueue
  const currentSong = musicQueue?.album?.songs[currentSongIndex];

  const handlePlay = () => {
    setIsPlaying((prev) => !prev); // Toggle play/pause
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % musicQueue.album.songs.length);
    setRangeValue(0); // Reset the range when moving to the next song
  };

  const handlePrev = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + musicQueue.album.songs.length) % musicQueue.album.songs.length
    );
    setRangeValue(0); // Reset the range when going to the previous song
  };

  // Start or pause the range value animation based on isPlaying state
  useEffect(() => {
    let interval;

    if (isPlaying) {
      // Start the interval if playing
      interval = setInterval(() => {
        setRangeValue((prev) => {
          const maxDuration = currentSong?.durationMs / 1000; // Convert ms to seconds
          if (prev >= maxDuration) {
            setRangeValue(0); // Reset range value to 0
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000); // 1000ms = 1 second
    }

    // Clean up interval when the component unmounts or when isPlaying changes
    return () => clearInterval(interval);
  }, [isPlaying, currentSong?.durationMs]); // Dependency on isPlaying and song duration

  useEffect(() => {
    if (musicQueue?.index) {
      setCurrentSongIndex(musicQueue?.index);
      setRangeValue(0);
    }
    
    setIsPlaying((prev) => !prev);
  }, [musicQueue]);

  // Convert range value to time
  const totalDuration = currentSong?.durationMs / 1000 || 195; // Default to 195 seconds if no song
  const currentTimeInSeconds = (rangeValue / totalDuration) * totalDuration;
  const minutes = Math.floor(currentTimeInSeconds / 60);
  const seconds = Math.floor(currentTimeInSeconds % 60);
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Handle click on range input
  const handleRangeClick = (e) => {
    const clickPosition = e.nativeEvent.offsetX;
    const rangeWidth = e.target.offsetWidth;
    const newRangeValue = (clickPosition / rangeWidth) * totalDuration; // Max value is song duration
    setRangeValue(newRangeValue);
  };

  return (
    <>
      {musicQueue != null && (
        <div className="fixed bottom-0 bg-black w-full h-[10vh] md:h-[5vw] z-10 px-4 py-2 flex items-center justify-between transition-all">
          {/* Song (Left) */}
          <div className="flex items-center space-x-4 h-full">
            <img 
              src={musicQueue == null ? "/placeHolders/placeHolderIcon.jpeg" : musicQueue.album.image}
              alt="Song Image" 
              className="object-cover rounded h-3/4"
            />
            <div>
              <span className="text-white font-medium text-[10px] md:text-sm">{musicQueue == null ? "Song Name" : currentSong.name}</span>
              <div className="text-gray-400 text-[8px] md:text-xs">{musicQueue == null ? "Artist" : musicQueue.artist}</div>
            </div>
            <i className="fa-solid fa-plus text-[8px] md:text-xs border p-1 rounded-full text-gray-300 hover:text-white transition-all duration-300 ease-in-out"></i>
          </div>

          {/* Player (Center) */}
          <div className='flex flex-col text-gray-300'>
            <div className="flex justify-center items-center text-lg space-x-4">
              <i className="fa-solid fa-shuffle hover:text-white transition-all duration-300 ease-in-out"></i>
              <i className="fa-solid fa-backward-step hover:text-white transition-all duration-300 ease-in-out"
              onClick={handlePrev}></i>
              <i className={`fa-solid text-white text-2xl hover:text-white transition-all duration-300 ease-in-out
                ${!isPlaying ? "fa-circle-play" : "fa-circle-pause"}`}
                onClick={handlePlay}></i>
              <i className="fa-solid fa-forward-step hover:text-white transition-all duration-300 ease-in-out"
                onClick={handleNext}></i>
              <i className="fa-solid fa-repeat hover:text-white transition-all duration-300 ease-in-out"></i>
            </div>
            <div className="flex mt-2 items-center w-xs md:w-sm text-xs gap-2">
              <span className='font-thin'>{timeFormatted}</span>
              <div className="flex w-full items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={totalDuration} // Max value is the actual song duration
                  value={rangeValue} // Controlled value
                  step="1"
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-gray-300"
                  style={{
                    background: `linear-gradient(to right, white ${rangeValue / totalDuration * 100}%, gray ${rangeValue / totalDuration * 100}%)`,
                  }}
                  onChange={(e) => setRangeValue(e.target.value)}
                  onClick={handleRangeClick} // Handle range click
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
              <span className='font-thin'>{`${Math.floor(totalDuration / 60)}:${Math.floor(totalDuration % 60).toString().padStart(2, '0')}`}</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex justify-center items-center space-x-2 text-xs text-gray-300">
            <i className="fa-solid fa-music hover:text-white transition-all duration-300 ease-in-out"></i>
            <i className="fa-solid fa-bars hover:text-white transition-all duration-300 ease-in-out"></i>
            <span 
              className="material-symbols-outlined hover:text-white transition-all duration-300 ease-in-out"
              style={{ fontSize: '18px', color: '#e3e3e3' }}
            >
              google_home_devices
            </span>
            <div className='flex space-x-2 hover:text-white transition-all duration-300 ease-in-out'>
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
                    background: "linear-gradient(to right, white 50%, gray 50%)",
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