import React from 'react';

export default function MusicPlayer() {
  return (
    <div className="fixed bottom-0 bg-black w-full h-[10vh] md:h-[5vw] z-10 px-4 py-2 flex items-center justify-between transition-all">
      
      {/* Song (Left) */}
      <div className="flex items-center space-x-4 h-full">
        <img 
          src="/placeHolders/placeHolderIcon.jpeg" 
          alt="Song Image" 
          className="object-cover rounded h-3/4"
        />
        <div>
          <span className="text-white font-medium text-[10px] md:text-sm">Anonymous</span>
          <div className="text-gray-400 text-[8px] md:text-xs">2019</div>
        </div>
        <i className="fa-solid fa-plus text-[8px] md:text-xs border p-1 rounded-full"></i>
      </div>

      {/* Player (Center) */}
      <div className='flex flex-col text-gray-300'>
        <div className="flex justify-center items-center text-lg space-x-4">
            <i className="fa-solid fa-shuffle hover:text-white transition-all duration-300 ease-in-out"></i>
            <i className="fa-solid fa-backward-step hover:text-white transition-all duration-300 ease-in-out"></i>
            <i className="fa-solid fa-circle-play text-white text-2xl hover:text-white transition-all duration-300 ease-in-out"></i>
            <i className="fa-solid fa-forward-step hover:text-white transition-all duration-300 ease-in-out"></i>
            <i className="fa-solid fa-repeat hover:text-white transition-all duration-300 ease-in-out"></i>
        </div>
        <div className="flex mt-2 items-center w-xs md:w-sm text-xs gap-2">
            <span className='font-thin'>0:00</span>
            <div className="flex w-full items-center gap-2">
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
            <span className='font-thin'>3:15</span>
        </div>
      </div>


      {/* Right Section */}
      <div className="flex justify-center items-center space-x-2 text-xs text-gray-300">
        <i className="fa-solid fa-music hover:text-white transition-all duration-300 ease-in-out"></i>
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
  );
}
