import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import data from '../assets/data/data.json';
import podcastThumbnail from '../assets/Podcast/sample_thumbnail.png';
import { IoChevronBackOutline } from "react-icons/io5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';

const GenrePage = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [filteredSongs, setFilteredSongs] = useState([]);

  // Local podcast data constant
  const podcastData = {
    sport: [
      {
        id: "sport-podcast-1",
        image: podcastThumbnail,
        episodes: [
          {
            title: "Championship Analysis",
          }
        ]
      }
    ]
  };

  useEffect(() => {
    const lowerGenre = genre.toLowerCase();
    
    // Special case for sport genre
    if (lowerGenre === 'sport') {
      setFilteredSongs(podcastData.sport || []);
      return;
    }

    // Collect all songs matching the genre
    const songs = [];
    Object.values(data).forEach(artist => {
      if (artist.genres && artist.genres.some(g => g.toLowerCase() === lowerGenre)) {
        artist.albums.forEach(album => {
          album.songs.forEach(song => {
            songs.push({
              ...song,
              artist: artist.name,
              album: album.name
            });
          });
        });
      }
    });

    // Sort songs alphabetically by song name
    const sortedSongs = songs.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredSongs(sortedSongs);
  }, [genre]);

  const handlePodcastClick = () => {
    navigate('/podcast');
  };

  return (
    <div className="genre-page bg-[#212121] min-h-screen">
      <div className='flex gap-3 items-center p-4'>
        <button 
          className='cursor-pointer py-1 px-3 rounded-2xl font-semibold text-md bg-green-500 flex items-center'
          onClick={()=>navigate('/browse', {replace: true})}
        >
          <IoChevronBackOutline className="mr-1" /> Back
        </button>
        <h1 className="ml-2 font-bold text-2xl capitalize text-white">{genre}</h1>      
      </div>
      
      {filteredSongs.length === 0 ? (
        <p className="text-xl p-6 text-white">
          No content found for this genre.
        </p>
      ) : genre.toLowerCase() === 'sport' ? (
        <div className="p-4">
          <div 
            onClick={handlePodcastClick}
            className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
          >
            <img 
              src={podcastThumbnail} 
              alt="Podcast thumbnail" 
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap px-6 py-2">
          {filteredSongs.map((song, index) => (
            <div 
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 relative group" 
              key={index}
            >
              <div className="rounded-lg overflow-hidden cursor-pointer h-full flex flex-col items-center relative">
                {/* Image container with play button */}
                <div className="p-2 relative">
                  <img 
                    src={song.image} 
                    alt={`${song.name} cover`} 
                    className="w-full aspect-square object-cover rounded-md mx-auto max-w-[120px] group-hover:opacity-70 transition-opacity"
                  />
                  <div 
                    className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all ease-in-out"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add play functionality here
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={faCirclePlay} 
                      className="text-3xl text-green-500 hover:scale-105 transition-transform" 
                    />
                  </div>
                </div>
                
                {/* Text info */}
                <div className="p-2 text-center w-full">
                  <p className="font-medium truncate text-white">{song.name}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{song.album}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenrePage;