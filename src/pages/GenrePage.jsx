import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import songData from '../assets/data/data.json';
import podcastData from '../assets/data/podcastData.json';
import { IoChevronBackOutline } from "react-icons/io5";
import genreData from '../assets/data/genreJson.json'; // Import your genre JSON data

const PODCAST_GENRES = [
  "art", "beauty", "book", "business", "comedy", "crime", 
  "design", "career", "educational", "fiction", "film", 
  "finance", "fitness", "games", "history", "news", 
  "pop culture", "science", "sport", "top"
];

const GenrePage = ({ setMusicQueue, setCurrentSongIndex }) => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [filteredContent, setFilteredContent] = useState([]);
  const [contentType, setContentType] = useState('songs');

  useEffect(() => {
    const lowerGenre = genre.toLowerCase();
    const isPodcastGenre = PODCAST_GENRES.includes(lowerGenre);

    if (isPodcastGenre) {
      // Filter podcasts (unchanged)
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
      setFilteredContent(podcasts.sort((a, b) => a.name.localeCompare(b.name)));
      setContentType('podcasts');
    } else {
      // Use genreData.json for songs if available, otherwise fall back to songData
      const songs = genreData[lowerGenre] || [];
      
      // If genreData doesn't have this genre, fall back to original filtering
      if (songs.length === 0) {
        Object.values(songData).forEach(artist => {
          if (artist.genres && artist.genres.some(g => g.toLowerCase() === lowerGenre)) {
            artist.albums.forEach(album => {
              album.songs.forEach(song => {
                songs.push({
                  type: 'song',
                  ...song,
                  artist: artist.name,
                  album: album.name,
                  albumImage: album.image
                });
              });
            });
          }
        });
      } else {
        // Format songs from genreData to match expected structure
        const formattedSongs = songs.map(song => ({
          type: 'song',
          name: song.name,
          durationMs: song.durationMs,
          image: song.image,
          artist: song.artist,
          album: song.album,
          albumImage: song.image // Using same image for album cover
        }));
        setFilteredContent(formattedSongs);
        setContentType('songs');
        return;
      }
      
      setFilteredContent(songs.sort((a, b) => a.name.localeCompare(b.name)));
      setContentType('songs');
    }
  }, [genre]);

  const handleContentClick = (item) => {
    if (item.type === 'podcast') {
      navigate(`/podcast?name=${encodeURIComponent(item.name)}`);
    } else {
      // Handle song click - create music queue
      const albumTracks = filteredContent
        .filter(track => track.type === 'song' && track.album === item.album)
        .map(track => ({
          trackTitle: track.name,
          author: track.artist,
          trackDuration: `${Math.floor(track.durationMs / 60000)}:${Math.floor((track.durationMs % 60000) / 1000).toString().padStart(2, '0')}`,
          image: track.image,
          album: track.album,
          artist: track.artist
        }));

      const songIndex = albumTracks.findIndex(track => track.trackTitle === item.name);

      // Set music queue in the format your player expects
      setMusicQueue({
        structuredData: [{
          tracks: albumTracks,
          albumName: item.album,
          artistName: item.artist,
          albumImage: item.image
        }],
        index: songIndex
      });

      // Set current song index
      setCurrentSongIndex({
        index: songIndex,
        albumName: item.album
      });
    }
  };

  return (
    <div className="genre-page bg-[#212121] min-h-screen pb-[10vh]">
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
        <div className="flex flex-wrap mx-5 px-6">
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
                      handleContentClick(item);
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