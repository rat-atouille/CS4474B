import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import data from '../assets/data/data.json';
import podcastThumbnail from '../assets/Podcast/sample_thumbnail.png';
import { IoChevronBackOutline } from "react-icons/io5";

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
        <h1 className="ml-2 font-bold text-2xl capitalize">{genre}</h1>      
      </div>
      
      {filteredSongs.length === 0 ? (
        <p className="text-xl p-6">
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
        <div className="flex flex-wrap px-4">
          {filteredSongs.map((song, index) => (
            <div 
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-3 relative group" 
              key={index}
            >
              <div className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition-colors cursor-pointer h-full">
                <div className="p-4">
                  <img 
                    src={song.image} 
                    alt={`${song.name} cover`} 
                    className="w-full aspect-square object-cover rounded-md"
                  />
                </div>
                <div className="p-3 pt-0">
                  <p className="font-medium truncate text-white">{song.name}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  <p className="text-xs text-gray-500 truncate">{song.album}</p>
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