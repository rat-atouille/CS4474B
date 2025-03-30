import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import data from '../assets/data/data.json'; 

const GenrePage = () => {
  const { genre } = useParams();  // Get the genre parameter from the URL
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Filter the data based on the genre
    const filteredArtists = Object.values(data)
      .filter(artist => artist.genres.includes(genre.toLowerCase()))
      // Sort artists A-Z
      .sort((a, b) => a.name.localeCompare(b.name))
      // Sort albums A-Z per artist
      .map(artist => ({
        ...artist,
        albums: artist.albums
          .sort((a, b) => a.name.localeCompare(b.name))
          // Sort songs A-Z per album
          .map(album => ({
            ...album,
            songs: album.songs.sort((a, b) => a.name.localeCompare(b.name))
          }))
      }));

    setFilteredData(filteredArtists);
  }, [genre.toLowerCase()]);

  return (
    <div className="genre-page">
      <h1 className="ml-4 my-5 font-bold text-2xl">{genre}</h1>
      {filteredData.length === 0 ? (
        <p>No content found for this genre.</p>
      ) : (
        <div className="flex flex-wrap">
          {filteredData.map((artist, index) => (
            artist.albums.map((album, albumIndex) => (
              album.songs.map((song, songIndex) => (
                <div 
                  key={`${index}-${albumIndex}-${songIndex}`} 
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2"
                >
                  <img src={song.image} alt={song.name} className="w-full" />
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