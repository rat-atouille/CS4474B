import {writeFileSync} from 'fs';
import axios from 'axios';

// RUNNING WILL OVERWRITE THE CURRENT "data.json" FILE, DO NOT RUN IF YOU NEED CURRENT data.json FILE!!!

// Edit these limits to specify the maximum amount of "items" you want. Max limit is 50;
// BE CAREFUL: albums are pulled from artists, songs pulled from albums. So for 1 artist, you'll get
// ALBUMS_LIMIT number of albums, and for 1 album, you'll get SONGS_LIMIT number of songs. exponential growth!
// API key is not infinite so keep that in mind. Recommended: ARTISTS > ALBUMS
const ARTISTS_LIMIT = "3";
const ALBUMS_LIMIT = "5";
const SONGS_LIMIT = "7";

// The search query that we use to get the ARTISTS. Details found here: https://developer.spotify.com/documentation/web-api/reference/search
const QUERY = "all";


const finalJson = {};
const genreJson = {};

const CLIENT_ID = "1500e4eb90b34eecb403201c86d3611e";
const CLIENT_SECRET = "ea2e38c9737a43e7a6735c17315b7e7d";

const sampleAbout = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

async function getAccessToken() {
  let url = "https://accounts.spotify.com/api/token";
  let options = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
  let data = {
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }


  const response = await axios.post(url, data, options)
  return response.data.access_token;
}

async function getArtistData(access_token) {
  let url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.append("q", QUERY);
  url.searchParams.append("type", "artist");
  url.searchParams.append("limit", ARTISTS_LIMIT);

  const options = {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  }
  // ----- GETTING ARTIST -------------
  let {data: {artists: {items}}} = await axios.get(url.toString(), options);
  // --------------------------------------------

  // map resolves each individual promise, promise.all collects all promises resolved
  await Promise.all(items.map(async (artist) => {

    // ----- GETTING ALBUMS FROM ARTIST -------------
    url = new URL(`https://api.spotify.com/v1/artists/${artist.id}/albums`);
    url.searchParams.append("limit", ALBUMS_LIMIT);
    const {data: {items: albums}} = await axios.get(url.toString(), options);
    // --------------------------------------------

    finalJson[artist.name] = {
      followers: artist.followers.total,
      genres: artist.genres,
      image: artist.images[0].url,
      albums: albums.map(album => ({
        name: album.name, image: album.images[0].url, releaseDate: album.release_date,
        songs: []
      })),
      about: sampleAbout
    }

    artist.genres.forEach(genre => {
        genreJson[genre] = {songs: []};
      })

    // ------ GETTING SONGS FROM ALBUMS -----------
    await Promise.all(albums.map(async ({id, name}) => {
      let url = new URL(`https://api.spotify.com/v1/albums/${id}/tracks`)
      url.searchParams.append("limit", SONGS_LIMIT);
      const {data: {items: songs}} = await axios.get(url.toString(), options);


      // find where album should be
      const foundAlbum = finalJson[artist.name].albums.find(album => album.name === name);
      const songMapping = (song) => ({
        name: song.name,
        durationMs: song.duration_ms,
        image: foundAlbum.image
      })
      foundAlbum.songs = songs.map((song) => songMapping(song));
      // --------------------------------------------

      artist.genres.forEach(genre => {
        genreJson[genre].songs.push(songs.map((song) => songMapping(song)))
      });
    }));
  }));
}


(async () => {
  const access_token = await getAccessToken();
  await getArtistData(access_token);

  console.log(finalJson)
  // writeFileSync("newData.json", JSON.stringify(finalJson));
  writeFileSync("genreData.json", JSON.stringify(genreJson));
})();



