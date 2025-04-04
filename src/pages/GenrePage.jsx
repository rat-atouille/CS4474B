import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import songData from '../assets/data/data.json';
import podcastData from '../assets/data/podcastData.json';
import { IoChevronBackOutline } from "react-icons/io5";

// List of genres that should show podcasts instead of songs
const PODCAST_GENRES = [
  "art", "beauty", "book", "business", "comedy", "crime", 
  "design", "documentary", "educational", "fiction", "film", 
  "finance", "fitness", "games", "history", "news", 
  "pop culture", "science", "sport", "top"
];

const GenrePage = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [filteredContent, setFilteredContent] = useState([]);
  const [contentType, setContentType] = useState('songs'); // 'songs' or 'podcasts'

  useEffect(() => {
    const lowerGenre = genre.toLowerCase();
    const isPodcastGenre = PODCAST_GENRES.includes(lowerGenre);

    if (isPodcastGenre) {
      // Filter podcasts
      const podcasts = [];
      Object.entries(podcastData).forEach(([podcastName, podcast]) => {
        if (podcast.genres && podcast.genres.some(g => g.toLowerCase() === lowerGenre)) {
          podcasts.push({
            type: 'podcast',
            name: podcastName,
            image: podcast.image,
            artist: podcast.publisher,
            album: podcast.episodes[0]?.name || 'No episodes',
            releaseDate: podcast.episodes[0]?.releaseDate || ''
          });
        }
      });

      const sortedPodcasts = podcasts.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredContent(sortedPodcasts);
      setContentType('podcasts');
    } else {
      // Filter songs
      const songs = [];
      Object.values(songData).forEach(artist => {
        if (artist.genres && artist.genres.some(g => g.toLowerCase() === lowerGenre)) {
          artist.albums.forEach(album => {
            album.songs.forEach(song => {
              songs.push({
                type: 'song',
                ...song,
                artist: artist.name,
                album: album.name
              });
            });
          });
        }
      });

      const sortedSongs = songs.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredContent(sortedSongs);
      setContentType('songs');
    }
  }, [genre]);

  const handleContentClick = (item) => {
    if (item.type === 'podcast') {
      // Navigate to podcast page with podcast name as query parameter
      navigate(`/podcast?name=${encodeURIComponent(item.name)}`);
    } else {
      // Handle song click (you can implement this later)
      console.log('Song clicked:', item.name);
    }
  };

  return (
    <div className="genre-page bg-[#212121] min-h-screen">
      <div className='flex gap-3 items-center p-4'>
        <button 
          className='cursor-pointer py-1 px-3 rounded-2xl font-semibold text-md bg-green-500 flex items-center'
          onClick={() => navigate('/browse', { replace: true })}
        >
          <IoChevronBackOutline className="mr-1" /> Back
        </button>
        <h1 className="ml-2 font-bold text-2xl capitalize text-white">{genre}</h1>      
      </div>
      
      {filteredContent.length === 0 ? (
        <p className="text-xl p-6 text-white">
          No {contentType} found for this genre.
        </p>
      ) : (
        <div className="flex flex-wrap mx-5 px-6"> {/* Removed mt-4 and py-2 */}
          {filteredContent.map((item, index) => (
            <div 
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 group" 
              key={index}
              onClick={() => handleContentClick(item)}
            >
              <div className="rounded-lg overflow-hidden cursor-pointer h-full flex flex-col items-center relative hover:bg-[#535353] transition-all duration-300">
                <div className="p-2 relative w-full">
                  <img 
                    src={item.image} 
                    alt={`${item.name} cover`} 
                    className="w-full aspect-square object-cover rounded-md mx-auto group-hover:opacity-60 transition-opacity duration-300"
                  />
                  <button
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 bg-black rounded-full transition-all ease-in-out"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add play functionality here
                    }}
                  >
                    <i className="fa-solid fa-circle-play text-4xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                  </button>
                </div>
                <div className="p-2 text-center w-full">
                  <p className="font-medium truncate text-white">{item.name}</p>
                  <p className="text-sm text-gray-400 truncate">
                    {item.type === 'podcast' ? item.artist : `by ${item.artist}`}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {item.type === 'podcast' ? `Latest: ${item.album}` : item.album}
                  </p>
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