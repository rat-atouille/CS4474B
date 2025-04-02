import {writeFileSync, readFileSync} from 'fs';

// Read the original data
const data = JSON.parse(readFileSync('./data.json', 'utf8'));

const genreMap = {};

// Iterate over each artist
for (const artistName in data) {
  const artist = data[artistName];
  const genres = artist.genres || [];

  // Collect all songs from all albums
  const songs = artist.albums?.flatMap(album =>
    album.songs.map(song => ({
      ...song,
      artist: artistName,
      album: album.name,
    }))
  ) || [];

  // Add songs to each genre
  for (const genre of genres) {
    if (!genreMap[genre]) {
      genreMap[genre] = [];
    }
    genreMap[genre].push(...songs);
  }
}

// Write the output to genreJson.json
writeFileSync('./genreJson.json', JSON.stringify(genreMap, null, 2));

console.log('genreJson.json has been created!');
