// This file was used to get the data we needed for our redesign.
import axios from 'axios';

const CLIENT_ID = "1500e4eb90b34eecb403201c86d3611e";
const CLIENT_SECRET = "ea2e38c9737a43e7a6735c17315b7e7d";

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
  url.searchParams.append("q", "genre:pop");
  url.searchParams.append("type", "artist");
  url.searchParams.append("limit", "2")
  let options = {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  }

  let response = await axios.get(url.toString(), options);
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  const items = response.data.artists.items;
  items.forEach(async (artist) => {
    url = new URL(`https://api.spotify.com/v1/artists/${artist.id}/albums`);
    url.searchParams.append("limit", "2");
    response = await axios.get(url.toString(), options);
    console.log(response.data)
  })
}

(async () => {
  const access_token = await getAccessToken();
  await getArtistData(access_token);
})();



