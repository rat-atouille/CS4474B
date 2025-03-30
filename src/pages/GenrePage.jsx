import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import data from '../assets/data/data.json';
import podcastThumbnail from '../assets/Podcast/sample_thumbnail.png';

const GenrePage = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);

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
      setFilteredData(podcastData.sport || []);
      return;
    }

    // Regular music data handling
    const filteredArtists = Object.values(data)
      .filter(artist => artist.genres.includes(lowerGenre))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(artist => ({
        ...artist,
        albums: artist.albums
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(album => ({
            ...album,
            songs: album.songs.sort((a, b) => a.name.localeCompare(b.name))
          }))
      }));

    setFilteredData(filteredArtists);
  }, [genre.toLowerCase()]);

  const handlePodcastClick = () => {
    navigate('/podcast'); // Navigate to podcast page when clicked
  };

  return (
    <div className="genre-page">
      <h1 className="ml-4 my-5 font-bold text-2xl">{genre}</h1>
      
      {filteredData.length === 0 ? (
        <p style={{ fontSize: '20px', marginLeft: '16px' }}>
        No content found for this genre.
        </p>
      
      ) : genre.toLowerCase() === 'sport' ? (
        // Left-aligned clickable podcast thumbnail
        <div className="ml-4"> {/* Added ml-4 to match heading alignment */}
          <div 
            onClick={handlePodcastClick}
            className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
          >
            <img 
              src={podcastThumbnail} 
              alt="Podcast thumbnail" 
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
            <p className="mt-2">Click to listen</p>
          </div>
        </div>
      ) : (
        // Regular Music View (unchanged)
        <div className="flex flex-wrap">
          {filteredData.map((artist, index) => (
            artist.albums.map((album, albumIndex) => (
              album.songs.map((song, songIndex) => (
                <div 
                  key={`${index}-${albumIndex}-${songIndex}`} 
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2"
                >
                  <img src={song.image} alt={song.name} className="w-full h-10 object-cover rounded mb-2" />
                  <p>{song.name}</p>
                </div>
              ))
            ))
          ))}
        </div>
      )}
    </div>
  );
};

export default GenrePage;