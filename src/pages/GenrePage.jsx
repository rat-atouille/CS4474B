import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import data from '../assets/data/data.json';
import podcastThumbnail from '../assets/Podcast/sample_thumbnail.png';
import { IoChevronBackOutline } from "react-icons/io5";

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
    <div className="genre-page bg-[#212121]">
      <div className='flex gap-3 mx-3 my-5'>
        <button className='cursor-pointer py-1 px-3 rounded-2xl font-semibold text-md bg-green-500 flex'
          onClick={()=>navigate('/browse', {replace: true})}
          > <IoChevronBackOutline /> Back </button>
        <h1 className="ml-2 font-bold text-2xl"> {genre}</h1>      
      </div>
      
      {filteredData.length === 0 ? (
        <p className="text-20 ml-6 mt-8 bg-[#212121]">
          No content found for this genre.
        </p>
      
      ) : genre.toLowerCase() === 'sport' ? (
        // Left-aligned clickable podcast thumbnail
        <div className="ml-4 bg-[#212121]"> {/* Added ml-4 to match heading alignment */}
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
        // Regular Music View (unchanged)
        <div className="flex flex-wrap bg-[#212121]">
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