import {writeFileSync} from "fs";
import axios from "axios";

// RUNNING WILL OVERWRITE THE CURRENT "podcastData.json" FILE, DO NOT RUN IF YOU NEED CURRENT podcastData.json FILE!!!

// TO USE:
// Edit these limits to specify the maximum amount of "items" you want. Max limit is 50;
// BE CAREFUL: episodes are pulled from podcasts. So for 1 podcast, you'll get EPISODES_LIMIT number of
// episodes. exponential growth! API key is not infinite so keep that in mind.
const PODCAST_LIMIT = "10";
const EPISODES_LIMIT = "10";

// this file uses search query but searching for podcast only makes the most sense

const finalJson = {};

const CLIENT_ID = "1500e4eb90b34eecb403201c86d3611e";
const CLIENT_SECRET = "ea2e38c9737a43e7a6735c17315b7e7d";

const podcastGenres = [
  "True Crime",
  "Comedy",
  "News & Politics",
  "Health & Fitness",
  "Business & Finance",
  "Technology",
  "Education",
  "History",
  "Sports",
  "Entertainment",
  "Science",
  "Fiction/Storytelling",
  "Parenting",
  "Self-Improvement",
  "Gaming",
  "Arts & Culture",
  "Religion & Spirituality",
  "Lifestyle",
  "Miscellaneous"
];

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}


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

async function getPodcasts(access_token) {
  const options = {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  }

  let url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.append("q", "podcast");
  url.searchParams.append("type", "show");
  url.searchParams.append("limit", PODCAST_LIMIT);
  url.searchParams.append("market", "US")

  // in spotify, shows are podcasts
  const {data: {shows: {items}}} = await axios.get(url.toString(), options);
  await Promise.all(items.map(async podcast => {
    shuffle(podcastGenres)
    finalJson[podcast.name] = {
      about: podcast.html_description,
      image: podcast.images[0].url,
      publisher: podcast.publisher,
      totalEpisodes: podcast.total_episodes,
      episodes: [],
      genres: [podcastGenres[0], podcastGenres[1]],
    };

    url = new URL(`https://api.spotify.com/v1/shows/${podcast.id}/episodes`);
    url.searchParams.append("limit", EPISODES_LIMIT);
    const {data: {items: episodes}} = await axios.get(url.toString(), options);

    const foundPodcast = finalJson[podcast.name];
    foundPodcast.episodes = episodes.map(episode => {
      if (episode === null) return;
      return ({
        name: episode.name,
        description: episode.html_description,
        image: episode.images[0].url,
        durationMs: episode.duration_ms,
        releaseDate: episode.release_date
      });
    });
    foundPodcast.episodes = foundPodcast.episodes.filter(episode => episode != null);
  }));
}

(async () => {
  const access_token = await getAccessToken();
  await getPodcasts(access_token);

  console.log(finalJson)
  writeFileSync("podcastData.json", JSON.stringify(finalJson));
})();