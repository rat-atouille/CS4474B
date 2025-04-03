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
      <h1 className="mx-6 mt-7 font-bold text-2xl capitalize">{genre}</h1>      
      
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
        <div className="flex flex-wrap mx-5 mt-4 px-6 py-2">
          {filteredSongs.map((song, index) => (
            <div 
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 relative group" 
              key={index}
            >
              <div className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition-colors cursor-pointer h-full flex flex-col">
                <div className="p-4 pb-2">
                  <img 
                    src={song.image} 
                    alt={`${song.name} cover`} 
                    className="w-full aspect-square object-cover rounded-md mx-auto max-w-[120px]"
                  />
                </div>
                <div className="p-3 pt-0 flex-grow">
                  <p className="font-medium truncate text-white text-center">{song.name}</p>
                  <p className="text-xs text-gray-400 truncate text-center">{song.artist}</p>
                  <p className="text-xs text-gray-500 truncate text-center mt-1">{song.album}</p>
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