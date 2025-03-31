import React, { useEffect, useState } from 'react';

export default function Album({  }) {
  const [activeTab, setActiveTab] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [playIndex, setPlayIndex] = useState(null);

  // Sample data
  const albumData = {
    name: "ANONYMOUS",
    artist: "blackbear",
    releaseDate: 2024,
    songs: [
      { id: 1, title: "DRUG DEALER", plays: "3,256,387", duration: "3:22" },
      { id: 2, title: "DRUG DEALER", plays: "3,256,387", duration: "3:22" },
      { id: 3, title: "DRUG DEALER", plays: "3,256,387", duration: "3:22" },
      { id: 4, title: "DRUG DEALER", plays: "2,845,210", duration: "4:15" },
      { id: 5, title: "DRUG DEALER", plays: "1,953,421", duration: "3:47" }
    ]
  };



  // Tab content rendering
  const renderTabContent = () => (
    <div>
      <div>
        <div className="flex items-center p-0 mb-4 mt-2 text-2xl text-gray-300 space-x-4">
            <i className="fa-solid fa-circle-play text-5xl bg-black text-green-500 hover:text-green-400 hover:scale-105 transition-all duration-300 ease-in-out"></i>
            <i className="fa-solid fa-shuffle hover:text-white transition-all duration-300 ease-in-out"></i>
            <i className="fa-solid fa-plus text-sm border-3 p-1 rounded-full hover:text-white transition-all duration-300 ease-in-out"></i>
            <i className="fa-solid fa-arrow-down text-sm border-3 py-1 px-1.5 rounded-full hover:text-white transition-all duration-300 ease-in-out"></i>
            <i className="text-sm hover:text-white transition-all duration-300 ease-in-out">•••</i>
        </div>
        <div className="rounded">
        <div className="rounded-lg p-3 mb-2 border-b border-gray-700">
            <div className="flex justify-between ml-3 text-gray-400">
                <div className='flex space-x-5'>
                    <p>#</p>
                    <p>Title</p>
                </div>
                <div className='ml-8'>Plays</div>
                <div className='mr-8'><i className="fa-regular fa-clock"></i></div>
            </div>
            </div>

            {albumData.songs.map((song, index) => (
            <div
                key={song.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="rounded-lg  flex items-center p-3 border-b border-gray-700 hover:cursor-pointer hover:bg-[#535353] relative"
            >
                <div
                className="w-8 text-center text-gray-400 mr-3"
                onClick={() => {
                    if (playIndex === index) {
                    setPlayIndex(null);
                    } else {
                    setPlayIndex(index);
                    }
                }}
                >
                {hoveredIndex === index ? (playIndex === index ? '||' : '▸') : index + 1}
                </div>

                <div className="relative flex justify-between items-center w-full">
                    <div>
                        <p className="text-white">{song.title}</p>
                        <p className="text-gray-400 text-sm hover:underline transition-all duration-300 ease-in-out">{albumData.artist}</p>
                    </div>
                    <p>{song.plays}</p>
                    <div className="text-gray-400 mr-7">{song.duration}</div>

                    {hoveredIndex === index && (
                        <>
                        <div className="absolute right-20 top-1/2 transform -translate-y-3/5 text-gray-400 cursor-pointer">
                            <i className="fa-solid fa-plus text-[6px] border-1 p-1 rounded-full hover:text-white transition-all duration-300 ease-in-out"></i>
                        </div>
                        <div className="absolute right-4 text-gray-400 text-xs cursor-pointer">
                            •••
                        </div>
                        </>
                    )}
                    </div>
            </div>
            ))}

        </div>
      </div>
      <div className="ml-3 mr-3">
        <h2 className="text-xl font-bold mb-4 mt-10">More by {albumData.artist}</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8">
          {albumData.songs.map((album, index) => (
            <div key={index} className="p-3 rounded group">
                <div className="relative">
                    <img 
                    src="/placeHolders/placeHolderIcon.jpeg" 
                    alt="Song Image" 
                    className="object-cover rounded"
                    />
                    <button className="absolute bottom-2 right-2 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out">
                    <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                    </button>
                </div>
                <p className="text-white mt-2 truncate font-semibold text-sm">{album.title}</p>
                <p className="text-gray-400 text-sm">{albumData.releaseDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#212121] text-white w-full">
      <div className="relative h-64 bg-red-900 p-6 flex space-x-4 items-end">
      <img 
          src="/placeHolders/placeHolderIcon.jpeg" 
          alt="Song Image" 
          className="object-cover rounded w-1/3 md:w-1/6 z-10"
        />
        <div className="relative z-10">
          <span className="text-xs px-2 py-1 rounded-sm mb-1 inline-block select-none">
            Album
          </span>
          <h1 className="text-4xl md:text-6xl font-bold">{albumData.name}</h1>
          <p className="text-xs mt-2 text-[#b3b3b3] select-none">{albumData.artist} • {albumData.releaseDate} • {albumData.songs.length} songs • 50min 56 sec</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
      </div>

      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}
