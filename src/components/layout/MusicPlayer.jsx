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
          if (prev >= 195) {
            setRangeValue(0); // Reset range value to 0
            console.log("Interval completed, restarting...");
            return 195;
          }
          return prev + 1;
        });
      }, 1000); // 1000ms = 1 second
    } else {
      // Pause the animation if not playing
      clearInterval(interval);
    }

    // Clean up interval when the component unmounts or when isPlaying changes
    return () => clearInterval(interval);
  }, [isPlaying]); // Dependency on isPlaying

  useEffect(() => {
    setIsPlaying((prev) => !prev);
  }, [musicQueue]);

  // Convert range value to time (195 seconds max)
  const totalDuration = 195; // 3:15 in seconds
  const currentTimeInSeconds = (rangeValue / totalDuration) * totalDuration;
  const minutes = Math.floor(currentTimeInSeconds / 60);
  const seconds = Math.floor(currentTimeInSeconds % 60);
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Handle click on range input
  const handleRangeClick = (e) => {
    const clickPosition = e.nativeEvent.offsetX;
    const rangeWidth = e.target.offsetWidth;
    const newRangeValue = (clickPosition / rangeWidth) * 195; // Max value is 195 seconds
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
                  max="195" // Set max to 195 seconds
                  value={rangeValue} // Controlled value
                  step="1"
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-gray-300"
                  style={{
                    background: `linear-gradient(to right, white ${rangeValue / 195 * 100}%, gray ${rangeValue / 195 * 100}%)`,
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
              <span className='font-thin'>3:15</span>
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